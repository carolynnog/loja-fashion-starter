// app/api/products/route.ts
import { NextResponse } from "next/server";
// use caminho RELATIVO para evitar problema de alias
import getSupabaseAdmin from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic"; // sem cache no Route Handler

export async function GET() {
  try {
    const db = getSupabaseAdmin();

    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
