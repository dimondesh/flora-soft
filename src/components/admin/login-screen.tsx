// src/components/admin/login-screen.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLoginScreen() {
  const [password, setPassword] = useState("");
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
      router.refresh(); // Оновлюємо сторінку, щоб Layout побачив cookie
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
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`h-12 text-center text-lg ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            autoFocus
          />

          <Button
            type="submit"
            className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
            disabled={loading || !password}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Увійти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
