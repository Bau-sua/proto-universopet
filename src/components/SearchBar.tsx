"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";

// Search box that navigates to /productos?q=... so the catalog page (a server
// component reading searchParams) stays the single filtering source.

export function SearchBar({
  initialValue = "",
  autoFocus = false,
  className = "",
}: {
  initialValue?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos");
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`} role="search">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscá por producto, marca o categoría…"
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        aria-label="Buscar productos"
      />
    </form>
  );
}