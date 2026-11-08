"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "../api/categories";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
      ]);
    },
  });
}
