// Shared constants used by both the presentation and business layers.

export const STORE_NAME = "Universo Pet";
export const STORE_TAGLINE = "Todo para tu mascota, con envío a tu casa";

// WhatsApp CTA (Argentina, E.164 without "+").
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491122334455";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "¡Hola! Quiero hacer una consulta sobre sus productos."
)}`;

// Shipping rules used by the cart demo.
export const FREE_SHIPPING_THRESHOLD = 60_000; // ARS: free shipping above this
export const SHIPPING_FLAT_RATE = 6_500; // ARS: flat urban shipping cost

// Demo coupons understood by the client cart. In production coupons come from
// the Coupon table (with validity windows and usage limits).
export interface DemoCoupon {
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minimumOrderAmount: number | null;
}

export const DEMO_COUPONS: Record<string, DemoCoupon> = {
  BIENVENIDA10: { type: "PERCENTAGE", value: 10, minimumOrderAmount: 20_000 },
  ENVIOGRATIS3: {
    type: "FREE_SHIPPING",
    value: SHIPPING_FLAT_RATE,
    minimumOrderAmount: 45_000,
  },
};

/** Formats an amount in Argentine pesos (es-AR locale). */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats a date for the es-AR locale, e.g. "1 sep 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}