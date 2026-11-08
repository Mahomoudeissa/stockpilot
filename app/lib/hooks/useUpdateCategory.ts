"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCategory, type CreateCategoryInput } from "../api/categories";

type UpdateCategoryVariables = {
  categoryId: number;
  input: CreateCategoryInput;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, input }: UpdateCategoryVariables) =>
      updateCategory(categoryId, input),

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
