"use client";
import React from "react";
import { useServices } from "@/hooks/useServices";
import ServiceCard from "./ServiceCard";
import Loader from "../ui/Loader";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FeaturedServices = () => {
  const { services } = useServices();
  const t = useTranslations("FeaturedServices");

  // Filter featured services
  const featuredServices = services?.services
    ?.filter((service: any) => service.featured === 0)
    .slice(0, 3); // Show up to 3 featured services

  if (!services) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-mobile_header lg:text-header text-interactive_color mb-6">
              {t("featured_services_title")}
            </h2>
            <a
              href="/services"
              className="text-interactive_color font-medium hover:underline hidden md:block"
            >
              {t("view_all_services")} →
            </a>
          </div>

          <div className="w-full text-center">
            <Loader />
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/services"
              className="inline-block bg-white text-interactive_color border border-intertext-interactive_color px-5 py-2 rounded-full font-medium hover:bg-intertext-interactive_color hover:text-white transition-colors duration-200"
            >
              {t("view_all_services_mobile")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredServices || featuredServices.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-mobile_header lg:text-header text-interactive_color mb-6">
            {t("featured_services_title")}
          </h2>
          <Link
            href="/services"
            className="text-interactive_color font-medium hover:underline hidden md:block"
          >
            {t("view_all_services")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices?.map((service: any) => (
            <ServiceCard
              key={"featured_service_" + service.id}
              id={service.id}
              title={service.name}
              description={service.description}
              image={service.images[0]}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a
            href="/services"
            className="inline-block bg-white text-interactive_color border border-intertext-interactive_color px-5 py-2 rounded-full font-medium hover:bg-intertext-interactive_color hover:text-white transition-colors duration-200"
          >
            {t("view_all_services_mobile")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
