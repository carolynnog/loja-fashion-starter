"use server";

import { revalidatePath } from "next/cache";
import getSupabaseAdmin from "@/lib/supabaseAdmin";

export async function createProductAction(formData: FormData) {
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
  const supabase = getSupabaseAdmin();
  const id = (formData.get("id") as string) || "";
  if (!id) throw new Error("ID ausente.");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}




