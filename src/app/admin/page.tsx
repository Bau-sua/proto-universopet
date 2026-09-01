import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
  orderStatusLabel,
  orderStatusTone,
  StatusBadge,
} from "@/components/StatusBadge";
import { AlertIcon, CartIcon, PawIcon, TruckIcon } from "@/components/icons";
import { getDashboardStats } from "@/server/orders";
import { formatARS, formatDate } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de administración demo — Huellitas Pet Shop",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Ingresos (7 días)",
      value: formatARS(stats.revenue7d),
      icon: <PawIcon className="h-5 w-5" />,
      tone: "bg-brand-50 text-brand-600",
    },
    {
      label: "Pedidos (7 días)",
      value: String(stats.orders7d),
      icon: <CartIcon className="h-5 w-5" />,
      tone: "bg-accent-50 text-accent-600",
    },
    {
      label: "Ticket promedio",
      value: formatARS(stats.averageTicket7d),
      icon: <TruckIcon className="h-5 w-5" />,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Alertas de stock",
      value: String(stats.lowStockCount),
      icon: <AlertIcon className="h-5 w-5" />,
      tone: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Resumen de la operación {stats.source === "db" ? "(datos de la base local)" : "(datos de ejemplo)"}
      </p>

      <AdminNav active="/admin" />

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
              {card.icon}
            </span>
            <p className="mt-3 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {card.value}
            </p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Últimos pedidos</h2>
            <Link
              href="/admin/pedidos"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver todos →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-3 font-semibold">Nº</th>
                  <th className="py-2 pr-3 font-semibold">Cliente</th>
                  <th className="py-2 pr-3 font-semibold">Fecha</th>
                  <th className="py-2 pr-3 font-semibold">Total</th>
                  <th className="py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3 font-semibold text-slate-800">
                      #{o.orderNumber}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{o.customerName}</td>
                    <td className="py-2.5 pr-3 text-slate-500">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-slate-800">
                      {formatARS(o.total)}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge tone={orderStatusTone(o.status)}>
                        {orderStatusLabel(o.status)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stock alerts */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Alertas de stock</h2>
            <Link
              href="/admin/productos"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver stock →
            </Link>
          </div>
          {stats.stockAlerts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Todo en niveles saludables. Sin alertas.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.stockAlerts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-red-50/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {a.productName}
                      {a.variantName ? ` · ${a.variantName}` : ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      SKU {a.sku} · {a.locationName}
                    </p>
                  </div>
                  <StatusBadge tone="red">
                    {a.quantityAvailable} de mín. {a.reorderThreshold}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}