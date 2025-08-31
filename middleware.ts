// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // público enquanto diagnosticamos
  if (pathname === "/admin/login" || pathname === "/admin/debug") {
    return res;
  }

  // protege somente /admin/*
  if (pathname.startsWith("/admin")) {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (admin && session.user.email !== admin) {
      await supabase.auth.signOut();
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

// só intercepta /admin/*
export const config = { matcher: ["/admin/:path*"] };

