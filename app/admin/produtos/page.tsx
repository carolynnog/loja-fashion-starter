'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

type Prod = { id: string; name: string; description?: string; price_cents: number; images: string[] };

export default function AdminProducts() {
  const [list, setList] = useState<Prod[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState<File | null>(null);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setList((data as any) || []);
  };

  useEffect(()=>{ load(); }, []);

  const uploadImage = async (): Promise<string | null> => {
    if (!img) return null;
    const name = `${Date.now()}-${img.name}`;
    const { data, error } = await supabase.storage.from('product-images').upload(name, img, { upsert: false });
    if (error) { alert(error.message); return null; }
    const { data: pub } = supabase.storage.from('product-images').getPublicUrl(data.path);
    return pub.publicUrl;
  };

  const add = async () => {
    const url = await uploadImage();
    const images = url ? [url] : [];
    const { error } = await supabase.from('products').insert({ name, description: desc, price_cents: Math.round(price*100), images });
    if (error) alert(error.message);
    setName(''); setPrice(0); setDesc(''); setImg(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir produto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Produtos</h1>

      <div className="card p-4 grid md:grid-cols-2 gap-3">
        <div>
          <label className="label">Nome</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Preço (R$)</label>
          <input className="input" type="number" step="0.01" value={price} onChange={e=>setPrice(parseFloat(e.target.value||'0'))} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Descrição</label>
          <textarea className="input" rows={4} value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>
        <div>
          <label className="label">Imagem</label>
          <input type="file" onChange={e=>setImg(e.target.files?.[0] || null)} />
        </div>
        <div className="flex items-end">
          <button className="btn btn-primary" onClick={add}>Adicionar</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map(p => (
          <div key={p.id} className="card p-3">
            <img src={p.images?.[0] || ''} className="w-full aspect-[4/5] object-cover rounded-lg bg-neutral-800" />
            <div className="pt-2">
              <div className="font-medium">{p.name}</div>
              <div className="text-neutral-400 text-sm">R$ {(p.price_cents/100).toFixed(2)}</div>
            </div>
            <button className="btn bg-neutral-800 mt-2" onClick={()=>remove(p.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
