// FinalStep.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaArrowLeft,
  FaSpinner,
  FaUpload,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { usePlans } from "@/hooks/usePlans";
import SelectionButton from "./SelectionButton";

// Animation variants
const formVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FinalStep = ({
  register,
  onPrev,
  formValues,
  selectedCities,
  selectedServices,
  setValue,
  isSubmitting,
  isSuccess,
  errors,
}) => {
  const t = useTranslations("FinalStep");
  const { plans } = usePlans();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const tTerms = useTranslations("Terms");

  // Reset selectedPlan and companyLicense on success
  useEffect(() => {
    if (isSuccess) {
      setValue("selectedPlan", "");
      setValue("companyLicense", null);
      setUploadedFile(null);
    }
  }, [isSuccess, setValue]);

  const handleAgreeTerms = () => {
    setValue("terms", true, { shouldValidate: true });
    setIsTermsModalOpen(false);
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be less than 5MB.");
      return;
    }

    setUploadedFile(file);
    setValue("companyLicense", file, { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValue("companyLicense", null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      key="step4"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Terms and Conditions Modal */}
      {isTermsModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-interactive_color mb-4 text-center">
              {t("termsLink")}
            </h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-4 text-xs">{tTerms("paragraph_1")}</p>
              <p className="mb-4 text-xs">{tTerms("paragraph_2")}</p>
              <p className="mb-2 text-xs">{tTerms("point_1")}</p>
              <p className="mb-2 text-xs">{tTerms("point_2")}</p>
              <p className="mb-2 text-xs">{tTerms("point_3")}</p>
              <p className="mb-2 text-xs">{tTerms("point_4")}</p>
              <p className="mb-2 text-xs">{tTerms("point_5")}</p>
              <p className="mb-2 text-xs">{tTerms("point_6")}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {tTerms("cancel")}
              </button>
              <button
                type="button"
                onClick={handleAgreeTerms}
                className="px-4 py-2 bg-interactive_color text-white rounded-lg hover:bg-opacity-90"
              >
                {tTerms("agree")}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="form-group">
        <label className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          💼 {t("select_plan_label")}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {plans?.data?.map((plan: any) => (
            <SelectionButton
              key={plan.id}
              item={plan.text}
              selected={formValues.selectedPlan === plan.text}
              onToggle={() =>
                setValue("selectedPlan", plan.text, { shouldValidate: true })
              }
            />
          ))}
        </div>
        {errors.selectedPlan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.selectedPlan.message}
          </p>
        )}
      </div>

      <motion.div variants={fadeInUp}>
        <div className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <BiInfoCircle className="mr-2 text-interactive_color" />
          {t("additionalInformation")}
        </div>

        <div className="form-group mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("companyInfoLabel")}{" "}
            <span className="text-gray-500 ml-2 text-xs">
              ({t("optional") || "Optional"})
            </span>
          </label>
          <textarea
            {...register("messages")}
            placeholder={t("additionalInfoPlaceholder")}
            rows={6}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-interactive_color focus:border-transparent transition duration-200"
          />
        </div>

        {/* Company License Upload Section */}
        <div className="form-group mb-8">
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            📄 {t("companyLicenseLabel") || "Company License"}
            <span className="text-red-500">*</span>
          </label>

          {!uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragOver
                ? "border-interactive_color bg-blue-50"
                : "border-gray-300 hover:border-interactive_color hover:bg-gray-50"
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <FaUpload className="h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">
                  {t("dragDropFile") ||
                    "Drag and drop your company license here, or"}{" "}
                  <span className="text-interactive_color font-medium">
                    {t("browseFiles") || "browse files"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {t("supportedFormats") || "Supported formats: PDF, JPG, PNG (Max 5MB)"}
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFileAlt className="h-6 w-6 text-interactive_color mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">
            {t("applicationSummary")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="text-gray-500">{t("company")}:</span>{" "}
                {formValues.companyName || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("size")}:</span>{" "}
                {formValues.numberOfEmployees || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("contactPerson")}:</span>{" "}
                {formValues.contactPerson || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("email")}:</span>{" "}
                {formValues.contactEmail || "—"}
              </p>
            </div>
            <div>
              <p>
                <span className="text-gray-500">{t("website")}:</span>{" "}
                {formValues.companyWebsite || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("phone")}:</span>{" "}
                {formValues.phoneNumber
                  ? `+${formValues.phoneNumber}`
                  : "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("cities")}:</span>{" "}
                {selectedCities.join(", ") || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("services")}:</span>{" "}
                {selectedServices.length > 2
                  ? `${selectedServices.slice(0, 2).join(", ")} + ${selectedServices.length - 2
                  } more`
                  : selectedServices.join(", ") || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("plan")}:</span>{" "}
                {formValues.selectedPlan || "—"}
              </p>
              <p>
                <span className="text-gray-500">{t("license")}:</span>{" "}
                {uploadedFile ? uploadedFile.name : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-4 gap-2">
            <input
              id="terms"
              type="checkbox"
              {...register("terms", {
                required:
                  t("termsRequired") ||
                  "You must accept the terms and conditions.",
              })}
              className="h-4 w-4 text-interactive_color border-gray-300 rounded focus:ring-interactive_color"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              {t("termsAndConditions")}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-interactive_color hover:text-interactive_color mx-1 underline"
              >
                {t("termsLink")}
              </button>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <FaArrowLeft className="h-5 w-5" />
          <span>{t("previous")}</span>
        </button>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <FaCheck className="h-5 w-5 mr-2" />
            <span>{t("applicationSubmitted")}</span>
          </motion.div>
        ) : (
          <button
            type="submit"
            disabled={
              isSubmitting || !!errors.terms || !formValues.selectedPlan
            }
            className={`px-6 py-3 bg-interactive_color text-white rounded-lg flex items-center gap-2 ${isSubmitting || !!errors.terms || !formValues.selectedPlan
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-interactive_color"
              } transition duration-200`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                <span>{t("submitting")}</span>
              </>
            ) : (
              <span>{t("submitApplication")}</span>
            )}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FinalStep;
