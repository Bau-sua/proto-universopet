// ============================================================================
// Catalog business logic (protocol-agnostic: no Next.js imports).
//
// Orchestrates repositories, maps raw rows to UI-friendly view models and
// DEGRADES GRACEFULLY: when the database is unavailable (fresh clone without
// `prisma db push`), it falls back to the demo mock catalog so the client
// demo always renders.
// ============================================================================

import { findProducts, findProductBySlug } from "@/data/products";
import { findCategories, buildCategoryTree } from "@/data/categories";
import type { ProductQuery } from "@/lib/schemas";
import {
  demoCategories,
  filterMockProducts,
  toProductView,
  getProductBySlug,
} from "@/lib/mock-data";
import type { CatalogResult, CategoryView, ProductView } from "@/types/catalog";

// ---------------------------------------------------------------------------
// Prisma row -> ProductView mapping
// ---------------------------------------------------------------------------

interface StockRowLike {
  variantId: string | null;
  quantityAvailable: number;
  quantityReserved: number;
}

function mapProductToView(
  row: Awaited<ReturnType<typeof findProducts>>[number]
): ProductView {
  const variantStock = new Map<string, number>();
  let productBaseStock = 0;

  for (const s of row.stock as StockRowLike[]) {
    const available = s.quantityAvailable - s.quantityReserved;
    if (s.variantId) {
      variantStock.set(s.variantId, available);
    } else {
      productBaseStock += available;
    }
  }

  const variants = row.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    name: v.name,
    price: v.price,
    attributes: safeParseJson<Record<string, string>>(v.attributes),
    imageUrl: v.imageUrl,
    stockAvailable: variantStock.get(v.id) ?? productBaseStock,
  }));

  // Product-level availability: base stock, or max of variant stock.
  const stockAvailable =
    variants.length > 0
      ? Math.max(...variants.map((v) => v.stockAvailable), 0)
      : productBaseStock;

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    categorySlug: row.category.slug,
    categoryName: row.category.name,
    weightGrams: row.weightGrams,
    isFeatured: row.isFeatured,
    tags: safeParseJson<string[]>(row.tags),
    images: row.images.map((i) => ({
      id: i.id,
      url: i.url,
      altText: i.altText ?? "",
      isPrimary: i.isPrimary,
    })),
    variants,
    stockAvailable,
    source: "db",
  };
}

function safeParseJson<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return (Array.isArray(raw) ? [] : {}) as T;
  }
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getCatalogProducts(
  query: ProductQuery
): Promise<CatalogResult> {
  try {
    const rows = await findProducts(query);
    if (rows.length > 0) {
      return { source: "db", products: rows.map(mapProductToView) };
    }
  } catch (err) {
    console.warn(
      "[catalog] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }
  return {
    source: "mock",
    products: filterMockProducts({
      categoria: query.categoria,
      q: query.q,
      destacados: query.destacados === "true",
      limite: query.limite,
    }),
  };
}

export async function getCatalogProduct(
  slug: string
): Promise<ProductView | null> {
  try {
    const row = await findProductBySlug(slug);
    if (row) return mapProductToView(row);
  } catch (err) {
    console.warn(
      "[catalog] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }
  const mock = getProductBySlug(slug);
  return mock ? toProductView(mock, "mock") : null;
}

export async function getCatalogCategories(): Promise<CategoryView[]> {
  try {
    const rows = await findCategories();
    if (rows.length > 0) return buildCategoryTree(rows);
  } catch (err) {
    console.warn(
      "[catalog] Database unavailable, using mock data:",
      err instanceof Error ? err.message : err
    );
  }

  // Mock fallback: build the tree from demo categories.
  return buildCategoryTree(
    demoCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentSlug
        ? demoCategories.find((p) => p.slug === c.parentSlug)?.id ?? null
        : null,
      sortOrder: c.sortOrder,
    }))
  );
}