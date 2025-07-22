"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import ProgressBar from "./ProgressBar";
import CompanyDetailsStep from "./CompanyDetailsStep";
import CoverageAndServicesStep from "./CoverageAndServicesStep";
import FinalStep from "./FinalStep";
import SuccessPopup2 from "./SuccessPopup2";
import { sendContactForm } from "@/actions/sendMail";
import { sendVerificationCodeEmail } from "@/actions/sendVerificationCode";
import EmailVerificationStep from "./EmailVerificationStep";

interface FormValues {
  companyName: string;
  numberOfEmployees: string;
  contactPerson: string;
  contactEmail: string;
  companyWebsite: string;
  phoneNumber: string;
  message: string;
  selectedPlan: string;
  terms: boolean;
  companyLicense?: File | null;
  code?: null;
}

const PartnerForm = () => {
  const t = useTranslations("PartnerForm");
  const t1 = useTranslations("Confirmations");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const locale = useLocale();

  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

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
      companyName: "",
      numberOfEmployees: "",
      contactPerson: "",
      phoneNumber: "",
      contactEmail: "",
      companyWebsite: "",
      message: "",
      selectedPlan: "",
      terms: false,
      companyLicense: null,
      code: null,
    },
  });

  const formValues = watch();

  const section1Valid =
    formValues.companyName &&
    formValues.numberOfEmployees &&
    formValues.contactPerson &&
    formValues.contactEmail;

  // Updated section2Valid to include phone number validation
  const section2Valid =
    formValues.phoneNumber &&
    formValues.phoneNumber.length > 4 &&
    selectedCities.length > 0 &&
    selectedServices.length > 0;

  const section3Valid = formValues.selectedPlan && formValues.terms;
  const section4Valid = formValues.code;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setIsSuccess(false); // reset success

    try {
      const formData = new FormData();

      formData.append("company_name", data.companyName);
      formData.append("company_website", data.companyWebsite);
      formData.append("contact_person", data.contactPerson);
      formData.append("contact_email", data.contactEmail);
      formData.append("phone", data.phoneNumber || "");
      formData.append("number_employees", data.numberOfEmployees);
      formData.append("cities", selectedCities.join(","));
      formData.append("services", selectedServices.join(","));
      formData.append("plans", data.selectedPlan);
      formData.append("notes", data.message || "");
      formData.append("lang", locale || "en");

      if (data.companyLicense) {
        formData.append("licence", data.companyLicense);
      }

      console.log("Submitting data:", {
        ...formData,
        licence: data.companyLicense ? "[File]" : null,
      });

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_OLD}/become-partner`,
        {
          method: "POST",
          body: formData,
        }
      );

      const backendResult = await backendResponse.json();

      if (!backendResponse.ok) {
        if (backendResponse.status === 422 && backendResult.errors) {
          // Show validation errors
          Object.entries(backendResult.errors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            toast.error(`${message}`);
          });
          return;
        }

        // Other error (500 or custom)
        throw new Error(backendResult.message || "Backend submission failed");
      }


      // 5. إرسال البيانات عبر الإيميل
      const emailFormData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== "companyLicense") {
          emailFormData.append(key, value.toString());
        }
      });

      emailFormData.append("selectedCities", selectedCities.join(","));
      emailFormData.append("selectedServices", selectedServices.join(","));

      const emailResult = await sendContactForm(emailFormData, locale);

      if (emailResult.success) {
        setIsSuccess(true);
        setShowSuccessPopup(true);
        toast.success(t("formSubmitted") || "Application submitted successfully!");
      } else {
        // رغم فشل الإيميل، إظهار النجاح لأن الـ backend نجح
        console.warn("Email failed but backend succeeded:", emailResult.error);
        setIsSuccess(true);
        setShowSuccessPopup(true);
        toast.success(t("formSubmitted") || "Application submitted successfully!");
      }
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
    setSelectedCities([]);
    setSelectedServices([]);
    setValue("selectedPlan", "");
    setFormStep(0);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    if (formStep === 0) {
      fieldsToValidate = [
        "companyName",
        "numberOfEmployees",
        "contactPerson",
        "contactEmail",
      ];
    }
    else if (formStep === 1) {
      fieldsToValidate = ["code"];
    }
    else if (formStep === 2) {
      fieldsToValidate = ["phoneNumber"];
    } else if (formStep === 3) {
      fieldsToValidate = ["selectedPlan", "terms"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    const stepValidations = [section1Valid, section4Valid, section2Valid, section3Valid];

    if (isStepValid && stepValidations[formStep]) {
      setFormStep((current) => current + 1);
    } else {
      toast.error(t("fillRequiredFields") || "Please fill all required fields");
    }
  };

  const previousStep = () => setFormStep((current) => current - 1);

  const verifyCode = (enteredCode: string) => {
    const savedCode = localStorage.getItem("confirmationCode");
    const res = enteredCode === savedCode;

    setIsCodeValid(res);

    if (res) {
      toast.success(t1("codeVerifiedSuccess"));
      nextStep();
    } else {
      toast.error(t1("codeInvalid"));
    }

    return res;
  };

  const handleSendCode = async () => {
    setIsSending(true);

    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const contactEmail = watch("contactEmail");
      const contactPerson = watch("contactPerson");

      localStorage.setItem("confirmationCode", code);

      const sendResult = await sendVerificationCodeEmail({
        userName: contactPerson,
        userEmail: contactEmail,
        code: code,
        locale: locale,
      });

      if (!sendResult.success) {
        throw new Error(sendResult.error || "Failed to send confirmation email.");
      }

      setSendSuccess(true);
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
    }
    setIsSending(false);
  }

  useEffect(() => {
    if (formStep == 1) {
      handleSendCode();
    }
  }, [formStep]);

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
          {t("joinNetwork") || "Join Our Partner Network"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-gray-600 mb-8 text-center max-w-2xl mx-auto"
        >
          {t("contactWithinDays") ||
            "Complete this form to join our network of service providers. Our team will contact you within 2 business days."}
        </motion.p>

        <ProgressBar step={formStep} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          <AnimatePresence mode="wait">
            {formStep === 0 && (
              <CompanyDetailsStep
                register={register}
                onPrev={previousStep}
                errors={errors}
                onNext={nextStep}
                isNextDisabled={!section1Valid}
              />
            )}

            {formStep === 1 && (
              <EmailVerificationStep
                register={register}
                onPrev={previousStep}
                errors={errors}
                onNext={nextStep}
                isNextDisabled={!section4Valid}
                handleSendCode={handleSendCode}
                verifyCode={verifyCode}
                isSending={isSending}
                sendSuccess={sendSuccess}
                watch={watch}
                isCodeValid={isCodeValid}
              />
            )}

            {formStep === 2 && (
              <CoverageAndServicesStep
                register={register}
                control={control}
                errors={errors}
                onNext={nextStep}
                onPrev={previousStep}
                isNextDisabled={!section2Valid}
                selectedCities={selectedCities}
                setSelectedCities={setSelectedCities}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            )}

            {formStep === 3 && (
              <FinalStep
                errors={errors}
                register={register}
                onPrev={previousStep}
                formValues={formValues}
                selectedCities={selectedCities}
                selectedServices={selectedServices}
                setValue={setValue}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
              />
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuccessPopup && <SuccessPopup2 onClose={closeSuccessPopup} />}
      </AnimatePresence>
    </div>
  );
};

export default PartnerForm;
