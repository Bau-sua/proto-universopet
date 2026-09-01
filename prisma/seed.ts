// ============================================================================
// Seed — populates the local SQLite demo database.
// Run with:  npm run db:seed   (tsx prisma/seed.ts)
//
// Idempotent: every entity is upserted by its fixed demo id, so re-running
// after `prisma db push` is safe. The canonical data lives in
// src/lib/mock-data.ts (the UI falls back to it when the DB is unavailable),
// so demo catalog, seed and UI never drift apart.
// ============================================================================

import { PrismaClient } from "@prisma/client";
import {
  demoCategories,
  demoCoupons,
  demoCustomer,
  demoCustomerAddress,
  demoLocation,
  demoNotifications,
  demoOrders,
  demoProducts,
  demoStock,
  demoSubscription,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

const dayMs = 24 * 60 * 60 * 1000;

async function main() {
  console.log("[seed] Starting...");

  // --- Location ------------------------------------------------------------
  await prisma.location.upsert({
    where: { id: demoLocation.id },
    update: {},
    create: {
      id: demoLocation.id,
      name: demoLocation.name,
      type: demoLocation.type,
      servesOnline: demoLocation.servesOnline,
      addressLine1: demoLocation.addressLine1,
      city: demoLocation.city,
      province: demoLocation.province,
      postalCode: demoLocation.postalCode,
      phone: demoLocation.phone,
    },
  });
  console.log(`[seed] Location: ${demoLocation.name}`);

  // --- Categories ------------------------------------------------------------
  for (const c of demoCategories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, sortOrder: c.sortOrder, isActive: c.isActive },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentSlug
          ? demoCategories.find((p) => p.slug === c.parentSlug)?.id ?? null
          : null,
        description: c.description,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
      },
    });
  }
  console.log(`[seed] Categories: ${demoCategories.length}`);

  // --- Products, variants, images ------------------------------------------
  for (const p of demoProducts) {
    const parentId =
      demoCategories.find((c) => c.slug === p.categorySlug)?.id ?? null;
    if (!parentId) {
      throw new Error(`[seed] Category not found for product ${p.slug}`);
    }

    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        tags: JSON.stringify(p.tags),
      },
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        categoryId: parentId,
        weightGrams: p.weightGrams,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        tags: JSON.stringify(p.tags),
      },
    });

    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { id: v.id },
        update: { price: v.price, isActive: v.isActive },
        create: {
          id: v.id,
          productId: p.id,
          sku: v.sku,
          name: v.name,
          price: v.price,
          attributes: JSON.stringify(v.attributes),
          imageUrl: v.imageUrl,
          isActive: v.isActive,
          sortOrder: v.sortOrder,
        },
      });
    }

    for (const i of p.images) {
      await prisma.productImage.upsert({
        where: { id: i.id },
        update: { url: i.url, altText: i.altText, isPrimary: i.isPrimary },
        create: {
          id: i.id,
          productId: p.id,
          url: i.url,
          altText: i.altText,
          sortOrder: i.sortOrder,
          isPrimary: i.isPrimary,
        },
      });
    }
  }
  console.log(`[seed] Products: ${demoProducts.length}`);

  // --- Stock by location (multi-store ready) ------------------------------
  for (const s of demoStock) {
    const product = demoProducts.find((p) => p.slug === s.productSlug);
    if (!product) throw new Error(`[seed] Product not found: ${s.productSlug}`);
    const variant = s.variantSku
      ? product.variants.find((v) => v.sku === s.variantSku)
      : null;
    if (s.variantSku && !variant) {
      throw new Error(`[seed] Variant not found: ${s.variantSku}`);
    }

    await prisma.stockByLocation.upsert({
      where: { id: s.id },
      update: {
        quantityAvailable: s.quantityAvailable,
        quantityReserved: s.quantityReserved,
        reorderThreshold: s.reorderThreshold,
      },
      create: {
        id: s.id,
        productId: product.id,
        variantId: variant?.id ?? null,
        locationId: demoLocation.id,
        quantityAvailable: s.quantityAvailable,
        quantityReserved: s.quantityReserved,
        reorderThreshold: s.reorderThreshold,
      },
    });
  }
  console.log(`[seed] Stock entries: ${demoStock.length}`);

  // --- Demo movements (immutable inventory audit trail) ---------------------
  const balPerro = demoProducts.find(
    (p) => p.slug === "balanceado-premium-perro-adulto-15kg"
  )!;
  const arena = demoProducts.find((p) => p.slug === "arena-sanitaria-aglomerante-20kg")!;

  const movements = [
    {
      id: "mov-001",
      productId: balPerro.id,
      variantId: balPerro.variants[1].id,
      quantity: 20,
      type: "RECEIPT" as const,
      reason: "Recepción de reposición proveedor",
      referenceId: "receipt-2026-08-12",
    },
    {
      id: "mov-002",
      productId: balPerro.id,
      variantId: balPerro.variants[1].id,
      quantity: -1,
      type: "SALE" as const,
      reason: "Pedido #1001",
      referenceId: "order-1001",
    },
    {
      id: "mov-003",
      productId: arena.id,
      variantId: null,
      quantity: 20,
      type: "RECEIPT" as const,
      reason: "Recepción de reposición proveedor",
      referenceId: "receipt-2026-08-15",
    },
  ];

  for (const m of movements) {
    await prisma.stockMovement.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        productId: m.productId,
        variantId: m.variantId,
        locationId: demoLocation.id,
        quantity: m.quantity,
        type: m.type,
        reason: m.reason,
        referenceId: m.referenceId,
      },
    });
  }
  console.log(`[seed] Stock movements: ${movements.length}`);

  // --- Customer + address ----------------------------------------------------
  await prisma.customer.upsert({
    where: { id: demoCustomer.id },
    update: { name: demoCustomer.name, phone: demoCustomer.phone },
    create: {
      id: demoCustomer.id,
      email: demoCustomer.email,
      name: demoCustomer.name,
      phone: demoCustomer.phone,
      dni: demoCustomer.dni,
      isActive: true,
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: demoCustomerAddress.id },
    update: {},
    create: {
      id: demoCustomerAddress.id,
      customerId: demoCustomer.id,
      label: demoCustomerAddress.label,
      street: demoCustomerAddress.street,
      streetNumber: demoCustomerAddress.streetNumber,
      city: demoCustomerAddress.city,
      province: demoCustomerAddress.province,
      postalCode: demoCustomerAddress.postalCode,
      isDefault: true,
    },
  });
  console.log(`[seed] Customer: ${demoCustomer.name}`);

  // --- Orders + items (snapshots) -------------------------------------------
  for (const o of demoOrders) {
    const createdAt = new Date(Date.now() - o.daysAgo * dayMs);

    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {
        status: o.status,
        paymentStatus: o.paymentStatus,
        shippingCost: o.shippingCost,
        createdAt,
      },
      create: {
        id: o.id,
        orderNumber: o.orderNumber,
        customerId: demoCustomer.id,
        status: o.status,
        subtotal: o.subtotal,
        shippingCost: o.shippingCost,
        discountAmount: o.discountAmount,
        taxAmount: o.taxAmount,
        total: o.total,
        assignedLocationId: demoLocation.id,
        shippingAddressId: demoCustomerAddress.id,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        invoiceType: o.invoiceType,
        invoiceNumber: o.invoiceNumber,
        invoiceCae: o.invoiceCae,
        createdAt,
      },
    });

    for (const item of o.items) {
      const product = demoProducts.find(
        (p) => p.slug === item.productSlug
      )!;
      const variant = item.variantSku
        ? product.variants.find((v) => v.sku === item.variantSku)
        : null;

      await prisma.orderItem.upsert({
        where: { id: item.id },
        update: { quantity: item.quantity, totalPrice: item.totalPrice },
        create: {
          id: item.id,
          orderId: o.id,
          productId: product.id,
          variantId: variant?.id ?? null,
          locationId: demoLocation.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          productName: item.productName,
          variantName: item.variantName,
        },
      });
    }
  }
  console.log(`[seed] Orders: ${demoOrders.length}`);

  // --- Subscription -----------------------------------------------------------
  const subProduct = demoProducts.find(
    (p) => p.slug === demoSubscription.productSlug
  )!;
  const subVariant = subProduct.variants.find(
    (v) => v.sku === demoSubscription.variantSku
  )!;

  await prisma.subscription.upsert({
    where: { id: demoSubscription.id },
    update: { status: demoSubscription.status },
    create: {
      id: demoSubscription.id,
      customerId: demoCustomer.id,
      productId: subProduct.id,
      variantId: subVariant.id,
      quantity: demoSubscription.quantity,
      frequency: demoSubscription.frequency,
      pricePerDelivery: demoSubscription.pricePerDelivery,
      status: demoSubscription.status,
      nextDeliveryDate: new Date(
        Date.now() + demoSubscription.nextDeliveryDateOffsetDays * dayMs
      ),
      mercadopagoPreapprovalId: demoSubscription.mercadopagoPreapprovalId,
    },
  });
  console.log("[seed] Subscription: 1 (alimento mensual)");

  // --- Coupons ---------------------------------------------------------------
  for (const c of demoCoupons) {
    await prisma.coupon.upsert({
      where: { id: c.id },
      update: { isActive: c.isActive, currentUses: c.currentUses },
      create: {
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        minimumOrderAmount: c.minimumOrderAmount,
        maximumUses: c.maximumUses,
        currentUses: c.currentUses,
        isActive: c.isActive,
        startsAt: new Date(Date.now() - 30 * dayMs),
        expiresAt: new Date(Date.now() + 120 * dayMs),
      },
    });
  }
  console.log(`[seed] Coupons: ${demoCoupons.length}`);

  // --- Notifications ------------------------------------------------------------
  for (const n of demoNotifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        referenceType: n.referenceType,
        referenceId: n.referenceId,
        isRead: n.isRead,
      },
    });
  }
  console.log(`[seed] Notifications: ${demoNotifications.length}`);

  console.log("[seed] Done ✔");
}

main()
  .catch((err) => {
    console.error("[seed] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });