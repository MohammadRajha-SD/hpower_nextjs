"use client";

import {getData} from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useProviderRegister = () => {
  const locale = useLocale();
  const { data:provider } = useQuery({
    queryKey:["provider"],
    queryFn:() => getData(`provider/register`,locale),
  });

  return {
    provider,
  };
};
