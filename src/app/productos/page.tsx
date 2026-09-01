import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchBar } from "@/components/SearchBar";
import { getCatalogProducts, getCatalogCategories } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explorá el catálogo completo de Huellitas Pet Shop: alimentos, juguetes, accesorios e higiene para perros y gatos.",
};

type Props = {
  searchParams: Promise<{ q?: string; categoria?: string }>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const { q, categoria } = await searchParams;

  const [result, categories] = await Promise.all([
    getCatalogProducts({ q, categoria, limite: 24 }),
    getCatalogCategories(),
  ]);

  const activeCategory = categories
    .flatMap((c) => [c, ...c.children])
    .find((c) => c.slug === categoria);

  return (
    <div className="container-app py-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Catálogo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {activeCategory?.name
              ? `Categoría: ${activeCategory.name}`
              : "Todos los productos para tu mascota"}
            {q ? ` · Buscando "${q}"` : ""} · {result.products.length} resultados
          </p>
        </div>
        <div className="w-full sm:w-80">
          <SearchBar initialValue={q ?? ""} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Category sidebar */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Categorías
          </h2>
          <nav className="mt-3 space-y-1">
            <Link
              href="/productos"
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                !categoria
                  ? "bg-brand-50 text-brand-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todos los productos
            </Link>
            {(categories.length > 0 ? categories : fallbackCategories).map(
              (category) => (
                <div key={category.id}>
                  <Link
                    href={`/productos?categoria=${category.slug}`}
                    className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      categoria === category.slug
                        ? "bg-brand-50 text-brand-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <div className="ml-3 space-y-0.5 border-l border-slate-100 pl-2.5">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/productos?categoria=${child.slug}`}
                          className={`block rounded-lg px-3 py-1.5 text-[13px] transition ${
                            categoria === child.slug
                              ? "bg-brand-50 font-semibold text-brand-800"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </nav>
        </aside>

        {/* Grid */}
        <div>
          <ProductGrid products={result.products} />
        </div>
      </div>
    </div>
  );
}

const fallbackCategories = [
  {
    id: "cat-alimentos",
    name: "Alimentos",
    slug: "alimentos",
    sortOrder: 1,
    children: [
      { id: "c1", name: "Para Perros", slug: "alimento-perros", sortOrder: 1, children: [] },
      { id: "c2", name: "Para Gatos", slug: "alimento-gatos", sortOrder: 2, children: [] },
    ],
  },
  {
    id: "cat-juguetes",
    name: "Juguetes",
    slug: "juguetes",
    sortOrder: 2,
    children: [],
  },
  {
    id: "cat-accesorios",
    name: "Accesorios",
    slug: "accesorios",
    sortOrder: 3,
    children: [],
  },
  {
    id: "cat-higiene",
    name: "Higiene y Cuidado",
    slug: "higiene",
    sortOrder: 4,
    children: [],
  },
];