// app/admin/layout.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Envolve qualquer filho (inclusive /login) em Suspense
  return <Suspense fallback={null}>{children}</Suspense>;
}

