"use client";

import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_LINK } from "@/lib/constants";

export function PurchaseSuccess({
  orderNumber,
  simulated,
  onContinue,
}: {
  orderNumber: number;
  simulated: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="container-app flex flex-col items-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="h-10 w-10 text-accent-700"
          aria-hidden="true"
        >
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
        ¡Pedido confirmado!
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Tu pedido <strong className="text-slate-800">#{orderNumber}</strong> fue
        recibido. Te llegará una confirmación por email y lo despachamos en 24/48
        h.
      </p>

      {simulated && (
        <p className="mt-4 max-w-md rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <strong>Modo demo:</strong> la base de datos local no está activa
          (ejecutá <code className="font-mono">npx.cmd prisma db push</code> y{" "}
          <code className="font-mono">npm.cmd run db:seed</code> para persistir
          pedidos reales). El flujo completo se ejecuta igual.
        </p>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={onContinue}>Seguir comprando</Button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-whatsapp-dark"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Hacer seguimiento por WhatsApp
        </a>
      </div>
    </div>
  );
}