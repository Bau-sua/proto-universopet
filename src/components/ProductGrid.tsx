import { ProductCard } from "@/components/ProductCard";
import type { ProductView } from "@/types/catalog";

export function ProductGrid({ products }: { products: ProductView[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-700">
          No encontramos productos con esos filtros
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Probá con otra búsqueda o categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}