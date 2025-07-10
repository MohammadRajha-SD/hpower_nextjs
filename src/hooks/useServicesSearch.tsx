"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useServicesSearch = () => {
  const locale = useLocale();

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllData(`search-services`, locale),
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
