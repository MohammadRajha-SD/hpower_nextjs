"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const usePlans = () => {
  const locale = useLocale();
  
  const { data: plans } = useQuery({
    queryKey: ["packs"],
    queryFn: () => getAllData(`packs`, locale),
  });

  return {
    plans,
  };
};
