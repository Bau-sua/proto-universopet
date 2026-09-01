import Image from "next/image";
import Link from "next/link";
import { formatARS } from "@/lib/constants";
import type { ProductView } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductView }) {
  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];
  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            Sin imagen
          </div>
        )}
        {product.stockAvailable <= 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            Sin stock
          </span>
        )}
        {hasDiscount && (
          <span className="absolute right-2 top-2 rounded-full bg-accent-600 px-2.5 py-1 text-[11px] font-bold text-white">
            OFERTA
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {product.categoryName}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
          {product.name}
        </h3>

        {product.variants.length > 1 && (
          <p className="mt-1 text-[11px] text-slate-400">
            {product.variants.length} presentaciones
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {hasDiscount && (
              <p className="text-xs text-slate-400 line-through">
                {formatARS(product.compareAtPrice ?? 0)}
              </p>
            )}
            <p className="text-base font-extrabold text-slate-900">
              {formatARS(product.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}