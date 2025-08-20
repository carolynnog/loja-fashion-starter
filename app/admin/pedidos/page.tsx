'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as any) || []);
  };
  useEffect(()=>{ load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <div className="space-y-2">
        {orders.map(o => (
          <div key={o.id} className="card p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.id}</div>
              <div className="text-neutral-400 text-sm">{o.buyer_email}</div>
            </div>
            <div className="text-right">
              <div className="text-neutral-400 text-sm">Status: {o.status}</div>
              <div className="text-neutral-400 text-sm">Total: R$ {(o.total_cents/100).toFixed(2)}</div>
            </div>
          </div>
        ))}
        {!orders.length && <p className="text-neutral-400">Sem pedidos ainda.</p>}
      </div>
    </div>
  );
}
