"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import StepNavigation from "./StepNavigation";

const formVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AgreementTermsConditions = ({
  register,
  errors,
  control,
  setValue,
  onNext,
  onPrev,
  isNextDisabled,
}) => {
  const tF = useTranslations("FinalStep");
  const tTerms = useTranslations("ProvidersTerms");
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <motion.div
      key="step3"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Terms and Conditions Section */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mx-auto ">
        <h2 className="text-2xl font-bold text-interactive_color mb-6 text-center">
          {tTerms("termsLink")}
        </h2>

        {/* Effective Date */}
        <p className="text-sm text-gray-600 mb-6">
          <span className="font-medium">{tTerms("title1")}</span> {formattedDate}
        </p>

        {/* Paragraph 1 */}
        <p className="text-sm text-gray-700 mb-6">
          {tTerms("paragraph1")}
        </p>

        {/* Section 1: Scope of Work */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {tTerms("title2")}
          </h3>
          <p className="text-sm text-gray-700">{tTerms("paragraph2")}</p>
        </div>

        {/* Section 2: Registration & Compliance */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {tTerms("title3")}
          </h3>
          <p className="text-sm text-gray-700">{tTerms("paragraph3")}</p>
        </div>

        {/* Section 3: Commission & Payment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {tTerms("title4")}
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>{tTerms("paragraph4_1")}</li>
            <li>{tTerms("paragraph4_2")}</li>
            <li>{tTerms("paragraph4_3")}</li>
          </ul>
        </div>
      </div>

      {/* Accept Checkbox */}
      <div className="form-group mt-6">
        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-interactive_color border-gray-300 rounded focus:ring-interactive_color"
            {...register("terms", { required: true })}
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            {tF("termsAndConditions")}
            <a
              href="#"
              className="text-interactive_color hover:underline ml-1"
            >
              {tF("termsLink")}
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-500 mt-1">{tTerms("termsError")}</p>
        )}
      </div>


      <StepNavigation
        step={1}
        onNext={onNext}
        onPrev={onPrev}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default AgreementTermsConditions;
