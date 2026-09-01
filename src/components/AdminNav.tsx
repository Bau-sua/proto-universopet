import Link from "next/link";
import { ChevronRightIcon, PawIcon } from "@/components/icons";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/productos", label: "Productos", exact: false },
  { href: "/admin/pedidos", label: "Pedidos", exact: false },
];

export function AdminNav({ active }: { active: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-1 text-xs text-slate-400">
        <ChevronRightIcon className="h-3 w-3" />
        <Link href="/" className="transition hover:text-brand-600">
          Volver a la tienda
        </Link>
      </div>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Panel de administración">
        {LINKS.map((link) => {
          const isActive =
            link.exact ? active === link.href : active.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              <PawIcon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}