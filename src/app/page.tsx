import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import {
  ChevronRightIcon,
  PawIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { getCatalogProducts, getCatalogCategories } from "@/server/catalog";
import { WHATSAPP_LINK } from "@/lib/constants";

// Landing — hero + featured products + category highlights + subscription
// promo. Reads from the Prisma DB when available, falls back to mock data.

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getCatalogProducts({ destacados: "true", limite: 8 }),
    getCatalogCategories(),
  ]);

  const topCategories = categories.filter((c) => c.children.length > 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-800">
              <PawIcon className="h-4 w-4" />
              Pet shop argentino · Envíos a todo el país
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Todo para tu mascota,
              <span className="text-brand-600"> con envío a tu casa</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              Alimentos, juguetes, accesorios e higiene para perros y gatos.
              Suscripciones con 10% de descuento, pago con MercadoPago y factura
              electrónica en todos los pedidos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
              >
                Ver productos
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-whatsapp-dark"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["24/48 h", "envío en CABA y GBA"],
                ["+400", "productos en stock"],
                ["4.9", "valoración de clientes"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <p className="flex items-center gap-1 text-xl font-extrabold text-slate-900">
                      {value}
                      {label.startsWith("valoración") && (
                        <StarIcon className="h-4 w-4 text-amber-400" />
                      )}
                    </p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {featured.products.slice(0, 4).map((p) => {
                const img = p.images.find((i) => i.isPrimary) ?? p.images[0];
                return (
                  <Link
                    key={p.id}
                    href={`/productos/${p.slug}`}
                    className="group overflow-hidden rounded-3xl border border-white/60 bg-white shadow-lg shadow-brand-100/50"
                  >
                    <div className="relative aspect-square">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText}
                          fill
                          sizes="(max-width: 1024px) 0vw, 25vw"
                          className="object-cover transition group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                        {p.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-accent-200/40 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Category highlights */}
      <section className="container-app py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Comprá por categoría
          </h2>
          <Link
            href="/productos"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Ver todo →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(topCategories.length > 0 ? topCategories : fallbackCategories).map(
            (c) => (
              <Link
                key={c.id}
                href={`/productos?categoria=${c.slug}`}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <PawIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-bold text-slate-900">{c.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {c.children.length > 0
                    ? c.children.map((ch) => ch.name).join(" · ")
                    : "Ver productos"}
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-app py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Destacados de la semana
          </h2>
          <Link
            href="/productos"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Ver todo →
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid products={featured.products} />
        </div>
      </section>

      {/* Subscription promo */}
      <section
        id="suscripciones"
        className="container-app py-10"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-700 to-accent-900 px-6 py-10 text-white sm:px-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-24 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative max-w-2xl">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              Suscripciones de alimento
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Nunca más te quedes sin balanceado
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-accent-100 sm:text-base">
              Armá una suscripción mensual o quincenal del alimento de tu
              mascota, ahorrá <strong>10% en cada entrega</strong> y pausala
              cuando quieras. Cargos recurrentes por MercadoPago, sin
              complicaciones.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/productos?categoria=alimentos"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-accent-800 shadow-sm transition hover:bg-accent-50"
              >
                Explorar alimentos
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Quiero mi suscripción
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="container-app grid gap-6 py-8 sm:grid-cols-3">
          {[
            {
              icon: <TruckIcon className="h-6 w-6" />,
              title: "Envío 24/48 h",
              text: "CABA y GBA. Gratis desde $60.000.",
            },
            {
              icon: <ShieldIcon className="h-6 w-6" />,
              title: "Pagos seguros",
              text: "MercadoPago, tarjeta, transferencia o efectivo.",
            },
            {
              icon: <PawIcon className="h-6 w-6" />,
              title: "Factura electrónica",
              text: "Comprobantes válidos ante ARCA en cada venta.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                {item.icon}
              </span>
              <div>
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Categories when the DB has not been pushed yet (keeps the demo alive).
const fallbackCategories = [
  {
    id: "cat-alimentos",
    name: "Alimentos",
    slug: "alimentos",
    sortOrder: 1,
    children: [
      { id: "c1", name: "Perros", slug: "alimento-perros", sortOrder: 1, children: [] },
      { id: "c2", name: "Gatos", slug: "alimento-gatos", sortOrder: 2, children: [] },
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