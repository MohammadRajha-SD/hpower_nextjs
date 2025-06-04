"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import SuccessPopup from "./SuccessPopup";
import AgreementDetails from "./AgreementDetails";
import AgreementProgressBar from "./AgreementProgressBar";
import AgreementESignture from "./AgreementESignture";
import AgreementTermsConditions from "./AgreementTermsConditions";

interface FormValues {
  terms?: boolean | false;
  eSignture?: File | null;
}

const AgreementForm = ({ agreement }) => {
  const t = useTranslations("Agreement");
  const locale = useLocale();

  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
    control,
    setValue,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      terms: false,
      eSignture: null,
    },
  });

  const formValues = watch();

  const section1Valid = true;
  const section2Valid = formValues.terms;
  const section3Valid = formValues.eSignture;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const uid = agreement.uid || null;
      const formData = new FormData();
      formData.append("terms", String(data.terms));
      formData.append("eSignture", data.eSignture);
      formData.append("uid", uid);
      formData.append("lang", locale);

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/agreement/${uid}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const backendResult = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(backendResult.message || "Backend submission failed");
      }

      // success
      setIsSuccess(true);
      setShowSuccessPopup(true);

      toast.success(t("formSubmitted") || "Application submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(
        errorMessage.includes("fetch")
          ? t("networkError") || "Network error. Please check your connection."
          : t("submissionError") || "Submission failed. Please try again."
      );
    } finally {
      if (!isSuccess) {
        setIsSubmitting(false);
      } else {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setIsSuccess(false);
    reset();
    setFormStep(0);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (formStep === 0) {
      fieldsToValidate = [];
    }
    else if (formStep === 1) {
      fieldsToValidate = ["terms"];
    }
    else if (formStep === 2) {
      fieldsToValidate = ["eSignture"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    const stepValidations = [section1Valid, section2Valid, section3Valid];

    if (isStepValid && stepValidations[formStep]) {
      setFormStep((current) => current + 1);
    } else {
      toast.error(t("fillRequiredFields") || "Please fill all required fields");
    }
  };

  const previousStep = () => setFormStep((current) => current - 1);

  return (
    <div className="container mx-auto p-4 max-w-7xl relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-6 md:p-8"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-mobile_header lg:text-header mb-3 text-interactive_color text-center"
        >
          {t("agreement") || "Agreement"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-gray-600 mb-8 text-center max-w-2xl mx-auto"
        >
          {t("agreement_desc") || "Registration Contract Form."}
        </motion.p>

        <AgreementProgressBar step={formStep} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          <AnimatePresence mode="wait">
            {formStep === 0 && (
              <AgreementDetails
                register={register}
                onPrev={previousStep}
                errors={errors}
                onNext={nextStep}
                isNextDisabled={!section1Valid}
                agreement={agreement}
              />
            )}

            {formStep === 1 && <AgreementTermsConditions
              register={register}
              errors={errors}
              control={control}
              setValue={setValue}
              onNext={nextStep}
              onPrev={previousStep}
              isNextDisabled={!section2Valid}
            />
            }

            {formStep === 2 && (
              <AgreementESignture
                errors={errors}
                register={register}
                onPrev={previousStep}
                formValues={formValues}
                setValue={setValue}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
              />
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />}
      </AnimatePresence>
    </div>
  );
};

export default AgreementForm;
