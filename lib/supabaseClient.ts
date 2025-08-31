// lib/supabaseClient.ts
"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Este client grava/atualiza a sessão em COOKIE.
// É isso que o middleware enxerga para liberar /admin.
export const supabase = createClientComponentClient();
