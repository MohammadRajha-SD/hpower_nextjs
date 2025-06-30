import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
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
const AgreementDetails = ({
    register,
    errors,
    onNext,
    isNextDisabled,
    onPrev,
    agreement
}) => {
    const t = useTranslations("Providers");
    const tF = useTranslations("AgreementDetails");
    const tF2 = useTranslations("FinalStep");

    const [formValues, setFormValues] = useState({
        legal_business_name: agreement && agreement['legal_business_name'] || null,
        trade_license_number: agreement && agreement['trade_license_number'] || null,
        company_address: agreement && agreement['company_address'] || null,
        contact_email: agreement && agreement['contact_email'] || null,
        contact_phone_number: agreement && agreement['contact_phone_number'] || null,
        commission_agreed: agreement && agreement['commission_agreed'] || 0,
        plan_name: agreement && agreement['plan_name'] || null,
        eSignature: ''
    });

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
                    {t("providerInformation")}
                </div>

                {/* Preview Details Start */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">
                        {tF("applicationSummary")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>
                                <span className="text-gray-500">{tF("legal_business_name")}:</span>{" "}
                                {formValues.legal_business_name || "—"}
                            </p>
                            <p>
                                <span className="text-gray-500">{tF("trade_license_number")}:</span>{" "}
                                {formValues.trade_license_number || "—"}
                            </p>
                            <p>
                                <span className="text-gray-500">{tF("company_address")}:</span>{" "}
                                {formValues.company_address || "—"}
                            </p>
                              <p>
                                <span className="text-gray-500">{tF("contact_email")}:</span>{" "}
                                {formValues.contact_email || "—"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="text-gray-500">{tF("contact_phone_number")}:</span>{" "}
                                {formValues.contact_phone_number
                                    ? `+${formValues.contact_phone_number}`
                                    : "—"}
                            </p>
                            <p>
                                <span className="text-gray-500">{tF("commission_agreed")}:</span>{" "}
                                {formValues.commission_agreed || "0.00"}
                            </p>
                            <p>
                                <span className="text-gray-500">{tF2("plan")}:</span>{" "}
                                {formValues.plan_name || "0.00"}
                            </p>
                            <p>
                                <span className="text-gray-500">{tF("signature")}</span>{" "}
                                {formValues.eSignature ? (
                                    <img src={formValues.eSignature} alt="Signature" className="mt-2 h-24" />
                                ) : (
                                    "—"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Preview Details End */}
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

export default AgreementDetails;
