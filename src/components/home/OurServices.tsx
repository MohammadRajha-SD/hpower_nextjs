//================ OurServices Component ================
import React from "react";
import AutoSlider from "./AutoSlider";
import { useTranslations } from "next-intl";
import { useCategories } from "@/hooks/useCategories";

const OurServices = () => {
  const t = useTranslations("Categories");
  const tr = useTranslations("home");
  const { categories: cats } = useCategories();

  const parentCategories =
    cats?.data?.filter((cat: any) => !cat.has_parent) || [];

  const duplicatedData = [
    ...parentCategories,
    ...parentCategories,
    ...parentCategories,
  ];

  return (
    <section className="relative z-0 py-12">
      <div className="mx-auto px-4">
        {/* <h2 className="text-mobile_header lg:text-header text-interactive_color text-center mb-8">
          {tr("explore_our_collection")}
        </h2> */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-mobile_header lg:text-header text-interactive_color">
            {tr("explore_our_collection")}
          </h2>
          <a
            href="/services"
            className="text-interactive_color font-medium hover:underline"
          >
            {tr("view_all")} →
          </a>
        </div>

        <AutoSlider data={duplicatedData} />
      </div>
    </section>
  );
};

export default OurServices;
