import "server-only";
import { createClient } from "@supabase/supabase-js";

export default function getSupabaseAdmin() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL");
  if (!key) throw new Error("Defina SUPABASE_SERVICE_ROLE_KEY (server)");

  return createClient(url, key, { auth: { persistSession: false } });
}

