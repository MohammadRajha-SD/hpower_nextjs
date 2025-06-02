// hooks/useAgreement.ts
"use client";

import { getAllData } from "@/utils/getData";
import { useQuery } from "@tanstack/react-query";

export const useAgreement = (uid: string) => {
  const { data: agreement } = useQuery({
    queryKey: ["agreement", uid],
    queryFn: () => getAllData(`agreement/${uid}`),
    enabled: !!uid,
  });

  return {
    agreement,
  };
};
