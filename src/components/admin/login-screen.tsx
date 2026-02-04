"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLoginScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Состояние для глазика
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-900">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Адмін-панель</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Введіть пароль для доступу
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Обертка для позиционирования иконки глаза */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"} // Переключаем тип
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              // pr-10 добавляет отступ справа, чтобы текст не наезжал на глаз
              className={`h-12 text-center text-lg focus:ring-0! focus:border-pink-500! transition-all duration-300 pr-10 ${
                error ? "border-red-500! focus-visible:ring-red-500!" : ""
              }`}
              autoFocus
            />

            {/* Кнопка глаза */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex={-1} // Чтобы Tab не останавливался на глазе (опционально)
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Текст ошибки с анимацией */}
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium animate-in slide-in-from-top-1 fade-in duration-300">
              <AlertCircle className="w-4 h-4" />
              <span>Невірний пароль</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800 transition-all"
            disabled={loading || !password}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Увійти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
