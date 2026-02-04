"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, ImagePlus, X } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

export function AddShopDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Данные формы
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Простая транслитерация для авто-заполнения slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug) {
      const generated = val
        .toLowerCase()
        .replace(/і/g, "i")
        .replace(/ї/g, "yi")
        .replace(/є/g, "ye") // Укр буквы
        .replace(/[^a-z0-9]/g, "-") // Все кроме букв и цифр в дефис
        .replace(/-+/g, "-"); // Убираем дубли дефисов
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, email, logoUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Ошибка");
        return;
      }

      setOpen(false);
      // Сброс формы
      setName("");
      setSlug("");
      setEmail("");
      setLogoUrl("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ошибка сети");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Додати магазин
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Додати новий магазин</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Назва магазину</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Rose Studio"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">ID посилання (slug)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">.../card/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rose-studio"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email для замовлень</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orders@rose.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Логотип</Label>

            {!logoUrl ? (
              <CldUploadButton
                // ВАЖНО: Замени 'florasoft_preset' на имя своего пресета из Cloudinary
                uploadPreset="florasoft_preset"
                onSuccess={(result: any) => {
                  // Cloudinary возвращает объект, нам нужен secure_url
                  if (result.info && result.info.secure_url) {
                    setLogoUrl(result.info.secure_url);
                  }
                }}
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer text-slate-500 gap-2 text-sm"
              >
                <ImagePlus className="w-4 h-4" />
                Завантажити лого (PNG/SVG)
              </CldUploadButton>
            ) : (
              <div className="relative w-full h-24 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="h-16 w-16 object-contain"
                />
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
                <div className="absolute bottom-1 right-2 text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                  Завантажено
                </div>
              </div>
            )}
            {/* Скрытый инпут, чтобы отправить URL на сервер, если вдруг нужно (но мы используем state) */}
            <input type="hidden" name="logoUrl" value={logoUrl} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Створити
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
