// app/admin/SignOutButton.tsx
"use client";
import { supabase } from "@/lib/supabaseClient";

export default function SignOutButton() {
  return (
    <button
      className="rounded-xl bg-white/10 px-3 py-1 hover:bg-white/20 text-sm"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
      }}
    >
      Sair
    </button>
  );
}


