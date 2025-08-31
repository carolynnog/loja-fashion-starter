// app/admin/layout.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

function Guard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const pathname = usePathname();

  // páginas públicas dentro de /admin
  if (pathname === "/admin/login" || pathname === "/admin/debug") {
    return <div className="container py-6">{children}</div>;
  }

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
        return;
      }
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (adminEmail && session.user.email !== adminEmail) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }
      setOk(true);
    };
    run();
  }, []);

  if (ok === null) return <p className="p-6">Verificando...</p>;
  return <div className="container py-6">{children}</div>;
}

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // ✅ resolve o erro do build
  return (
    <Suspense fallback={<div className="p-6">Carregando…</div>}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}
