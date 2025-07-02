"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import useUserDetails from "@/hooks/useUserDetails";
//================ Custom Hook for Data Fetching =================
export const useCategories = () => {
  const locale = useLocale();
  // const { user } = useUserDetails();

  // var address = null;

  // if (user && user.address) {
  //   address = user.address;
  // }

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllData(`categories`, locale),
  });

  return {
    categories,
  };
};
