// app/admin/login/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const qp = useSearchParams();
  const redirect = qp.get("redirect") || "/admin";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    router.replace(redirect);
  };

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border border-white/10 bg-transparent px-3 py-2"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-white/10 bg-transparent px-3 py-2"
          type="password"
          placeholder="sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

export default function LoginPage() {
  // Suspense evita o erro do useSearchParams no build
  return (
    <Suspense fallback={<div className="container py-10">Carregando…</div>}>
      <LoginInner />
    </Suspense>
  );
}





