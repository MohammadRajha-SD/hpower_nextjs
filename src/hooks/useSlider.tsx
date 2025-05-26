"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useSlides = () => {
  const locale = useLocale();
  const { data: slides } = useQuery({
    queryKey: ["slides"],
    queryFn: () => getAllData(`slides`, locale),
  });

  return {
    slides,
  };
};
