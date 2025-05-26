"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type PricingCardProps = {
  title: string;
  subtitle: string;
  price?: string;
  isPopular?: boolean;
  features: string[];
  buttonText: string;
  className?: string;
  planId: string; // Add planId here
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  isPopular = false,
  features,
  buttonText,
  className = "",
  planId,
}) => {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push(`/subscription/${planId}`);
  };
  const locale = useLocale();
  return (
    <div
      className={`w-full max-w-sm relative ${
        isPopular ? "z-10 md:-mt-4 shadow-2xl" : "z-0"
      } ${className}`}
    >
      {isPopular && (
        <div className="bg-interactive_color hover:bg-active_color text-white text-xs font-bold uppercase text-center py-1 rounded-t-lg">
          {locale === "ar" ? "الأكثر طلبا" : " MOST POPULAR"}
        </div>
      )}
      <div
        className={`bg-white text-black rounded-lg shadow-lg overflow-hidden ${
          isPopular ? "border-t-0 rounded-t-none" : ""
        }`}
      >
        <div className="block text-left text-sm max-w-sm mx-auto mt-2 text-black px-8 py-4">
          <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
            {title}
          </h1>
          <h2 className="text-sm text-gray-500 text-center pb-2">{subtitle}</h2>
          {price && (
            <h2 className="text-3xl text-center font-bold py-2">{price}</h2>
          )}
        </div>

        <div className="flex flex-wrap px-6 pb-4">
          <ul className="w-full">
            {features?.map((feature, index) => (
              <li key={index} className="flex items-center py-1">
                <div className="rounded-full p-1 fill-current text-green-700">
                  <svg
                    className="w-4 h-4 align-middle"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm ml-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center p-4 uppercase border-t border-gray-200">
          <button
            onClick={handleSubscribe}
            className={`text-sm font-semibold w-full text-white rounded-lg px-4 py-2 block shadow-md hover:opacity-90 ${
              isPopular
                ? "bg-interactive_color hover:bg-active_color"
                : "bg-gray-500 hover:bg-active_color"
            }`}
            disabled
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
