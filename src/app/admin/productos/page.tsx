import type { Metadata } from "next";
import { AdminNav } from "@/components/AdminNav";
import { getStockOverview } from "@/server/stock";

export const metadata: Metadata = {
  title: "Productos y stock",
  description: "Gestión de productos y stock — panel demo",
};

export default async function AdminProductsPage() {
  const { rows, source } = await getStockOverview();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        Productos y stock
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {source === "db"
          ? "Stock por ubicación (datos de la base local)"
          : "Demostración: la base local no está activa; corré npm.cmd run db:seed para ver datos reales."}
      </p>

      <AdminNav active="/admin/productos" />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            Stock no disponible. Ejecutá{" "}
            <code className="font-mono text-xs">npx.cmd prisma db push</code> y{" "}
            <code className="font-mono text-xs">npm.cmd run db:seed</code>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Producto</th>
                  <th className="px-5 py-3 font-semibold">SKU</th>
                  <th className="px-5 py-3 font-semibold">Presentación</th>
                  <th className="px-5 py-3 font-semibold">Disponible</th>
                  <th className="px-5 py-3 font-semibold">Reservado</th>
                  <th className="px-5 py-3 font-semibold">Reposición</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const low = row.quantityAvailable <= row.reorderThreshold;
                  return (
                    <tr key={row.id} className="border-b border-slate-50 last:border-0">
                      <td className="max-w-[260px] truncate px-5 py-3 font-medium text-slate-800">
                        {row.name}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">
                        {row.sku}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {row.variantName ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            low
                              ? "bg-red-50 text-red-700"
                              : "bg-accent-50 text-accent-800"
                          }`}
                        >
                          {row.quantityAvailable}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {row.quantityReserved}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {row.reorderThreshold}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stub actions showing the product CRUD surface */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Alta de producto",
            text: "Formulario con variantes, precios, imágenes y stock por ubicación.",
          },
          {
            title: "Edición masiva",
            text: "Cambios de precio / estado en lote con auditoría de movimientos.",
          },
          {
            title: "Importar catálogo",
            text: "Carga desde planilla (alimentos, juguetes, higiene…).",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5"
          >
            <p className="font-semibold text-slate-700">{card.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {card.text} <em>(disponible en la versión completa)</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}