import ProductCard from "@/components/ProductCard";
import { supabaseServer } from "@/lib/serverSupabase";

export default async function Home() {
  const sb = supabaseServer();
  const { data: products } = await sb
    .from("products")
    .select("*")
    .order('created_at', { ascending: false })
    .limit(24);

  return (
    <div className="space-y-8">
      <section className="card p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">
          {process.env.NEXT_PUBLIC_STORE_NAME || 'Minha Loja'}
        </h1>
        <p className="text-neutral-400 mt-2">
          Moda com propósito. Entrega em todo o Brasil.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Destaques</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products?.map((p) => <ProductCard key={p.id} p={p} />)}
          {!products?.length && <p className="text-neutral-400">Sem produtos ainda — cadastre no /admin.</p>}
        </div>
      </section>
    </div>
  );
}
