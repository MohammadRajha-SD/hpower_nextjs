import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useTranslations } from "next-intl";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

//================ Step Navigation ================
const StepNavigation = ({
  step,
  onNext,
  onPrev,
  isNextDisabled,
  firstStep = false,
}) => {
  const t = useTranslations("StepNavigation");
    const t1 = useTranslations("Confirmations");

  return (
    <motion.div
      variants={fadeInUp}
      className="flex justify-between mt-8 w-full"
    >
      <div className="w-1/2">
        {step > 0 && (
          <button
            type="button"
            onClick={onPrev}
            disabled={firstStep}
            className={`px-6 py-3 border text-center border-gray-300 rounded-lg flex items-center gap-2 ${
              !firstStep
                ? "bg-interactive_color text-white hover:bg-interactive_color"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition duration-200`}
          >
            <span>{t("previous")}</span>
          </button>
        )}
      </div>

      <div className="w-1/2 flex justify-end">
        {step < 2 && (
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              !isNextDisabled
                ? "bg-interactive_color text-white hover:bg-interactive_color"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition duration-200`}
          >
            <span>{t("next_step")}</span>
          </button>
        )}

         {step == 4 && (
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              !isNextDisabled
                ? "bg-interactive_color text-white hover:bg-interactive_color"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition duration-200`}
          >
            <span>{t1("confirm")}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StepNavigation;
