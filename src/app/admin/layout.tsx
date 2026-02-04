// src/app/admin/layout.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Store, LogOut } from "lucide-react";
import { AdminLoginScreen } from "@/components/admin/login-screen";
import { verifySession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 w-full border-b bg-white px-4 md:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/admin"
            className="font-bold text-lg md:text-xl text-slate-900"
          >
            Flora<span className="text-pink-500 m-0 p-0 ">Soft</span>
            <span className="hidden md:inline ml-1 text-slate-400 font-normal text-sm">
              Admin
            </span>
          </Link>
          <nav className="flex gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 px-2 md:px-4">
                <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Замовлення</span>
              </Button>
            </Link>
            <Link href="/admin/shops">
              <Button variant="ghost" size="sm" className="gap-2 px-2 md:px-4">
                <Store className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Магазини</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
