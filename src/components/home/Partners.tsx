//================ Partners Component ================
import React from "react";
import { useTranslations } from "next-intl";
import PartnersSlider from "./PartnersSlider";
import { usePartners } from "@/hooks/usePartners";
import Loader from "../ui/Loader";

const Partners = () => {
  const t = useTranslations("home")
  const { partners } = usePartners();

  // Duplicate data for smoother slider loop
  const partnersData = partners?.data || [];
  const duplicatedData = [...partnersData, ...partnersData, ...partnersData];
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col items-center justify-center text-center py-8 ">
          <h1 className=" text-mobile_header lg:text-header text-interactive_color">
            {t("partners_header")}
          </h1>
         
        </div>
       {partners? <PartnersSlider data={duplicatedData} />: (
            <div className="flex flex-col md:flex-row items-center justify-around gap-5 w-full py-20">
              <Loader />
              <Loader />
              <Loader />
            </div>
          )}
      </div>
    </section>
  );
};

export default Partners;
