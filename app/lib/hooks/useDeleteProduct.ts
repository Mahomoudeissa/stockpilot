"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../api/products";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
