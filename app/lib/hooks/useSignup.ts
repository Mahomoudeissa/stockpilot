"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/signup";

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,

    onSuccess: (result) => {
      if (!result.needsEmailConfirmation) {
        router.replace("/");
      }
    },
  });
}
