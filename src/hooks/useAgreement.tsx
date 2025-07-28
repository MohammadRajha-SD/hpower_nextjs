// hooks/useAgreement.ts
"use client";

import { getAllData } from "@/utils/getData";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const useAgreement = (uid: string) => {
  const locale = useLocale();

  const { data: agreement } = useQuery({
    queryKey: ["agreement", uid],
    queryFn: () => getAllData(`agreement/${uid}`, locale),
    enabled: !!uid,
  });

  return {
    agreement,
  };
};
