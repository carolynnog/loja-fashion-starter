'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) setMsg(error.message);
    else window.location.href = '/admin';
  };

  return (
    <div className="max-w-sm mx-auto card p-6 space-y-3">
      <h1 className="text-xl font-semibold">Login Admin</h1>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Senha" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <button className="btn btn-primary" onClick={signIn}>Entrar</button>
      {msg && <p className="text-red-400 text-sm">{msg}</p>}
    </div>
  );
}
