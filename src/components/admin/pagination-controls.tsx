// src/components/admin/pagination-controls.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
}

export function PaginationControls({
  hasNextPage,
  hasPrevPage,
  totalPages,
  currentPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => handlePageChange(currentPage - 1)}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Назад</span>
      </Button>

      <div className="text-sm text-slate-500 font-medium">
        Стор. {currentPage} з {Math.max(1, totalPages)}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(currentPage + 1)}
        className="gap-1"
      >
        <span className="hidden sm:inline">Вперед</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
