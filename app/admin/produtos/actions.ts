// app/admin/produtos/actions.ts
"use server";

import { revalidatePath } from "next/cache";
// caminho RELATIVO: de app/admin/produtos/ até lib/
import getSupabaseAdmin from "../../../lib/supabaseAdmin";

type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim() ?? "";
    const priceStr = (formData.get("price") as string | null)?.trim() ?? "0";
    const price_cents = Math.round(parseFloat(priceStr.replace(",", ".") || "0") * 100);

    const is_featured = formData.get("is_featured") === "on";
    const file = formData.get("image") as File | null;

    if (!name || !Number.isFinite(price_cents)) {
      return { ok: false, error: "Dados inválidos" };
    }

    const supabase = getSupabaseAdmin();

    // faz upload (se veio arquivo)
    let image_url: string | null = null;
    if (file && file.size > 0) {
      const filePath = `products/${Date.now()}-${file.name}`;

      const up = await supabase
        .storage
        .from("product-images")
        .upload(filePath, file, { contentType: file.type });

      if (up.error) {
        return { ok: false, error: `Falha no upload: ${up.error.message}` };
      }

      const pub = supabase
        .storage
        .from("product-images")
        .getPublicUrl(filePath);

      image_url = pub.data.publicUrl;
    }

    // insere no banco
    const { error } = await supabase.from("products").insert({
      name,
      description,
      price_cents,
      image_url,
      is_featured,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    // atualiza páginas
    revalidatePath("/");
    revalidatePath("/admin/produtos");

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Erro inesperado" };
  }
}



