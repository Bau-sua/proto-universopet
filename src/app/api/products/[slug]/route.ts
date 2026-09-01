import { NextResponse } from "next/server";
import { getCatalogProduct } from "@/server/catalog";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}