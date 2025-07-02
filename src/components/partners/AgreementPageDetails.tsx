"use client";
import "swiper/css";
import { useAgreement } from "@/hooks/useAgreement";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import { useAgreementTerms } from "@/hooks/useAgreementTerms";
import { format } from "date-fns";
import "@/styles/print.css";

const formVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const AgreementPageDetails = ({ uid }: { uid: string }) => {
    const printRef = useRef(null);
    const { agreement } = useAgreement(uid);
    const { terms } = useAgreementTerms();
    const t = useTranslations("Providers");
    const tF = useTranslations("AgreementDetails");
    const tTerms = useTranslations("ProvidersTerms");

    const [formValues, setFormValues] = useState({
        legal_business_name: agreement && agreement['legal_business_name'] || null,
        trade_license_number: agreement && agreement['trade_license_number'] || null,
        company_address: agreement && agreement['company_address'] || null,
        contact_email: agreement && agreement['contact_email'] || null,
        contact_phone_number: agreement && agreement['contact_phone_number'] || null,
        commission_agreed: agreement && agreement['commission_agreed'] || 0,
        eSignature: agreement && agreement['signature'] || null,
        id: agreement && agreement['id'] || null,
        signed_at: agreement && agreement['signed_at'] || null,
    });

    useEffect(() => {
        setFormValues({
            legal_business_name: agreement && agreement['legal_business_name'] || null,
            trade_license_number: agreement && agreement['trade_license_number'] || null,
            company_address: agreement && agreement['company_address'] || null,
            contact_email: agreement && agreement['contact_email'] || null,
            contact_phone_number: agreement && agreement['contact_phone_number'] || null,
            commission_agreed: agreement && agreement['commission_agreed'] || 0,
            eSignature: agreement && agreement['signature'] || null,
            id: agreement && agreement['id'] || null,
            signed_at: agreement && agreement['signed_at'] || null,
        });
    }, [agreement]);

    if (!agreement) return <div className="text-center mt-20 text-gray-500 text-lg">Loading...</div>;

    function decodeHtml(html) {
        if (typeof window === "undefined") return html;
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <div className="w-full py-10 my-5">
            <div className="container mx-auto p-4  max-w-6xl relative overflow-hidden">
                <div className="flex justify-center py-10" id="print-area">
                    <motion.div
                        key="step1"
                        className="print-area w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        ref={printRef}
                    >
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex items-center text-xl font-semibold text-gray-700">
                                <FaBuilding className="mr-2 text-indigo-600" />
                                {t("providerInformation")}
                                <small className="mx-2 text-sm text-gray-500">
                                    ({t("signed_at")} {format(new Date(agreement.signed_at), "MMMM d, yyyy")})
                                </small>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                        {tF("applicationSummary")}
                                    </h3>
                                    <b>
                                        {agreement && agreement.id && '#AG_11' + agreement?.id}
                                    </b>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
                                    <div className="space-y-2">
                                        <Field label={tF("legal_business_name")} value={formValues.legal_business_name} />
                                        <Field label={tF("trade_license_number")} value={formValues.trade_license_number} />
                                        <Field label={tF("company_address")} value={formValues.company_address} />
                                        <Field label={tF("contact_email")} value={formValues.contact_email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Field
                                            label={tF("contact_phone_number")}
                                            value={
                                                formValues.contact_phone_number
                                                    ? `+${formValues.contact_phone_number}`
                                                    : "—"
                                            }
                                        />
                                        <Field
                                            label={tF("commission_agreed")}
                                            value={`${formValues.commission_agreed} %`}
                                        />
                                        <div>
                                            <span className="block text-gray-500 font-medium">
                                                {tF("signature")}:
                                            </span>
                                            {formValues.eSignature ? (
                                                <img
                                                    src={formValues.eSignature}
                                                    alt="Signature"
                                                    className="mt-2 h-24 rounded border"
                                                />
                                            ) : (
                                                <p className="text-gray-600 mt-1">—</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms and Conditions Section */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm page-break-before">
                                <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                    {tTerms("termsLink")}
                                </h3>
                                {terms?.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: decodeHtml(terms.content) }} />
                                ) : (
                                    <p>{tTerms("no_terms")}</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handlePrint}
                        className="text-white px-4 py-2 rounded  transition"
                        style={{ backgroundColor: '#FF7C44' }}
                    >
                        {tF('print_agreement')}
                    </button>
                </div>
            </div>
        </div >
    );
};

const Field = ({ label, value }: { label: string; value: string | null }) => (
    <div>
        <span className="block text-gray-500 font-bold">{label}:</span>
        <p className="text-gray-700 mt-1">{value || "—"}</p>
    </div>
);

export default AgreementPageDetails;
