'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { centsToBRL } from '@/lib/format';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();
  const [p, setP] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchP = async () => {
      const res = await fetch(`/api/products/${params.id}`, { cache: 'no-store' });
      const data = await res.json();
      setP(data);
    };
    fetchP();
  }, [params.id]);

  if (!p) return <p>Carregando...</p>;

  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1520974892934-5328f453f3e8?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card overflow-hidden">
        <img src={img} className="w-full object-cover" />
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <p className="text-neutral-400">{centsToBRL(p.price_cents)}</p>
        <p className="text-sm text-neutral-400 whitespace-pre-wrap">{p.description}</p>

        <div className="flex items-center gap-2">
          <label className="label">Qtd</label>
          <input type="number" className="input w-24" min={1} value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value||'1')))} />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => add({ id: p.id, name: p.name, price_cents: p.price_cents, image: img, qty })}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
