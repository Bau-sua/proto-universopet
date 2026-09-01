import { prisma } from "@/lib/prisma";
import type { ProductQuery } from "@/lib/schemas";

// Data-access layer: the ONLY place that touches the Prisma client for the
// catalog domain. Returns raw rows; mapping to view models happens in
// src/server/catalog.ts.

export async function findProducts(query: ProductQuery) {
  const { categoria, q, destacados, limite } = query;

  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(destacados ? { isFeatured: true } : {}),
      ...(categoria
        ? {
            OR: [
              { category: { slug: categoria } },
              { category: { parent: { slug: categoria } } },
            ],
          }
        : {}),
      ...(q
        ? {
            OR: [
              // NOTE: SQLite filtering is case-sensitive; PostgreSQL supports
              // mode: "insensitive" here without other changes.
              { name: { contains: q } },
              { sku: { contains: q } },
              { description: { contains: q } },
              { tags: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limite,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
        },
      },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          sku: true,
          name: true,
          price: true,
          attributes: true,
          imageUrl: true,
        },
      },
      stock: {
        select: {
          variantId: true,
          quantityAvailable: true,
          quantityReserved: true,
        },
      },
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
        },
      },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          sku: true,
          name: true,
          price: true,
          attributes: true,
          imageUrl: true,
        },
      },
      stock: {
        select: {
          variantId: true,
          quantityAvailable: true,
          quantityReserved: true,
        },
      },
    },
  });
}