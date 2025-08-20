'use client';

import { useCart } from '@/context/CartContext';
import { centsToBRL } from '@/lib/format';
import { useState } from 'react';

export default function CartPage() {
  const { items, remove, total, clear } = useCart();
  const [email, setEmail] = useState('');

  const checkout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items, email })
    });
    const data = await res.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert('Erro ao iniciar pagamento: ' + data.error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Carrinho</h1>

      {!items.length && <p className="text-neutral-400">Seu carrinho está vazio.</p>}

      {items.map(i => (
        <div key={i.id} className="card p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={i.image} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-neutral-400 text-sm">Qtd: {i.qty}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>{centsToBRL(i.price_cents * i.qty)}</div>
            <button className="btn bg-neutral-800" onClick={() => remove(i.id)}>Remover</button>
          </div>
        </div>
      ))}

      {!!items.length && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <strong>{centsToBRL(total)}</strong>
          </div>

          <div>
            <label className="label">Seu e-mail (para confirmação do pedido)</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn bg-neutral-800" onClick={clear}>Limpar</button>
            <button className="btn btn-primary" onClick={checkout}>Pagar com Mercado Pago</button>
          </div>
        </div>
      )}
    </div>
  );
}
