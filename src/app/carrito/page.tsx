"use client";

// Cart page (client): reads the cart context, renders lines with quantity
// controls and the shared totals summary.

import Image from "next/image";
import Link from "next/link";
import { lineKey, useCart } from "@/components/CartContext";
import { CartSummary } from "@/components/CartSummary";
import { Button } from "@/components/Button";
import {
  MinusIcon,
  PawIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import { formatARS } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-300">
          <PawIcon className="h-10 w-10" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Explorá el catálogo y agregá productos para tu mascota. Envío gratis
          en compras mayores a $60.000.
        </p>
        <Link href="/productos" className="mt-6">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Mi carrito
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.reduce((sum, i) => sum + i.quantity, 0)} productos en tu pedido
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="space-y-3">
          {items.map((line) => {
            const key = lineKey(line);
            return (
              <div
                key={key}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                  {line.imageUrl ? (
                    <Image
                      src={line.imageUrl}
                      alt={line.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <PawIcon className="absolute inset-0 m-auto h-6 w-6 text-slate-200" />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/productos/${line.slug}`}
                        className="text-sm font-semibold text-slate-900 hover:text-brand-700"
                      >
                        {line.name}
                      </Link>
                      {line.variantName && (
                        <p className="text-xs text-slate-400">
                          Presentación: {line.variantName}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(key)}
                      className="rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Quitar ${line.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(key, line.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-500 transition hover:text-brand-700"
                        aria-label="Disminuir cantidad"
                      >
                        <MinusIcon />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(key, line.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-500 transition hover:text-brand-700"
                        aria-label="Aumentar cantidad"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {formatARS(line.unitPrice * line.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}