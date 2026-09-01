"use client";

// Cart summary with coupon input — re-uses the SAME pure money math
// (src/server/cart.ts) that the server applies at order creation, so the demo
// cart and the created order can never disagree on totals.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/Button";
import { formatARS, DEMO_COUPONS } from "@/lib/constants";
import { computeCartTotals } from "@/server/cart";

export function CartSummary() {
  const { items } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [, setCouponError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const code = couponCode.trim().toUpperCase();
    const coupon = code ? DEMO_COUPONS[code] ?? null : null;
    return computeCartTotals(items, coupon ? { ...coupon, code } : null);
  }, [items, couponCode]);

  function applyCoupon() {
    // computeCartTotals already resolved the coupon + error message.
    setCouponError(totals.couponErrorMessage);
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Resumen del pedido</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} ítems)</span>
          <span className="font-semibold text-slate-800">
            {formatARS(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Envío</span>
          <span className="font-semibold text-slate-800">
            {totals.shippingCost === 0 ? (
              <span className="font-semibold text-accent-600">Gratis</span>
            ) : (
              formatARS(totals.shippingCost)
            )}
          </span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="flex justify-between text-accent-700">
            <span>Descuento ({totals.couponApplied?.code})</span>
            <span className="font-semibold">
              -{formatARS(totals.discountAmount)}
            </span>
          </div>
        )}
        {!totals.freeShippingApplied &&
          totals.shippingCost > 0 &&
          items.length > 0 && (
            <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">
              Te faltan{" "}
              <strong>
                {formatARS(Math.max(0, 60000 - (totals.subtotal - totals.discountAmount)))}
              </strong>{" "}
              para obtener envío gratis.
            </p>
          )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="flex justify-between text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatARS(totals.total)}</span>
        </div>
      </div>

      {/* Coupon input (demo: BIENVENIDA10 / ENVIOGRATIS3) */}
      <div className="mt-4">
        <label htmlFor="coupon" className="text-xs font-semibold text-slate-500">
          Cupón de descuento
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="coupon"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponError(null);
            }}
            placeholder="Ej: BIENVENIDA10"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={applyCoupon}
            className="shrink-0"
          >
            Aplicar
          </Button>
        </div>
        {totals.couponErrorMessage && (
          <p className="mt-1.5 text-xs text-red-600">{totals.couponErrorMessage}</p>
        )}
        {totals.couponApplied && !totals.couponErrorMessage && (
          <p className="mt-1.5 text-xs text-accent-700">
            Cupón {totals.couponApplied.code} aplicado (-{formatARS(totals.discountAmount)})
          </p>
        )}
      </div>

      <Link href="/checkout" className="mt-5 block">
        <Button className="w-full">Ir al checkout</Button>
      </Link>
      <Link
        href="/productos"
        className="mt-2 block text-center text-sm font-medium text-brand-600 transition hover:text-brand-700"
      >
        Seguir comprando
      </Link>
    </div>
  );
}