import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { getCatalogProduct } from "@/server/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container-app py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Miga de pan">
        <Link href="/" className="transition hover:text-brand-600">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/productos" className="transition hover:text-brand-600">
          Productos
        </Link>
        <span>/</span>
        <Link
          href={`/productos?categoria=${product.categorySlug}`}
          className="transition hover:text-brand-600"
        >
          {product.categoryName}
        </Link>
      </nav>

      <div className="mt-5">
        <ProductPurchasePanel product={product} />
      </div>
    </div>
  );
}