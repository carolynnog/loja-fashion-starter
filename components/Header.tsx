'use client';
import Link from 'next/link';
import { ShoppingCart, Instagram, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { count } = useCart();
  const wppLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=${process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE}`;
  const insta = process.env.NEXT_PUBLIC_INSTAGRAM_URL!;
  const name = process.env.NEXT_PUBLIC_STORE_NAME || "Fashion's Nog";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="container py-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-semibold">{name}</Link>

        <nav className="flex items-center gap-2">
          <a href={wppLink} target="_blank" className="btn btn-primary gap-2">
            <Phone className="w-4 h-4" /> WhatsApp
          </a>
          <a href={insta} target="_blank" className="btn bg-neutral-800 gap-2">
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          <Link href="/carrinho" className="btn bg-neutral-800 gap-2">
            <ShoppingCart className="w-4 h-4" /> <span className="hidden sm:inline">Carrinho</span>
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-white text-black w-5 h-5 text-xs">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
