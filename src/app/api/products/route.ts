import { NextRequest, NextResponse } from "next/server";
import { productQuerySchema } from "@/lib/schemas";
import { getCatalogProducts } from "@/server/catalog";

// The API layer stays thin: validate input (zod) and delegate to the business
// layer. All catalog business logic lives in src/server/catalog.ts and the
// data repositories in src/data/*.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parsed = productQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { products, source } = await getCatalogProducts(parsed.data);

  return NextResponse.json({
    source,
    count: products.length,
    products,
  });
}