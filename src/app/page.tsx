import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flower2, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <Link href="/" className="font-bold text-xl text-slate-900">
              Flora<span className="text-pink-500 m-0 p-0 ">Soft</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Електронні листівки <br />
          <span className="text-pink-600">для квіткових магазинів</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Сучасний сервіс для створення персональних привітань. Ваші клієнти
          створюють листівку за хвилину, а ви отримуєте готовий PDF-файл для
          друку.
        </p>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Миттєво",
              desc: "Клієнт сканує QR-код, пише текст і натискає «Готово». Ніяких реєстрацій.",
            },
            {
              icon: ShieldCheck,
              title: "Зручно",
              desc: "Листівка автоматично приходить на email магазину у форматі PDF (A6).",
            },
            {
              icon: Flower2,
              title: "Естетично",
              desc: "Дизайнерські шаблони, які підкреслюють красу вашого букета.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-900">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        © 2026 FloraSoft. Всі права захищено.
      </footer>
    </div>
  );
}
