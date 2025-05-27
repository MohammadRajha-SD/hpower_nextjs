import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiServiceLine } from "react-icons/ri";
import SelectionButton from "./SelectionButton";
import { FaGlobe } from "react-icons/fa";
import FormField from "./FormField";
import StepNavigation from "./StepNavigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useServices } from "@/hooks/useServices";
import { Controller } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";

const formVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CoverageAndServicesStep = ({
  register,
  errors,
  control,
  onNext,
  onPrev,
  isNextDisabled,
  selectedCities,
  setSelectedCities,
  selectedServices,
  setSelectedServices,
}) => {
  const t = useTranslations("CoverageAndServicesStep");
  const { emirates } = useServices();
  const { categories } = useCategories();
  const [customService, setCustomService] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const getAllCities = (emiratesData = { emirates: {} }) => {
    if (!emiratesData || !emiratesData.emirates) return [];
    return Object.values(emiratesData.emirates)
      .flat()
      .map((city: any) => city.name);
  };

  const allLocations = getAllCities(emirates);
  const serviceCategories =
    categories?.data
      ?.filter((cat: any) => !cat.has_parent)
      ?.map((category: any) => category.name) || [];

  const toggleLocation = (location: string) => {
    setSelectedCities((prev: string[]) =>
      prev.includes(location)
        ? prev.filter((c: string) => c !== location)
        : [...prev, location]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev: string[]) =>
      prev.includes(service)
        ? prev.filter((s: string) => s !== service)
        : [...prev, service]
    );
  };

  const handleAddCustomService = () => {
    if (
      customService.trim() &&
      !selectedServices.includes(customService.trim())
    ) {
      setSelectedServices((prev: string[]) => [...prev, customService.trim()]);
      setCustomService("");
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomService();
    }
  };

  const handleOtherClick = () => setShowCustomInput(true);

  const isServiceValid =
    selectedServices.length > 0 || customService.trim() !== "";

  return (
    <motion.div
      key="step3"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FormField
            label={t("company_website_label")}
            icon={FaGlobe}
            register={register}
            name="companyWebsite"
            errors={errors}
            placeholder={t("company_website_placeholder")}
            required={false} // Mark as optional
          />

          {/* Phone Number with Flag using Controller */}
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("phone_number_label")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: t("error.phone_required"),
                  validate: (value) => {
                    const countryCode = "+971";
                    const localNumber = value.slice(countryCode.length - 1);
                    const prefix = localNumber.slice(0, 2);
                    const validPrefixes = ["50", "54", "56", "52", "55", "58"];
                    const remainingDigits = localNumber.slice(2);

                    if (value === countryCode || value.length <= countryCode.length) {
                      return (
                        t("error.phone_invalid") ||
                        "Phone number must include more than just the country code"
                      );
                    }

                    else if (!validPrefixes.includes(prefix)) {
                      return (t("error.phone_invalid_prefix") || "Phone number prefix is invalid. Must be one of Etisalat or Du.");
                    }

                    else if (!/^\d{7}$/.test(remainingDigits)) {
                      return ( t("error.phone_invalid_format") || "Phone number must have exactly 7 digits after the prefix");
                    }

                    else if ((value.length - 3) != 9) {
                      return (t("error.phone_invalid_digits") || "Phone number must be exactly 9 digits after the country code");
                    }

                    return true;
                  },
                }}

                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    country={"ae"}
                    value={value}
                    onChange={(value, country, e, formattedValue) => {
                      onChange(value); // Update form state
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "48px",
                      fontSize: "1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #e5e7eb",
                      paddingLeft: "48px",
                      backgroundColor: "white",
                      outline: "none",
                    }}
                    buttonStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRight: "none",
                      borderRadius: "0.375rem 0 0 0.375rem",
                    }}
                    dropdownStyle={{
                      width: "300px",
                    }}
                    inputProps={{
                      required: true,
                      name: "phone",
                      className:
                        "focus:ring-2 focus:ring-interactive_color focus:border-interactive_color transition-all duration-200",
                    }}
                    placeholder={t("phone_number_placeholder")}
                  />
                )}
              />
            </div>
            {errors.phoneNumber && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.phoneNumber.message}
              </motion.p>
            )}
          </div>
        </div>

        <div className="form-group mb-8">
          <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <HiOutlineLocationMarker className="mr-2 text-interactive_color" />
            {t("cities_operate_label")}{" "}
            <span className="text-gray-500 ml-2 text-xs">
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allLocations.map((location) => (
              <SelectionButton
                key={location}
                item={location}
                selected={selectedCities.includes(location)}
                onToggle={toggleLocation}
              />
            ))}
          </div>
          {errors.cities && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1"
            >
              {t("city_required")}
            </motion.p>
          )}
        </div>

        <div className="form-group">
          <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <RiServiceLine className="mr-2 text-interactive_color" />
            {t("services_offered_label")}{" "}
            <span className="text-gray-500 ml-2 text-xs">
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {serviceCategories.map((service: string) => (
              <SelectionButton
                key={service}
                item={service}
                selected={selectedServices.includes(service)}
                onToggle={toggleService}
              />
            ))}
            {selectedServices
              .filter((service) => !serviceCategories.includes(service))
              .map((service) => (
                <SelectionButton
                  key={service}
                  item={service}
                  selected={selectedServices.includes(service)}
                  onToggle={toggleService}
                />
              ))}
            <SelectionButton
              key="other"
              item={t("other_service_button") || "Other"}
              selected={false}
              onToggle={handleOtherClick}
              fromOtherButton={true}
            />
          </div>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 mt-4"
            >
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  t("other_service_placeholder") || "Enter other service"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-interactive_color"
              />
              <button
                type="button"
                onClick={handleAddCustomService}
                disabled={!customService.trim()}
                className={`px-4 py-2 rounded-md text-white ${customService.trim()
                  ? "bg-interactive_color hover:bg-opacity-90"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {t("add_service_button") || "Add"}
              </button>
            </motion.div>
          )}
          {!isServiceValid && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1"
            >
              {t("services_required") || "At least one service is required"}
            </motion.p>
          )}
        </div>
      </motion.div>

      <StepNavigation
        step={1}
        onNext={onNext}
        onPrev={onPrev}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default CoverageAndServicesStep;
