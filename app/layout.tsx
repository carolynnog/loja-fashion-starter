import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_STORE_NAME || "Minha Loja",
  description: "Loja construída com Next.js + Supabase + Mercado Pago",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <Header />
          <main className="container py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
