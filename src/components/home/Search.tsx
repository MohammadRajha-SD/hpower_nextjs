"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchIcon, MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import LocationSelector from "./LocationSelector";
import CustomButton from "../ui/CustomButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/helper";
import { useServicesSearch } from "@/hooks/useServicesSearch";
import { Button } from "../ui/button";

const Search = () => {
  const t = useTranslations("Search");
  const { emirates, services: searchServices } = useServicesSearch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const allServices = useMemo(() => searchServices?.services || [], [searchServices]);
  const locale = useLocale();
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const shouldFilter =
      searchQuery.trim() !== "" ||
      selectedEmirate.trim() !== "" ||
      selectedCity.trim() !== "";

    if (!shouldFilter) {
      setFilteredServices([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = allServices.filter((service) => {
      const nameEn = service.name?.toLowerCase() || "";
      const nameAr = service.name_ar || "";
      const descEn = service.description?.toLowerCase() || "";
      const descAr = service.description_ar || "";
      const addresses = service.addresses || [];

      const query = searchQuery.toLowerCase();

      const matchesQuery =
        nameEn.includes(query) ||
        nameAr.includes(query) ||
        descEn.includes(query) ||
        descAr.includes(query);

      const matchesLocation =
        selectedEmirate === ""
          ? true
          : addresses?.some((addr) =>
            addr?.address?.toLowerCase() === selectedEmirate.toLowerCase()
          );

      return matchesQuery && matchesLocation;
    });

    const isSame =
      filtered.length === filteredServices.length &&
      filtered.every((service, idx) => service.id === filteredServices[idx]?.id);

    if (!isSame) {
      setFilteredServices(filtered);
      setIsDropdownOpen(filtered.length > 0);
    }
  }, [searchQuery, selectedEmirate, selectedCity, allServices]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Since filtering is already handled in useEffect, we just ensure dropdown stays open
    if (filteredServices.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  // Handle location selection
  const handleLocationSelect = (emirate, city) => {
    setSelectedEmirate(emirate);
    setSelectedCity(city || "");
    setIsLocationOpen(false);
  };

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto px-4 -mt-10 z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-4 gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-interactive_color focus:border-transparent"
          />
          {/* Dropdown */}
          {isDropdownOpen == true && filteredServices.length > 0 && (
            <motion.div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredServices.map((service, index) => (
                <div
                  key={`search12345_${service.id}_${index}`}
                  className="flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 gap-5"
                  onClick={() => {
                    router.push(`/services/${service.id}`);
                    setIsDropdownOpen(false);
                  }}
                >
                  {service.images?.[0] && (
                    <Image
                      src={service.images[0]}
                      alt={""}
                      width={80}
                      height={80}
                      className="object-cover rounded-md mr-4"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-active_color">
                      {locale == "ar" ? service.name_ar : service.name}
                    </h3>
                    {/* <p className="text-sm text-gray-600">
                      {parse(service.description.slice(0, 100) + "...")}
                    </p> */}
                    <div className="flex gap-2 items-center mt-2">
                      <span className="text-interactive_color font-medium">
                        {service.discount_price
                          ? formatCurrency(
                            parseFloat(service.discount_price),
                            locale,
                            16
                          )
                          : formatCurrency(
                            parseFloat(service.price),
                            locale,
                            16
                          )}
                      </span>
                      {service.discount_price && (
                        <span className="text-gray-500 line-through ml-2">
                          {formatCurrency(
                            parseFloat(service.price),
                            locale,
                            16
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {service.address}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("provided_by")}: {service.provider.name}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {(searchQuery?.trim() !== "" ||
            selectedEmirate?.trim() !== "" ||
            selectedCity?.trim() !== "") && filteredServices.length === 0 && (
              <motion.div
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-4 text-center text-gray-500">
                  {t("noServicesAvailable")}
                </div>
              </motion.div>
            )}

        </div>

        {/* Location Selector */}
        <div className="relative w-full md:w-64">
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-lg hover:border-interring-interactive_color focus:outline-none focus:ring-2 focus:ring-interactive_color"
            aria-label={t("select_location")}
          >
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-active_color hover:text-interactive_color mx-2" />
              <span
                className={
                  selectedEmirate
                    ? "text-text-active_color hover:text-interactive_color"
                    : "text-interactive_color hover:text-active_color"
                }
              >
                {selectedEmirate
                  ? selectedCity
                    ? `${selectedCity}, ${selectedEmirate}`
                    : selectedEmirate
                  : t("select_location")}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${isLocationOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLocationOpen && (
            <LocationSelector
              emirates={emirates?.emirates || {}}
              onSelect={handleLocationSelect}
              onClose={() => setIsLocationOpen(false)}
              selectedEmirate={selectedEmirate}
            />
          )}
        </div>

        {/* Search Button */}
        <div
          className={`bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out px-1 py-1  border border-interactive_color `}
        >
          <Button
            className={`px-6 py-3 bg-interactive_color text-white text-sm lg:text-xs xxl:text-sm rounded-full  font-medium hover:bg-active_color flex gap-2 shadow-xl whitespace-nowrap `}
          >
            {t("search_button")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default Search;
