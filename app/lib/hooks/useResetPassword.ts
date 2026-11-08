"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "../api/reset-password";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (password: string) => resetPassword(password),

    onSuccess: () => {
      router.replace("/login?password-reset=success");
    },
  });
}
