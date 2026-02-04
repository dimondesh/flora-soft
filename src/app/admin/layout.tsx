import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Store } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-10 w-full border-b bg-white px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-xl text-slate-900">
            Flora<span className="text-pink-500 m-0 p-0 ">Soft</span> Admin
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Замовлення
              </Button>
            </Link>
            <Link href="/admin/shops">
              <Button variant="ghost" size="sm" className="gap-2">
                <Store className="w-4 h-4" />
                Магазини
              </Button>
            </Link>
          </nav>
        </div>
        <div className="text-sm text-slate-500">Admin Mode</div>
      </header>

      {/* Контент */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
