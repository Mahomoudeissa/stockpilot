"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentProfile } from "../api/profile";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentProfile,
  });
}
