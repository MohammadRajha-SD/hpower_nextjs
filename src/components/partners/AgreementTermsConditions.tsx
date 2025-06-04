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
import { useAgreementTerms } from "@/hooks/useAgreementTerms";

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
  const { terms } = useAgreementTerms();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  function decodeHtml(html) {
    if (typeof window === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <motion.div
      key="step3"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6">

      {/* Terms and Conditions Section */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mx-auto">
        {terms?.content ? (
          <div dangerouslySetInnerHTML={{ __html: decodeHtml(terms.content) }} />
        ) : (
          <p>{tTerms("no_terms")}</p>
        )}
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
