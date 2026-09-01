import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
  orderStatusLabel,
  orderStatusTone,
  StatusBadge,
} from "@/components/StatusBadge";
import { listOrders } from "@/server/orders";
import { formatARS, formatDate } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Listado de pedidos — panel demo",
};

export default async function AdminOrdersPage() {
  const { orders, source } = await listOrders(15);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        Pedidos
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {source === "db"
          ? "Pedidos desde la base local"
          : "Demostración: base local inactiva; corré npm.cmd run db:seed para ver los pedidos de ejemplo."}
      </p>

      <AdminNav active="/admin/pedidos" />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Nº pedido</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Ítems</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Pago</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-bold text-slate-800">
                    #{o.orderNumber}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{o.customerName}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{o.itemsCount}</td>
                  <td className="px-5 py-3 font-bold text-slate-900">
                    {formatARS(o.total)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={orderStatusTone(o.paymentStatus)}>
                      {orderStatusLabel(o.paymentStatus)}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={orderStatusTone(o.status)}>
                      {orderStatusLabel(o.status)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        El detalle de cada pedido (ítems, factura, seguimiento) y el cambio de
        estado estarán en la versión completa del panel.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        ← Volver a la tienda
      </Link>
    </div>
  );
}