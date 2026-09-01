import { prisma } from "@/lib/prisma";
import type { CategoryView } from "@/types/catalog";

// Data-access layer for categories. Returns raw rows and a small helper to
// build the tree (top-level with children), used by the UI and the API.

export async function findCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
      sortOrder: true,
      description: true,
    },
  });
}

export function buildCategoryTree(
  rows: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    sortOrder: number;
  }>
): CategoryView[] {
  const byId = new Map<string, CategoryView>();
  for (const r of rows) {
    byId.set(r.id, { id: r.id, name: r.name, slug: r.slug, sortOrder: r.sortOrder, children: [] });
  }
  const roots: CategoryView[] = [];
  for (const r of rows) {
    const node = byId.get(r.id)!;
    if (r.parentId && byId.has(r.parentId)) {
      byId.get(r.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}