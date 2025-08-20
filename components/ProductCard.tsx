'use client';
import Link from 'next/link';
import { centsToBRL } from '@/lib/format';

export default function ProductCard({ p }: { p: any }) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1520974892934-5328f453f3e8?q=80&w=1200&auto=format&fit=crop';
  return (
    <div className="card p-3">
      <Link href={`/produto/${p.id}`}>
        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-800">
          <img src={img} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="pt-3">
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-neutral-400">{centsToBRL(p.price_cents)}</p>
        </div>
      </Link>
    </div>
  );
}
