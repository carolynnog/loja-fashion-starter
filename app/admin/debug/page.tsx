// app/admin/debug/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type S = {
  email: string | null;
  userId: string | null;
  aud: string | null;
  expires_at: number | null;
  isAdmin: boolean;
  adminEnv?: string;
};

export default function AdminDebugPage() {
  const [data, setData] = useState<S | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ADMIN = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  async function load() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email ?? null;
    setData({
      email,
      userId: session?.user?.id ?? null,
      aud: session?.user?.aud ?? null,
      expires_at: session?.expires_at ?? null,
      isAdmin: !!(ADMIN && email && email === ADMIN),
      adminEnv: ADMIN,
    });
    setRaw(session);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Debug de Sessão — Admin</h1>

      <div className="flex gap-2">
        <button onClick={load} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
          Recarregar sessão
        </button>
        <button onClick={async () => { await supabase.auth.signOut(); location.href = "/admin/login"; }}
                className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
          Sair
        </button>
      </div>

      {loading ? <p>Carregando…</p> : (
        <>
          <section className="rounded-2xl border border-white/10 p-4">
            <h2 className="text-lg font-medium mb-2">Resumo</h2>
            <ul className="space-y-1 text-sm">
              <li><b>Email:</b> {data?.email ?? <i>null</i>}</li>
              <li><b>ADMIN .env:</b> {data?.adminEnv ?? <i>não definido</i>}</li>
              <li><b>Is Admin?</b> <span className={`px-2 py-0.5 rounded ${data?.isAdmin ? "bg-green-600/30" : "bg-red-600/30"}`}>{String(!!data?.isAdmin)}</span></li>
              <li><b>User ID:</b> {data?.userId ?? <i>null</i>}</li>
              <li><b>AUD:</b> {data?.aud ?? <i>null</i>}</li>
              <li><b>Expira (unix):</b> {data?.expires_at ?? <i>null</i>}</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-white/10 p-4">
            <h2 className="text-lg font-medium mb-2">Session (raw)</h2>
            <pre className="overflow-auto text-xs leading-relaxed">{JSON.stringify(raw, null, 2)}</pre>
          </section>
        </>
      )}
    </div>
  );
}
