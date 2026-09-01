import { NextResponse } from "next/server";
import { getCatalogCategories } from "@/server/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCatalogCategories();
  return NextResponse.json({ count: categories.length, categories });
}