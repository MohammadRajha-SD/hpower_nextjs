"use client";

import { getAllData } from "@/utils/getData";
//================ Imports =================
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

//================ Custom Hook for Data Fetching =================
export const useFaqs = () => {
  const locale = useLocale();

  const { data: faqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => getAllData(`faqs`, locale),
  });
  const { data: faq_categories } = useQuery({
    queryKey: ["faq_categories"],
    queryFn: () => getAllData(`faq-categories`, locale),
  });

  return {
    faqs,
    faq_categories,
  };
};
