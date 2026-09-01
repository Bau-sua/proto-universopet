"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { CartIcon } from "@/components/icons";

export function CartBadge() {
  const { count } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-100"
      aria-label={`Carrito de compras (${count} productos)`}
    >
      <CartIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}