import getSupabasePublic from "@/lib/supabasePublic";

export const revalidate = 0 as const;
export const dynamic = "force-dynamic";

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export default async function HomePage() {
  const db = getSupabasePublic();
  const { data, error } = await db
    .from("products")
    .select("id,name,price_cents,image_url")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const featured = data ?? [];

  return (
    <main className="container py-8 space-y-6">
      <section className="rounded-2xl border border-white/10 p-4">
        <h2 className="text-xl font-semibold mb-4">Destaques</h2>

        {error ? (
          <p className="text-red-400">Erro ao carregar: {error.message}</p>
        ) : featured.length === 0 ? (
          <p className="text-white/60">Sem produtos ainda — cadastre no <code>/admin</code>.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <article key={p.id} className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="aspect-[4/3] w-full bg-black/20">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/50">sem imagem</div>
                  )}
                </div>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-white/70">{formatBRL(p.price_cents)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

