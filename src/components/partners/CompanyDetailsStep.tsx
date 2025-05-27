import { useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaUsers, FaUser, FaEnvelope } from "react-icons/fa";
import FormField from "./FormField";
import StepNavigation from "./StepNavigation";

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

//================ Company Details Step ================
const CompanyDetailsStep = ({
  register,
  errors,
  onNext,
  isNextDisabled,
  onPrev,
}) => {
  const t = useTranslations("CompanyDetailsStep");

  const employeeOptions = [
    { value: "1-10", label: t("employee_options.1_10") },
    { value: "11-50", label: t("employee_options.11_50") },
    { value: "51-100", label: t("employee_options.51_100") },
    { value: "100+", label: t("employee_options.100_plus") },
  ];

  return (
    <motion.div
      key="step1"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FaBuilding className="mr-2 text-interactive_color" />
          {t("title")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t("company_name_label")}
            icon={FaBuilding}
            register={register}
            name="companyName"
            errors={errors}
            placeholder={t("company_name_placeholder")}
            required={true} 
          />

          <FormField
            label={t("number_of_employees_label")}
            icon={FaUsers}
            register={register}
            name="numberOfEmployees"
            errors={errors}
            type="select"
            options={employeeOptions}
            placeholder={t("number_of_employees_placeholder")}
            required={true} 
          />

          <FormField
            label={t("contact_person_label")}
            icon={FaUser}
            register={register}
            name="contactPerson"
            errors={errors}
            placeholder={t("contact_person_placeholder")}
            required={true} 
          />

          <FormField
            label={t("contact_email_label")}
            icon={FaEnvelope}
            register={register}
            name="contactEmail"
            errors={errors}
            type="email"
            placeholder={t("contact_email_placeholder")}
            required={true} 
          />
        </div>
      </motion.div>

      <StepNavigation
        step={1}
        firstStep={true}
        onNext={onNext}
        onPrev={onPrev}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default CompanyDetailsStep;
