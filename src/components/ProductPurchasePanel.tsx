"use client";

// Interactive purchase panel: gallery thumbs, variant selector, quantity and
// add-to-cart. Receives the full product (already resolved by the server
// component, DB or mock) and writes into the cart context.

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/Button";
import { MinusIcon, PlusIcon, TruckIcon, WhatsAppIcon } from "@/components/icons";
import { formatARS, WHATSAPP_LINK } from "@/lib/constants";
import type { ProductView } from "@/types/catalog";

export function ProductPurchasePanel({ product }: { product: ProductView }) {
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? null;

  const unitPrice = selectedVariant?.price ?? product.price;
  const stockAvailable = selectedVariant?.stockAvailable ?? product.stockAvailable;
  const galleryImages = useMemo(() => {
    const primary =
      selectedVariant?.imageUrl
        ? [
            {
              id: "variant-image",
              url: selectedVariant.imageUrl,
              altText: product.name,
              isPrimary: true,
            },
          ]
        : [];
    return [...primary, ...product.images];
  }, [selectedVariant, product]);

  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > unitPrice;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: galleryImages[0]?.url ?? "",
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      unitPrice,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
          <Image
            src={galleryImages[0]?.url ?? ""}
            alt={galleryImages[0]?.altText ?? product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {galleryImages.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {galleryImages.slice(0, 4).map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
              >
                <Image
                  src={img.url}
                  alt={img.altText}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase panel */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          {product.categoryName}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-3xl font-extrabold text-slate-900">
            {formatARS(unitPrice)}
          </p>
          {hasDiscount && (
            <p className="pb-1 text-base text-slate-400 line-through">
              {formatARS(product.compareAtPrice ?? 0)}
            </p>
          )}
        </div>

        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">Presentación</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    selectedVariantId === v.id
                      ? "border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock + quantity + CTA */}
        <div className="mt-6 flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              stockAvailable > 0 ? "text-accent-700" : "text-red-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                stockAvailable > 0 ? "bg-accent-500" : "bg-red-500"
              }`}
            />
            {stockAvailable > 0
              ? stockAvailable <= 5
                ? `Quedan ${stockAvailable} unidades`
                : "En stock"
              : "Sin stock"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-slate-500 transition hover:text-brand-700"
              aria-label="Disminuir cantidad"
            >
              <MinusIcon />
            </button>
            <span className="w-10 text-center text-sm font-bold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="flex h-11 w-11 items-center justify-center text-slate-500 transition hover:text-brand-700"
              aria-label="Aumentar cantidad"
            >
              <PlusIcon />
            </button>
          </div>

          <Button onClick={handleAdd} disabled={stockAvailable <= 0} className="flex-1">
            {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
          </Button>
        </div>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-whatsapp/40 bg-whatsapp/5 px-5 py-2.5 text-sm font-semibold text-whatsapp-dark transition hover:bg-whatsapp/10"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Consultar por WhatsApp
        </a>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-50 p-4 text-sm text-accent-900">
          <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
          <p>
            Envío 24/48 h en CABA y GBA. <strong>Gratis</strong> en compras
            mayores a $60.000. Retiro por la sucursal sin cargo.
          </p>
        </div>

        {product.description && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Descripción
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}