// src/components/admin/delete-shop-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteShopButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Ви точно хочете видалити магазин "${name}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/shop/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Помилка видалення");

      router.refresh();
    } catch (error) {
      alert("Не вдалося видалити");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
