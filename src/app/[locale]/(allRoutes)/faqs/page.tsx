import { useTranslations } from "next-intl";
import React from "react";
import FAQ from "@/components/faq/FAQ";


const page = () => {
  const t = useTranslations("faq");
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 lg:py-24">
      <FAQ />
    </div>
  );
};

export default page;
