import { prisma } from "@/lib/prisma";
import type { CreateOrderPayload } from "@/lib/schemas";
import type { OrderView } from "@/types";

// Data-access layer for orders.
// NOTE: in production the "create" flow must run inside a transaction with
// stock reservation (see src/server/orders.ts and src/lib/db.ts).

export interface OrderDraft {
  customerId: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  paymentMethod: CreateOrderPayload["paymentMethod"];
  assignedLocationId?: string;
  shippingAddressId?: string;
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productName: string;
    variantName: string | null;
  }>;
}

export async function createOrder(draft: OrderDraft) {
  // SQLite only supports autoincrement() on id columns, so the sequential
  // order number is assigned here (max + 1). On PostgreSQL the schema can use
  // @default(autoincrement()) and this line is replaced by the DB default.
  const last = await prisma.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  return prisma.order.create({
    data: {
      orderNumber: (last?.orderNumber ?? 1000) + 1,
      customerId: draft.customerId,
      status: "PENDING",
      subtotal: draft.subtotal,
      shippingCost: draft.shippingCost,
      discountAmount: draft.discountAmount,
      taxAmount: 0,
      total: draft.total,
      paymentMethod: draft.paymentMethod,
      paymentStatus: "PENDING",
      assignedLocationId: draft.assignedLocationId,
      shippingAddressId: draft.shippingAddressId,
      items: { create: draft.items },
    },
    include: { items: true },
  });
}

export async function findRecentOrders(limit = 8): Promise<OrderView[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      customer: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.orderNumber,
    customerName: r.customer.name,
    createdAt: r.createdAt,
    total: r.total,
    status: r.status,
    paymentStatus: r.paymentStatus,
    itemsCount: r._count.items,
    source: "db",
  }));
}

export async function findOrderStats(sinceDays: number) {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
    select: { total: true, status: true },
  });
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  return { orders7d: orders.length, revenue7d: revenue };
}