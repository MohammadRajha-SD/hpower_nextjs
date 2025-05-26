"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";

//================ Custom Hook for Data Fetching =================
export const usePartners = () => {
  const { data: partners } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllData(`partners`),
  });

  return {
    partners,
  };
};
