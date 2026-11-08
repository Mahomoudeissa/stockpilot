"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductsPage } from "../api/products";

export function useProductsPage(
  page: number,
  pageSize = 10,
  search = "",
  categoryId: number | null = null,
) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: [
      "products",
      "page",
      page,
      pageSize,
      normalizedSearch,
      categoryId,
    ],

    queryFn: () =>
      getProductsPage({
        page,
        pageSize,
        search: normalizedSearch,
        categoryId,
      }),

    placeholderData: keepPreviousData,
  });
}
