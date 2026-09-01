import type { ReactNode } from "react";

const TONE_CLASSES: Record<string, string> = {
  green: "bg-accent-50 text-accent-800",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-600",
  brand: "bg-brand-50 text-brand-800",
};

export function StatusBadge({
  status,
  tone = "slate",
  children,
}: {
  status?: string;
  tone?: keyof typeof TONE_CLASSES;
  children?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASSES[tone] ?? TONE_CLASSES.slate}`}
    >
      {children ?? status}
    </span>
  );
}

/** Maps an order status to a badge tone (es-AR labels). */
export function orderStatusTone(status: string): keyof typeof TONE_CLASSES {
  switch (status) {
    case "PAID":
    case "DELIVERED":
    case "COMPLETED":
      return "green";
    case "PROCESSING":
    case "SHIPPED":
    case "CONFIRMED":
      return "brand";
    case "PENDING":
      return "amber";
    case "CANCELLED":
    case "REFUNDED":
    case "FAILED":
      return "red";
    default:
      return "slate";
  }
}

export function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    PROCESSING: "En preparación",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    PAID: "Pagado",
    FAILED: "Fallido",
  };
  return labels[status] ?? status;
}