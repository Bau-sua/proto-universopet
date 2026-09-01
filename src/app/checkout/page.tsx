"use client";

// Demo checkout: captures shipping data + payment method and POSTs to
// /api/orders (thin validation + business layer). When the local DB has not
// been initialized, the API answers 503 and the demo falls back to a
// simulated success — so the client demo never dead-ends.

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/Button";
import { PurchaseSuccess } from "@/components/PurchaseSuccess";
import { formatARS, DEMO_COUPONS } from "@/lib/constants";
import { computeCartTotals } from "@/server/cart";

const PROVINCES = [
  "CABA",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const PAYMENT_METHODS = [
  { value: "MERCADOPAGO", label: "MercadoPago (tarjeta, débito, efectivo)", hint: "Redirige a MercadoPago para pagar" },
  { value: "TRANSFER", label: "Transferencia bancaria", hint: "Te enviamos el CBU por WhatsApp" },
  { value: "CASH", label: "Efectivo al retirar", hint: "Retirá por la sucursal y pagá en efectivo" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const totals = useMemo(() => computeCartTotals(items, null), [items]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    orderNumber: number;
    simulated: boolean;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      customerName: String(data.get("name") ?? ""),
      customerEmail: String(data.get("email") ?? ""),
      customerPhone: String(data.get("phone") ?? ""),
      customerDni: String(data.get("dni") ?? ""),
      shippingAddress: {
        label: "Casa",
        street: String(data.get("street") ?? ""),
        streetNumber: String(data.get("streetNumber") ?? ""),
        city: String(data.get("city") ?? ""),
        province: String(data.get("province") ?? "CABA"),
        postalCode: String(data.get("postalCode") ?? ""),
      },
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      paymentMethod: String(data.get("paymentMethod") ?? "MERCADOPAGO"),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const order = (await res.json()) as { orderNumber: number };
        clear();
        setSuccess({ orderNumber: order.orderNumber, simulated: false });
      } else {
        // DB not available in the demo → simulate success so the flow demo
        // keeps going. The API response already explains how to enable it.
        const simulatedNumber = 9000 + Math.floor(Math.random() * 900);
        clear();
        setSuccess({ orderNumber: simulatedNumber, simulated: true });
      }
    } catch {
      clear();
      setSuccess({ orderNumber: 9000 + Math.floor(Math.random() * 900), simulated: true });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <PurchaseSuccess
        orderNumber={success.orderNumber}
        simulated={success.simulated}
        onContinue={() => {
          setSuccess(null);
          router.push("/productos");
        }}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">
          No hay productos para confirmar
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tu carrito está vacío. ¡Dale, mirá el catálogo!
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push("/productos")}>
            Ver productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Demo: no se realiza ningún cobro real ni envío.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Datos de contacto</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre y apellido" name="name" required placeholder="María González" />
              <Field label="Email" name="email" type="email" required placeholder="maria@example.com" />
              <Field label="Teléfono (WhatsApp)" name="phone" type="tel" placeholder="+54 9 11 5555-9876" />
              <Field label="DNI (para factura)" name="dni" inputMode="numeric" placeholder="30123456" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Envío</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Calle" name="street" required placeholder="Av. Rivadavia" />
              <Field label="Número" name="streetNumber" required inputMode="numeric" placeholder="3320" />
              <Field label="Ciudad / Localidad" name="city" required placeholder="CABA" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Provincia</span>
                  <select
                    name="province"
                    defaultValue="CABA"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Código postal" name="postalCode" required inputMode="numeric" placeholder="1203" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Método de pago</h2>
            <div className="mt-4 space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50/50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    defaultChecked={m.value === "MERCADOPAGO"}
                    className="mt-0.5 accent-brand-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      {m.label}
                    </span>
                    <span className="block text-xs text-slate-500">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          {formError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <OrderSummary
            paymentMethodLabel={
              PAYMENT_METHODS.find((m) => m.value === "MERCADOPAGO")?.label ?? ""
            }
          />
          <Button type="submit" disabled={submitting} className="mt-4 w-full">
            {submitting ? "Procesando…" : `Confirmar pedido · ${formatARS(totals.total)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Al confirmar simulás una compra demo. No se debita dinero.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

// Separated hook so OrderSummary and the page share the same totals source.
function OrderSummary({ paymentMethodLabel }: { paymentMethodLabel: string }) {
  const { items } = useCart();
  const totals = useMemo(() => computeCartTotals(items, null), [items]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Tu pedido</h2>
      <ul className="mt-4 space-y-3">
        {items.map((line) => (
          <li key={`${line.productId}:${line.variantId ?? ""}`} className="flex justify-between gap-2 text-sm">
            <span className="text-slate-600">
              {line.quantity} × {line.name}
              {line.variantName ? ` (${line.variantName})` : ""}
            </span>
            <span className="shrink-0 font-semibold text-slate-800">
              {formatARS(line.unitPrice * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold">{formatARS(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Envío</span>
          <span className="font-semibold">
            {totals.shippingCost === 0 ? "Gratis" : formatARS(totals.shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatARS(totals.total)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">Pago: {paymentMethodLabel}</p>
    </div>
  );
}