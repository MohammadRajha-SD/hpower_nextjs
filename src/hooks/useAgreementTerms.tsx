"use client";

import { getAllData } from "@/utils/getData";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const useAgreementTerms = () => {
  const locale = useLocale();

  const { data: terms } = useQuery({
    queryKey: ["terms"],
    queryFn: () => getAllData(`terms`, locale),
  });

  return {
    terms,
  };
};
