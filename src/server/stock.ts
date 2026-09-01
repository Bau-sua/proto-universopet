// ============================================================================
// Stock business logic (protocol-agnostic).
// The mockup exposes availability checks and stock alerts; reservation is
// stubbed with a clear TODO for the production transactional flow (the guide
// requires reserve-on-order, release-on-cancel inside a DB transaction).
// ============================================================================

import { findStockAlerts, listStock } from "@/data/stock";
import { demoProducts, demoStock } from "@/lib/mock-data";
import type { StockAlertView } from "@/types";

export async function getStockAlerts(): Promise<{
  alerts: StockAlertView[];
  source: "db" | "mock";
}> {
  try {
    const alerts = await findStockAlerts();
    if (alerts.length > 0) return { alerts, source: "db" };
  } catch (err) {
    console.warn(
      "[stock] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }
  // Mock fallback: same data the seed writes, so both sources agree.
  const alerts: StockAlertView[] = demoStock
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
  return { alerts, source: "mock" };
}

/**
 * Reserves quantity for an order line (stub for the mockup).
 * Production: run inside the create-order transaction, decrement
 * quantityAvailable and increment quantityReserved on StockByLocation.
 */
export async function reserveStock(_input: {
  productId: string;
  variantId: string | null;
  locationId: string;
  quantity: number;
}): Promise<void> {
  console.warn(
    "[stock] reserveStock is a stub in the mockup — implement transactional reservation for production."
  );
}

export async function getStockOverview() {
  try {
    const rows = await listStock();
    if (rows.length > 0) return { rows, source: "db" as const };
  } catch (err) {
    console.warn(
      "[stock] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }
  return { rows: [], source: "mock" as const };
}