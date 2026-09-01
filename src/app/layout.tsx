import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s | ${STORE_NAME}`,
  },
  description:
    "Demo de plataforma e-commerce para pet shop: catálogo con variedades, carrito, checkout y panel de administración. Envíos a domicilio y factura electrónica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-800 antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}