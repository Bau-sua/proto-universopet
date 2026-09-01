import Link from "next/link";
import { PawIcon, WhatsAppIcon } from "@/components/icons";
import { STORE_NAME, WHATSAPP_LINK } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-slate-50">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <PawIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold text-slate-900">Universo Pet</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {STORE_NAME}. Productos de calidad para perros y gatos, con envío a
            domicilio y atención personalizada por WhatsApp.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            Categorías
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {[
              ["Alimentos", "/productos?categoria=alimentos"],
              ["Juguetes", "/productos?categoria=juguetes"],
              ["Accesorios", "/productos?categoria=accesorios"],
              ["Higiene y Cuidado", "/productos?categoria=higiene"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-brand-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            Ayuda
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/carrito" className="transition hover:text-brand-700">Mi carrito</Link></li>
            <li><Link href="/checkout" className="transition hover:text-brand-700">Hacer un pedido</Link></li>
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-brand-700">
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Consultas por WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            Pagos y envíos
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>MercadoPago: tarjeta, débito y efectivo</li>
            <li>Transferencia bancaria</li>
            <li>Envío 24/48 h en CABA y GBA</li>
            <li>Factura electrónica (AFIP/ARCA)</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {STORE_NAME} — demo de plataforma
            e-commerce
          </p>
          <p>Hecho en Argentina</p>
        </div>
      </div>
    </footer>
  );
}