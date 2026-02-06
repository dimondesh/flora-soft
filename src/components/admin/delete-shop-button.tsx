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

      {/* Адаптивная ширина и отступы */}
      <DialogContent className="sm:max-w-[425px] w-[95%] rounded-2xl p-6">
        <DialogHeader>
          {/* MOBILE: Flex-col + Center | DESKTOP: Flex-row + Left */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="w-full">
              <DialogTitle className="text-xl">Видалити магазин?</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-slate-600 leading-relaxed">
                Ви збираєтесь видалити магазин{" "}
                <span className="font-bold text-slate-900 break-all">
                  &quot;{name}&quot;
                </span>
                .
                <br />
                Цю дію неможливо скасувати.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* DialogFooter в shadcn автоматически делает flex-col-reverse на мобильных */}
        <DialogFooter className="mt-6 gap-3 sm:gap-0">
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
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 sm:ml-2"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
