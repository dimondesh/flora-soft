// src/components/admin/delete-shop-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export function DeleteShopButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shop/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Помилка видалення");

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити магазин");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      {/* Адаптивная ширина */}
      <DialogContent className="sm:max-w-[425px] w-[95%] rounded-xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Видалити магазин?</DialogTitle>
              <DialogDescription className="mt-1 text-sm sm:text-base">
                Ви збираєтесь видалити магазин{" "}
                <span className="font-semibold text-slate-900 break-all">
                  &quot;{name}&quot;
                </span>
                .
                <br className="hidden sm:block" />
                Цю дію неможливо скасувати.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {/* Адаптивные кнопки: на мобилке в колонку */}
        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:gap-0 sm:justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Скасувати
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
