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
import { Plus, Loader2, UploadCloud, X } from "lucide-react";

export function AddShopDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Состояние загрузки картинки

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
        .replace(/є/g, "ye")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  // Обработчик выбора файла
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Помилка завантаження");

      const data = await res.json();
      setLogoUrl(data.url); // Сохраняем полученный URL из Cloudinary
    } catch (error) {
      console.error(error);
      alert("Не вдалося завантажити зображення");
    } finally {
      setIsUploading(false);
    }
  };

  // Удаление логотипа
  const handleRemoveLogo = () => {
    setLogoUrl("");
    // Сброс инпута файла можно сделать через ref, но для простоты достаточно очистить стейт
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setIsSubmitting(false);
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
          {/* Название */}
          <div className="grid gap-2">
            <Label htmlFor="name">Назва магазину</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="focus:border-pink-500! focus:ring-0! transition-all duration-300"
              placeholder="Rose Studio"
              required
            />
          </div>

          {/* Slug */}
          <div className="grid gap-2">
            <Label htmlFor="slug">ID посилання (slug)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">.../card/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rose-studio"
                className="focus:border-pink-500! focus:ring-0! transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email для замовлень</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orders@rose.com"
              className="focus:border-pink-500! focus:ring-0! transition-all duration-300"
              required
            />
          </div>

          {/* Загрузка Логотипа */}
          <div className="grid gap-2">
            <Label>Логотип (зображення або SVG)</Label>
            <div className="flex flex-col gap-3">
              {!logoUrl ? (
                // Состояние: нет логотипа -> показываем инпут
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="cursor-pointer file:cursor-pointer"
                  />
                  {isUploading && (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                  )}
                </div>
              ) : (
                // Состояние: логотип загружен -> показываем превью и кнопку удалить
                <div className="flex items-center gap-4 p-2 border rounded-md bg-slate-50">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-white border shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-slate-500 truncate">{logoUrl}</p>
                    <p className="text-[10px] text-green-600 font-medium mt-0.5">
                      ✓ Завантажено
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveLogo}
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Створити
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
