"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useServices = () => {
  const locale = useLocale();

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllData(`services`, locale),
  });

  const { data: emirates } = useQuery({
    queryKey: ["emirates"],
    queryFn: () => getAllData(`emirates`, locale),
  });

  return {
    services,
    emirates,
  };
};
