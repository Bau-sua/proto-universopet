// ============================================================================
// Cart business logic — pure functions (no DB, no Next.js), safe to use from
// client components. In production the same math applies server-side at order
// creation time; here it powers the demo cart AND the order totals.
// ============================================================================

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT_RATE,
  type DemoCoupon,
} from "@/lib/constants";
import type { CartLine, CartTotals, CouponInput } from "@/types/catalog";

/**
 * Computes cart totals applying, in order:
 *  1. subtotal
 *  2. percentage / fixed-amount coupon discount
 *  3. free-shipping coupon OR free shipping above the threshold
 *
 * Returns totals plus which coupon was applied (or an error message when the
 * coupon is invalid for this cart).
 */
export function computeCartTotals(
  items: CartLine[],
  coupon?: Pick<CouponInput, "code" | "type" | "value" | "minimumOrderAmount"> | null
): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  let discountAmount = 0;
  let couponApplied: CouponInput | null = null;
  let couponErrorMessage: string | null = null;

  if (coupon) {
    if (coupon.minimumOrderAmount !== null && subtotal < coupon.minimumOrderAmount) {
      couponErrorMessage =
        "El cupón requiere un mínimo de compra de " +
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(coupon.minimumOrderAmount);
    } else if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      couponApplied = coupon;
    } else if (coupon.type === "FIXED_AMOUNT") {
      discountAmount = Math.min(coupon.value, subtotal);
      couponApplied = coupon;
    } else if (coupon.type === "FREE_SHIPPING") {
      couponApplied = coupon;
      // shipping becomes 0 via the branch below
    } else {
      couponErrorMessage = "Cupón no válido";
    }
  }

  const freeShippingApplied = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD;
  const shippingCost =
    subtotal === 0 || freeShippingApplied || coupon?.type === "FREE_SHIPPING"
      ? 0
      : SHIPPING_FLAT_RATE;

  return {
    subtotal,
    shippingCost,
    discountAmount,
    total: Math.max(0, subtotal - discountAmount + shippingCost),
    freeShippingApplied,
    couponApplied,
    couponErrorMessage,
  };
}

export type { DemoCoupon };