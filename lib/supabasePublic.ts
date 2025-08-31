import { createClient } from "@supabase/supabase-js";

export default function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL/ANON_KEY");

  return createClient(url, anon, { auth: { persistSession: false } });
}

