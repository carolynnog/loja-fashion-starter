"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  // DEBUG 1: mostra sessão ao abrir a tela de login (se já existir cookie)
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Sessão AO CARREGAR a página de login:", {
        email: session?.user?.email ?? null,
        exp: session?.expires_at ?? null,
      });
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }

    // DEBUG 2: logo após login, pega a sessão e loga o email
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Sessão PÓS-LOGIN:", {
      email: session?.user?.email ?? null,
      exp: session?.expires_at ?? null,
    });

    const next = params.get("redirect") || "/admin";
    router.replace(next);
  };

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border border-white/10 bg-transparent px-3 py-2"
          type="email" placeholder="seu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input
          className="w-full rounded border border-white/10 bg-transparent px-3 py-2"
          type="password" placeholder="sua senha"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}




