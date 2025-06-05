"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { formatCurrency } from "@/utils/helper";

type PricingCardProps = {
  title: string;
  subtitle: string;
  price?: string;
  isPopular?: boolean;
  features: string[];
  buttonText: string;
  className?: string;
  number_of_months: number;
  planId: string; // Add planId here
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  isPopular = false,
  features,
  buttonText,
  number_of_months = 0,
  className = "",
  planId,
}) => {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push(`/subscription/${planId}`);
  };

  const locale = useLocale();
  function decodeHtml(html) {
    if (typeof window === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  return (
    <div
      className={`w-full max-w-sm relative ${isPopular ? "z-10 md:-mt-4 shadow-2xl" : "z-0"
        } ${className}`}
    >
      {isPopular && (
        <div className="bg-interactive_color hover:bg-active_color text-white text-xs font-bold uppercase text-center py-1 rounded-t-lg">
          {locale === "ar" ? "الأكثر طلبا" : " MOST POPULAR"}
        </div>
      )}
      <div
        className={`bg-white text-black rounded-lg shadow-lg overflow-hidden ${isPopular ? "border-t-0 rounded-t-none" : ""
          }`}
      >
        <div className="block text-left text-sm max-w-sm mx-auto mt-2 text-black px-8 py-4">
  <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
    {title}
  </h1>

  {/* Centered currency and duration */}
  <h2 className="text-sm text-gray-500 text-center pb-2 flex items-center justify-center">
      {formatCurrency(price, locale, 16)} /{number_of_months} {subtitle}
  </h2>

  {/* Large bold price below */}
  {price && (
    <h2 className="text-3xl text-center font-bold py-2">
      <div className="flex justify-center">{formatCurrency(price, locale, 20)}</div>
    </h2>
  )}
</div>


        <div className="flex flex-wrap px-6 pb-4">
          <div dangerouslySetInnerHTML={{ __html: decodeHtml(features) }} />
        </div>
        {/* <div className="flex items-center p-4 uppercase border-t border-gray-200">
          <button
            onClick={handleSubscribe}
            className={`text-sm font-semibold w-full text-white rounded-lg px-4 py-2 block shadow-md hover:opacity-90 ${isPopular
              ? "bg-interactive_color hover:bg-active_color"
              : "bg-gray-500 hover:bg-active_color"
              }`}
            disabled
          >
            {buttonText}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PricingCard;
