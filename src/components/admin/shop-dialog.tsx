// src/components/admin/shop-dialog.tsx
"use client";

import { useState, useEffect } from "react";
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
import {
  Plus,
  Loader2,
  X,
  Pencil,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopDialogProps {
  mode: "create" | "edit";
  shop?: {
    _id: string;
    name: string;
    slug: string;
    email: string;
    logoUrl?: string;
    isActive: boolean;
    showNameOnPdf?: boolean;
  };
}

export function ShopDialog({ mode, shop }: ShopDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showNameOnPdf, setShowNameOnPdf] = useState(true);

  const isValid =
    name.trim().length > 0 && slug.trim().length > 0 && email.trim().length > 0;

  useEffect(() => {
    if (open) {
      setError(null);
      if (mode === "edit" && shop) {
        setName(shop.name);
        setSlug(shop.slug);
        setEmail(shop.email);
        setLogoUrl(shop.logoUrl || "");
        setIsActive(shop.isActive);
        setShowNameOnPdf(shop.showNameOnPdf ?? true);
      } else if (mode === "create") {
        setName("");
        setSlug("");
        setEmail("");
        setLogoUrl("");
        setIsActive(true);
        setShowNameOnPdf(false);
      }
    }
  }, [mode, shop, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (mode === "create" && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[і]/g, "i")
        .replace(/[ї]/g, "yi")
        .replace(/[є]/g, "ye")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Помилка завантаження");

      const data = await res.json();
      setLogoUrl(data.url);
    } catch (error) {
      console.error(error);
      setError("Не вдалося завантажити зображення");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return; // Дополнительная защита

    setIsSubmitting(true);
    setError(null);

    try {
      let url = "/api/shop";
      let method = "POST";

      if (mode === "edit" && shop) {
        url = `/api/shop/${shop._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          email,
          logoUrl,
          isActive,
          showNameOnPdf,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Сталася помилка при збереженні");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Помилка мережі. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2 bg-pink-600 hover:bg-pink-700 text-white w-30 sm:w-auto">
            <Plus className="w-4 h-4" />{" "}
            <span className="sm:inline">Магазин</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-100"
          >
            <Pencil className="w-4 h-4 text-slate-500" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[500px] w-[95%] rounded-xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Додати новий магазин"
              : "Редагування магазину"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="shrink-0">
              <div
                className={cn(
                  "w-24 h-24 rounded-full overflow-hidden flex items-center justify-center border-2 relative bg-slate-50",
                  logoUrl
                    ? "border-pink-200 shadow-sm"
                    : "border-dashed border-slate-300",
                )}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                ) : logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}

                {logoUrl && !isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full text-center sm:text-left">
              <Label>Логотип магазину</Label>
              <div className="text-xs text-slate-500 mb-2">
                Квадратне (PNG, JPG)
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden w-full sm:w-auto"
                  disabled={isUploading}
                >
                  {isUploading
                    ? "Завантаження..."
                    : logoUrl
                      ? "Замінити"
                      : "Завантажити"}
                  <Input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, .svg"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </Button>
                {logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto"
                    onClick={handleRemoveLogo}
                  >
                    Видалити
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Назва <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Наприклад: Kvitka Store"
                className="focus:ring-0! focus:border-pink-500! transition-all duration-300"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">
                  Slug (Посилання) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    /
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setError(null);
                    }}
                    placeholder="kvitka-store"
                    className={cn(
                      "pl-6 focus:ring-0! transition-all duration-300",
                      error && error.includes("slug")
                        ? "border-red-500 focus:border-red-500!"
                        : "focus:border-pink-500!",
                    )}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="isActive">Статус магазину</Label>
                  <div className="flex items-center h-9 px-3 border rounded-md bg-slate-50">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm text-slate-700 cursor-pointer select-none flex-1"
                    >
                      {isActive ? "Активний" : "Прихований"}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="showName">Назва магазину в PDF</Label>
              <div className="flex items-center h-9 px-3 border rounded-md bg-slate-50">
                <input
                  id="showName"
                  type="checkbox"
                  checked={showNameOnPdf}
                  onChange={(e) => setShowNameOnPdf(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                />
                <label
                  htmlFor="showName"
                  className="ml-2 text-sm text-slate-700 cursor-pointer select-none flex-1"
                >
                  {showNameOnPdf ? "Відображати в макеті" : "Приховати"}
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email для замовлень <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orders@example.com"
                className="focus:ring-0! focus:border-pink-500! transition-all duration-300"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !isValid}
              className="bg-slate-900 text-white hover:bg-slate-800 w-full sm:w-auto"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === "create" ? "Створити" : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
