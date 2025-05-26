"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useCategories = () => {
  const locale = useLocale();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllData(`categories`, locale),
  });

  return {
    categories,
  };
};
