import { revalidatePath } from "next/cache";
import getSupabaseAdmin from "@/lib/supabaseAdmin";

export const metadata = { title: "Produtos — Admin" };
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
};

export async function createProductAction(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim() || null;
  const priceBRL = Number(((formData.get("price_brl") as string) ?? "0").replace(",", "."));
  const price_cents = Math.round(priceBRL * 100);
  const is_featured = formData.get("is_featured") === "on";

  if (!name || !Number.isFinite(price_cents) || price_cents < 0) {
    throw new Error("Dados inválidos (nome/preço).");
  }

  let image_url: string | null = null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `products/${Date.now()}-${safe}`;
    const up = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type || "application/octet-stream",
    });
    if (up.error) throw new Error("Falha no upload: " + up.error.message);
    image_url = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("products").insert({
    name, description, price_cents, image_url, is_featured,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function updateProductAction(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();

  const id = (formData.get("id") as string) || "";
  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim() || null;
  const priceBRL = Number(((formData.get("price_brl") as string) ?? "0").replace(",", "."));
  const price_cents = Math.round(priceBRL * 100);

  if (!id) throw new Error("ID ausente.");
  if (!name || !Number.isFinite(price_cents) || price_cents < 0) {
    throw new Error("Dados inválidos (nome/preço).");
  }

  const { error } = await supabase
    .from("products")
    .update({ name, description, price_cents })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function toggleFeaturedAction(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();
  const id = (formData.get("id") as string) || "";
  const is_featured = formData.get("is_featured") === "on";
  if (!id) throw new Error("ID ausente.");

  const { error } = await supabase.from("products").update({ is_featured }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function deleteProductAction(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();
  const id = (formData.get("id") as string) || "";
  if (!id) throw new Error("ID ausente.");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export default async function AdminProductsPage() {
  const supabase = getSupabaseAdmin();
  const { data: products, error } = await supabase
    .from("products").select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-semibold mb-4">Produtos — Admin</h1>
        <p className="text-red-500">Erro ao carregar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-10">
      <h1 className="text-2xl font-semibold">Produtos — Admin</h1>

      {/* CRIAR */}
      <section className="rounded-2xl border border-white/10 p-4">
        <h2 className="text-lg font-medium mb-3">Adicionar produto</h2>
        <form action={createProductAction} className="grid grid-cols-1 md:grid-cols-4 gap-3" encType="multipart/form-data">
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Imagem</label>
            <input name="image" type="file" className="block w-full" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Nome</label>
            <input name="name" className="w-full rounded border border-white/10 bg-transparent px-3 py-2" placeholder="Vestido azul" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Preço (R$)</label>
            <input name="price_brl" type="number" step="0.01" min="0" className="w-full rounded border border-white/10 bg-transparent px-3 py-2" placeholder="362.00" required />
          </div>
          <div className="md:col-span-1 flex items-end gap-3">
            <label className="inline-flex items-center gap-2">
              <input name="is_featured" type="checkbox" />
              <span className="text-sm">Destacar</span>
            </label>
            <button type="submit" className="ml-auto rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Adicionar</button>
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm mb-1">Descrição</label>
            <textarea name="description" rows={3} className="w-full rounded border border-white/10 bg-transparent px-3 py-2" placeholder="Detalhes do produto…" />
          </div>
        </form>
      </section>

      {/* LISTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products ?? []).map((product) => (
          <article key={product.id} className="rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/20">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/50">sem imagem</div>
              )}
            </div>

            <form action={updateProductAction} className="space-y-2">
              <input type="hidden" name="id" value={product.id} />
              <input name="name" defaultValue={product.name} className="w-full rounded border border-white/10 bg-transparent px-3 py-2" />
              <textarea name="description" rows={2} defaultValue={product.description ?? ""} className="w-full rounded border border-white/10 bg-transparent px-3 py-2" />
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs mb-1">Preço (R$)</label>
                  <input name="price_brl" type="number" step="0.01" min="0" defaultValue={(product.price_cents ?? 0) / 100} className="w-full rounded border border-white/10 bg-transparent px-3 py-2" />
                </div>
                <button type="submit" className="self-end rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">Salvar</button>
              </div>
            </form>

            <div className="flex items-center justify-between pt-2">
              <form action={toggleFeaturedAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={product.id} />
                <label className="inline-flex items-center gap-2">
                  <input name="is_featured" type="checkbox" defaultChecked={product.is_featured} />
                  <span className="text-sm">Destacar</span>
                </label>
                <button type="submit" className="rounded-xl bg-white/10 px-3 py-1 hover:bg-white/20 text-sm">Aplicar</button>
              </form>

              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={product.id} />
                <button type="submit" className="rounded-xl bg-white/10 px-3 py-1 hover:bg-white/20 text-sm">Excluir</button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
