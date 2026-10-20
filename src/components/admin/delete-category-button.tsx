"use client";

import { useTransition } from "react";
import { deleteCategoryAction } from "@/lib/admin-actions";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  disabled?: boolean;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  disabled = false,
}: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !confirm(
        `Delete category "${categoryName}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategoryAction(categoryId);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={handleDelete}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
      title={
        disabled
          ? "Cannot delete category with active products"
          : "Delete category"
      }
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
