// ============================================================================
// Orders business logic (protocol-agnostic: no Next.js imports).
// Orchestrates: validation (zod), cart math, customer/address persistence,
// integration stubs (email + AFIP) and the order repository.
// ============================================================================

import { createOrderSchema, type CreateOrderPayload } from "@/lib/schemas";
import {
  createOrder as createOrderRepo,
  findOrderStats,
  findRecentOrders,
  type OrderDraft,
} from "@/data/orders";
import {
  findOrCreateCustomer,
  findOrCreateAddress,
  findActiveLocation,
} from "@/data/customers";
import { prisma } from "@/lib/prisma";
import { computeCartTotals } from "@/server/cart";
import { DEMO_COUPONS } from "@/lib/constants";
import { sendOrderConfirmation } from "@/services/email";
import { createInvoice } from "@/services/afip";
import type { CartLine } from "@/types/catalog";

export async function createOrder(payload: unknown) {
  const parsed = createOrderSchema.parse(payload) as CreateOrderPayload;

  // --- resolve customer + address ------------------------------------------
  const customer = await findOrCreateCustomer({
    email: parsed.customerEmail,
    name: parsed.customerName,
    phone: parsed.customerPhone,
    dni: parsed.customerDni,
  });
  const address = await findOrCreateAddress(customer.id, parsed.shippingAddress);
  const location = await findActiveLocation();

  // --- price math: same pure function the client cart uses ------------------
  const lines: CartLine[] = parsed.items.map((i) => ({
    productId: i.productId,
    slug: i.productId,
    name: i.productId,
    imageUrl: "",
    variantId: i.variantId ?? null,
    variantName: null,
    unitPrice: i.unitPrice,
    quantity: i.quantity,
  }));

  // Resolve coupon from the Coupon table (mockup: demo coupons map).
  // In production: query the Coupon table and honor validity/usage limits.
  const couponCode = parsed.couponCode?.toUpperCase() ?? "";
  const coupon = couponCode ? DEMO_COUPONS[couponCode] ?? null : null;
  const totals = computeCartTotals(
    lines,
    coupon ? { ...coupon, code: couponCode } : null
  );

  // --- snapshot line names/prices for the order items -----------------------
  const productRows = await prisma.product.findMany({
    where: { id: { in: parsed.items.map((i) => i.productId) } },
    select: { id: true, name: true, slug: true, price: true },
  });
  const productNameById = new Map(productRows.map((p) => [p.id, p]));

  const draft: OrderDraft = {
    customerId: customer.id,
    subtotal: totals.subtotal,
    shippingCost: totals.shippingCost,
    discountAmount: totals.discountAmount,
    total: totals.total,
    paymentMethod: parsed.paymentMethod,
    assignedLocationId: location?.id,
    shippingAddressId: address.id,
    items: parsed.items.map((i) => {
      const product = productNameById.get(i.productId);
      return {
        productId: i.productId,
        variantId: i.variantId ?? null,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
        productName: product?.name ?? i.productId,
        variantName: null, // resolved from the variant table in production
      };
    }),
  };

  const order = await createOrderRepo(draft);

  // --- integrations (stubbed) ------------------------------------------------
  // Production: only after a verified payment webhook — invoice via AFIP
  // (CAE), then confirmation email. Here we log the same intent.
  const invoice = parsed.customerDni
    ? await createInvoice({
        orderNumber: order.orderNumber,
        customerDni: parsed.customerDni,
        customerName: parsed.customerName,
        total: totals.total,
        paymentMethod: parsed.paymentMethod ?? "MERCADOPAGO",
      })
    : null;
  await sendOrderConfirmation({
    to: parsed.customerEmail,
    orderNumber: order.orderNumber,
    total: totals.total,
  });

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    total: totals.total,
    invoice,
    demo: true as const,
  };
}

export async function listOrders(limit = 8) {
  try {
    const orders = await findRecentOrders(limit);
    if (orders.length > 0) return { orders, source: "db" as const };
  } catch (err) {
    console.warn(
      "[orders] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }
  const { demoOrders } = await import("@/lib/mock-data");
  return {
    orders: demoOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: "María González",
      createdAt: new Date(Date.now() - o.daysAgo * 24 * 60 * 60 * 1000),
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      itemsCount: o.items.length,
      source: "mock" as const,
    })),
    source: "mock" as const,
  };
}

export async function getDashboardStats() {
  try {
    const [stats, recentOrders, lowStockAlerts] = await Promise.all([
      findOrderStats(7),
      findRecentOrders(6),
      import("@/data/stock").then((m) => m.findStockAlerts()),
    ]);
    const avgTicket =
      stats.orders7d > 0 ? Math.round(stats.revenue7d / stats.orders7d) : 0;
    return {
      revenue7d: stats.revenue7d,
      orders7d: stats.orders7d,
      averageTicket7d: avgTicket,
      lowStockCount: lowStockAlerts.length,
      recentOrders,
      stockAlerts: lowStockAlerts,
      source: "db" as const,
    };
  } catch (err) {
    console.warn(
      "[orders] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
    const { demoOrders, demoStock, demoProducts } = await import("@/lib/mock-data");
    const orders = demoOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: "María González",
      createdAt: new Date(Date.now() - o.daysAgo * 24 * 60 * 60 * 1000),
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      itemsCount: o.items.length,
      source: "mock" as const,
    }));
    const revenue7d = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);
    const lowStockCount = demoStock.filter(
      (s) => s.quantityAvailable - s.quantityReserved <= s.reorderThreshold
    ).length;
    const stockAlerts = demoStock
      .filter((s) => s.quantityAvailable - s.quantityReserved <= s.reorderThreshold)
      .map((s) => ({
        id: s.id,
        productName: demoProducts.find((p) => p.slug === s.productSlug)?.name ?? s.productSlug,
        variantName: s.variantSku ?? null,
        sku: s.variantSku ?? "",
        quantityAvailable: s.quantityAvailable - s.quantityReserved,
        reorderThreshold: s.reorderThreshold,
        locationName: "Sucursal Centro",
      }));
    return {
      revenue7d,
      orders7d: orders.length,
      averageTicket7d: orders.length > 0 ? Math.round(revenue7d / orders.length) : 0,
      lowStockCount,
      recentOrders: orders,
      stockAlerts,
      source: "mock" as const,
    };
  }
}