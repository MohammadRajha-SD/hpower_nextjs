import { useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";

//================ Animation Variants ================
const formVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

//================ ProgressBar Component ================
const AgreementProgressBar = ({ step, totalSteps = 3 }) => {
  const t = useTranslations("Providers");

  return (
    <div className="mb-10 relative">
      <div className="h-2 bg-gray-200 rounded-full">
        <motion.div
          className="h-2 bg-active_color rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) * 100) / totalSteps}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <div
          className={`text-sm ${step == 0 ? "text-interactive_color font-medium" : "text-gray-500"}`}
        >
          {t("providerInformation")}
        </div>
        <div
          className={`text-sm ${step == 1 ? "text-interactive_color font-medium" : "text-gray-500"}`}
        >
          {t("termsConditions")}
        </div>
        <div
          className={`text-sm ${step == 2 ? "text-interactive_color font-medium" : "text-gray-500"}`}
        >
          {t("eSignture")}
        </div>
      </div>
    </div>
  );
};

export default AgreementProgressBar;
