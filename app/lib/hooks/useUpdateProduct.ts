"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct, type CreateProductInput } from "../api/products";

type UpdateProductVariables = {
  productId: number;
  input: CreateProductInput;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, input }: UpdateProductVariables) =>
      updateProduct(productId, input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
