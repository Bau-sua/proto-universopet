import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/schemas";
import { createOrder } from "@/server/orders";

// Write-pattern example: validate with zod, delegate to the business layer.
// The demo checkout calls this endpoint; when the DB has not been pushed yet
// the client-side demo gracefully falls back to a simulated success.

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de pedido inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder(parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido";
    const dbUnavailable =
      /(no such table)|(SQLITE_ERROR)|(table .* does not exist)/i.test(message);
    return NextResponse.json(
      {
        error: dbUnavailable
          ? "Base de datos no disponible (ejecutá: npx.cmd prisma db push && npm.cmd run db:seed)"
          : "No se pudo crear el pedido",
        details: message,
      },
      { status: dbUnavailable ? 503 : 500 }
    );
  }
}