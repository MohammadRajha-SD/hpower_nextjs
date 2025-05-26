import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

interface LocationSelectorProps {
  emirates: Record<string, { name: string; slug: string }[]>;
  onSelect: (emirate: string, city?: string) => void;
  onClose: () => void;
  selectedEmirate: string;
}

const LocationSelector = ({
  emirates,
  onSelect,
  onClose,
  selectedEmirate,
}: LocationSelectorProps) => {
  const t = useTranslations("LocationSelector");
  const [expandedEmirate, setExpandedEmirate] = useState<string | null>(
    selectedEmirate || null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle emirate toggle
  const toggleEmirate = (emirate: string) => {
    setExpandedEmirate(expandedEmirate === emirate ? null : emirate);
  };

  // Handle city selection
  const handleCitySelect = (
    emirate: string,
    city: { name: string; slug: string }
  ) => {
    onSelect(city.slug, city.name);
  };

  // Filter emirates and cities based on search
  const filteredEmirates = Object.keys(emirates).filter((emirate) => {
    if (!searchTerm) return true;

    // Check if emirate name matches
    if (emirate.toLowerCase().includes(searchTerm.toLowerCase())) return true;

    // Check if any city in this emirate matches
    return emirates[emirate].some((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <motion.div
      ref={dropdownRef}
      className="absolute top-0 left-0 mt-2 w-full md:w-96 bg-white rounded-lg shadow-xl max-h-96 overflow-auto z-[1000]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="sticky top-0 bg-white p-4 border-b z-20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            {t("select_location_title")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("close")}
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full p-2 pl-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-interactive_color"
          />
        </div>
      </div>

      <div className="p-2">
        {filteredEmirates.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {t("no_locations_found", { searchTerm })}
          </div>
        ) : (
          filteredEmirates.map((emirate) => {
            // Filter cities in this emirate based on search term
            const filteredCities = searchTerm
              ? emirates[emirate].filter((city) =>
                  city.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : emirates[emirate];

            // Skip rendering this emirate if no cities match search
            if (searchTerm && filteredCities.length === 0) return null;

            return (
              <div key={emirate} className="mb-1">
                <div
                  onClick={() => toggleEmirate(emirate)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{emirate}</span>
                    {filteredCities.some(
                      (city) => city.slug === selectedEmirate
                    ) && (
                      <span className="ml-2 text-xs bg-yellow-100 text-interactive_color hover:text-active_color px-2 py-0.5 rounded-full">
                        {t("selected")}
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      expandedEmirate === emirate ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {expandedEmirate === emirate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 border-l-2 border-gray-200 pl-2 mt-1 mb-2"
                  >
                    {filteredCities.map((city) => (
                      <div
                        key={city.slug}
                        onClick={() => handleCitySelect(emirate, city)}
                        className={`p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${
                          selectedEmirate === city.slug
                            ? "bg-blue-50 text-interactive_color"
                            : ""
                        }`}
                      >
                        <span>{city.name}</span>
                        {selectedEmirate === city.slug && (
                          <CheckIcon className="h-4 w-4 text-interactive_color" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>

      {searchTerm && (
        <div className="sticky bottom-0 bg-white p-3 border-t">
          <button
            onClick={() => setSearchTerm("")}
            className="w-full py-2 text-center text-sm text-interactive_color hover:underline"
            aria-label={t("clear_search")}
          >
            {t("clear_search")}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LocationSelector;
