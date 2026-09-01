import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";
import { PawIcon, WhatsAppIcon } from "@/components/icons";
import { STORE_NAME, WHATSAPP_LINK } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/#suscripciones", label: "Suscripciones" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <PawIcon className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                Universo Pet
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-600">
                Tienda de mascotas
              </span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white transition hover:bg-whatsapp-dark sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <CartBadge />
          </div>
        </div>

        {/* Nav (scrollable on mobile) */}
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-auto hidden items-center text-xs font-medium text-slate-400 md:flex">
            {STORE_NAME} · Envíos a todo el país
          </span>
        </nav>
      </div>
    </header>
  );
}