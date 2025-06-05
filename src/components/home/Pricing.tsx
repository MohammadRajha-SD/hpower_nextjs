"use client";
import React from "react";
import PricingCard from "./PlanCard";
import { usePlans } from "@/hooks/usePlans";
import { formatCurrency, getFeaturesFromDescription } from "@/utils/helper";
import CustomButton from "../ui/CustomButton";
import { useLocale, useTranslations } from "next-intl";
import Loader from "../ui/Loader";

const Pricing: React.FC = () => {
  const { plans } = usePlans();
  const t = useTranslations("Picing");
  const locale = useLocale();

  const sortedPacks =
    plans?.data?.sort((a: any, b: any) => a.price - b.price) || [];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-mobile_header lg:text-header text-interactive_color mb-2">
          {t("pricing_title")} {/* Use the translation key */}
        </h1>
        <p className="text-center text-description_sm md:text-description_lg mb-8 max-w-lg mx-auto">
          {t("pricing_description")} {/* Use the translation key */}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-0 mb-8">
          <CustomButton children={t("companies_button")} actionLink="/become-a-partner" />
          {/* Use the translation key */}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-0">
          {sortedPacks.length ? (
            sortedPacks?.map((pack: any, index: number) => (
              <PricingCard
                key={pack.id}
                planId={pack.id}
                title={pack.text}
                // subtitle={formatCurrency(pack.price, locale, 16) + `/${pack.number_of_months} ${t("month")}`}
                subtitle={t("month")}
                number_of_months={pack.number_of_months}
                price={pack.price}
                isPopular={pack.price >= 1499}
                // features={getFeaturesFromDescription(pack.description)}
                features={pack.description}
                buttonText={t("select_button")}
                className={
                  pack.price >= 1499
                    ? "md:order-2"
                    : index === 0
                      ? "md:order-1"
                      : "md:order-3"
                }
              />
            ))
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-around gap-5 w-full py-20">
              <Loader />
              <Loader />
              <Loader />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
