import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flower2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-pink-200 blur-3xl opacity-30 rounded-full scale-150" />
        <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10 mx-auto">
          <Flower2 className="w-16 h-16 text-pink-400" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
        Упс! Такої сторінки не існує
      </h1>

      <p className="text-slate-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
        Схоже, ви намагаєтесь знайти квітковий магазин, якого немає в нашій
        базі, або посилання застаріло.
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button
            size="lg"
            className="rounded-2xl gap-2 bg-slate-900 hover:bg-slate-800"
          >
            <Home className="w-4 h-4" />
            На головну
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-slate-300 text-sm font-medium uppercase tracking-widest">
        FloraSoft Error 404
      </div>
    </div>
  );
}
