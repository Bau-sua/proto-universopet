import { prisma } from "@/lib/prisma";
import type { StockAlertView } from "@/types";

// Data-access layer for inventory. Stock is stored per location
// (multi-store ready); the mockup uses a single active location.

export async function findStockAlerts(): Promise<StockAlertView[]> {
  const rows = await prisma.stockByLocation.findMany({
    where: {
      quantityAvailable: { lte: prisma.stockByLocation.fields.reorderThreshold },
    },
    include: {
      product: { select: { name: true, sku: true } },
      variant: { select: { name: true, sku: true } },
      location: { select: { name: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    productName: r.product.name,
    variantName: r.variant?.name ?? null,
    sku: r.variant?.sku ?? r.product.sku,
    quantityAvailable: r.quantityAvailable,
    reorderThreshold: r.reorderThreshold,
    locationName: r.location.name,
  }));
}

export interface StockRow {
  id: string;
  sku: string;
  name: string;
  variantName: string | null;
  quantityAvailable: number;
  quantityReserved: number;
  reorderThreshold: number;
}

export async function listStock(): Promise<StockRow[]> {
  const rows = await prisma.stockByLocation.findMany({
    include: {
      product: { select: { sku: true, name: true } },
      variant: { select: { name: true, sku: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    sku: r.variant?.sku ?? r.product.sku,
    name: r.product.name,
    variantName: r.variant?.name ?? null,
    quantityAvailable: r.quantityAvailable,
    quantityReserved: r.quantityReserved,
    reorderThreshold: r.reorderThreshold,
  }));
}