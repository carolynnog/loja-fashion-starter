'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      // Basic guard: only allow ADMIN_EMAIL
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      if (adminEmail && session.user.email !== adminEmail) {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
        return;
      }
      setOk(true);
    };
    run();
  }, []);

  if (ok === null) return <p className="p-6">Verificando...</p>;
  return <div>{children}</div>;
}
