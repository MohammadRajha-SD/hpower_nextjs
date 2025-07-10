"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useServices } from "@/hooks/useServices";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, SearchIcon, FilterIcon, StarIcon } from "lucide-react";
import LocationSelector from "../home/LocationSelector";
import ServiceCard from "./ServiceCard";
import AddressPromptDialog from "../home/AddressPromptDialog";
import CategoriesSlider from "./CategoriesSlider";
import { useSearchParams } from "next/navigation";

const ServicesSection = () => {
  const { services, emirates } = useServices();
  const allServices = services?.services || [];
  const router = useRouter();
  const t = useTranslations("ServicesSection");

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");

  // Filter services based on search query and location
  const filteredServices = useMemo(() => {
    return allServices.filter((service: any) => {
      // Search query filter
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation =
        selectedEmirate === ""
          ? true
          : service?.addresses?.some((addr) =>
            addr?.address?.toLowerCase() === selectedEmirate.toLowerCase()
          );

      let matchesCategory = true;

      if (subcategoryId != null) {
        matchesCategory = service.category_id == subcategoryId;
      } else if (categoryId != null) {
        matchesCategory = service.parent_category_id == categoryId;
      } else {
        matchesCategory = true;
      }

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [allServices, searchQuery, selectedEmirate, categoryId, subcategoryId]);


  // Handle location selection
  const handleLocationSelect = (emirate: string, city?: string) => {
    setSelectedEmirate(emirate);
    setSelectedCity(city || "");
    setIsLocationSelectorOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedEmirate("");
    setSelectedCity("");
    window.location.href = "/services";
  };

  // Update zIndex when opening/closing selector
  const handleToggleSelector = () => {
    setIsLocationSelectorOpen((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="px-5 xl:px-[3%] xxl:px-[6%] xxxl:px-[12%] mx-auto ">

      {/* Header Section */}
      <motion.div
        className="text-center mb-8 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-interactive_color text-mobile_header lg:text-header mb-4">
          {t("title")}
        </h1>
        <p className="text-gray-800 text-description_sm lg:text-description_lg max-w-3xl mx-auto">
          {t("description")}
        </p>
      </motion.div>

      {/* Search & Filter Section */}
      <motion.div
        className="bg-white border-interactive_color rounded-xl shadow-md p-5 mb-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-interactive_color" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="pl-10 pr-4 py-3 w-full border border-interactive_color rounded-lg focus:outline-none focus:ring-2 focus:ring-interactive_color"
            />
          </div>

          {/* Location selector */}
          <div className="relative">
            <button
              onClick={handleToggleSelector}
              className="flex items-center justify-between w-full md:w-64 px-4 py-3 border border-interactive_color rounded-lg focus:outline-none focus:ring-2 focus:ring-interactive_color hover:border-interactive_color bg-white relative"
            >
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-active_color mr-2" />
                <span
                  className={
                    selectedEmirate
                      ? "text-active_color underline"
                      : "text-interactive_color hover:text-active_color hover:underline"
                  }
                >
                  {selectedEmirate
                    ? selectedCity
                      ? `${selectedCity}, ${selectedEmirate}`
                      : selectedEmirate
                    : t("select_location")}
                </span>
              </div>
              <FilterIcon className="h-4 w-4 text-interactive_color hover:text-active_color hover:underline" />
            </button>

            {isLocationSelectorOpen && (
              <LocationSelector
                emirates={emirates?.emirates || {}}
                onSelect={handleLocationSelect}
                onClose={() => setIsLocationSelectorOpen(false)}
                selectedEmirate={selectedEmirate}
              />
            )}
          </div>

          {/* View toggle (visible on mobile only) */}
          <div className="md:hidden flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg ${viewMode === "grid" ? "bg-interactive_color text-white" : "bg-gray-100 text-gray-500"}`}
              aria-label={t("view_grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg ${viewMode === "list" ? "bg-interactive_color text-white" : "bg-gray-100 text-gray-500"}`}
              aria-label={t("view_list")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Active filters */}
        {(searchQuery || selectedEmirate) && (
          <div className="flex flex-wrap items-center mt-4 gap-2">
            <span className="text-sm text-gray-500">{t("active_filters")}</span>

            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={t("clear_search")}
                >
                  ×
                </button>
              </span>
            )}

            {selectedEmirate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {selectedCity
                  ? `${selectedCity}, ${selectedEmirate}`
                  : selectedEmirate}
                <button
                  onClick={() => {
                    setSelectedEmirate("");
                    setSelectedCity("");
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={t("clear_location")}
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-interactive_color hover:underline ml-2"
              aria-label={t("clear_all")}
            >
              {t("clear_all")}
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Categories Section */}
      {/* <CategoriesSlider /> */}

      {/* <h2 className="text-mobile_header lg:text-header text-interactive_color">
        <h1>{t("allServices")}</h1>
      </h2> */}

      {/* Results count */}
      <div className="flex justify-between items-center mb-5 mt-2">
        {filteredServices.length === 0
          ?
          <div className="mx-auto text-center max-w-md bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl shadow-sm">
            <p className="font-semibold text-lg">{t("no_services_found")}</p>
            <p className="text-sm">{t("stay_tuned_for_updates")}</p>
          </div>
          :
          <p className="text-interactive_color  bg-green-300/60 p-2 rounded-xl">
            {`${t("showing")} ${filteredServices.length} ${filteredServices.length === 1 ? t("service") : t("services")}`}
          </p>
        }
        {/* View toggle (visible on desktop only) */}
        <div className="hidden md:flex gap-2 ml-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-interactive_color text-white" : "bg-gray-100 text-gray-500"}`}
            aria-label={t("view_grid")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
            </svg>
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-interactive_color text-white" : "bg-gray-100 text-gray-500"}`}
            aria-label={t("view_list")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className=" ">
        {/* No results message */}
        {filteredServices.length === 0 && (
          <div
            className={`text-center py-16 bg-gray-50 rounded-xl `}
          >
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("no_services_found")}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {t("adjust_search")}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-interactive_color text-white rounded-lg hover:bg-opacity-90 transition-colors"
              aria-label={t("clear_filters")}
            >
              {t("clear_filters")}
            </button>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 && (
          // <AnimatePresence>
          <div
            // variants={containerVariants}
            // initial="hidden"
            // animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 `}
          >
            {filteredServices.map((service: any) => (
              <ServiceCard
                key={service.id}
                service={service}
                viewMode={viewMode}
                cardVariants={cardVariants}
                router={router}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      <AddressPromptDialog />
    </div>
  );
};

export default ServicesSection;
