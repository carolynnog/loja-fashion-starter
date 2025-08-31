// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // sempre comece com um response “mutável” para o helper gravar cookies, se precisar
  const res = NextResponse.next();
  const { pathname, search } = req.nextUrl;

  // ✅ Rotas públicas dentro de /admin (sem cheque de sessão)
  if (pathname === "/admin/login" || pathname === "/admin/debug") {
    return res;
  }

  // ✅ Protege somente /admin/*
  if (pathname.startsWith("/admin")) {
    try {
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();

      // não logado -> redireciona para login, preservando a rota alvo
      if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        // mantém query original como redirect (inclui search, se houver)
        url.searchParams.set("redirect", pathname + (search || ""));
        return NextResponse.redirect(url);
      }

      // checagem do e-mail admin
      const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const email = session.user.email;
      if (admin && email !== admin) {
        // desloga (limpa cookies) e volta pro login
        await supabase.auth.signOut();
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    } catch {
      // em caso de qualquer erro no middleware, joga pro login (fail-safe)
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // segue o jogo
  return res;
}

// ✅ Intercepta apenas rotas do /admin (não toca no resto do app)
export const config = {
  matcher: ["/admin/:path*"],
};
