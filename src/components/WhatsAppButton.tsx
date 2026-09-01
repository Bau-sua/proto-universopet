import { WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_LINK } from "@/lib/constants";

// Floating WhatsApp CTA (mobile-first: AR pet-shop clients live on WhatsApp).

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/30 transition hover:scale-105 hover:bg-whatsapp-dark"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}