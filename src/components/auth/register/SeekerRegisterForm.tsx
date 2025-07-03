"use client";

import React, { useRef, useState } from "react";
import { FaLock, FaEyeSlash, FaEye, FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ArrowBigLeftIcon,
  ArrowBigRight,
  Mail,
  PhoneIcon,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { userRegister } from "@/actions/auth";

// 
interface FormData {
  name: string;
  username: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
  language: string;
}

const SeekerRegisterForm = ({
  header,
  description,
}: {
  header: string;
  description: string;
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("RegisterForm");

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    language: locale,
  });

  const handleCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);

    if (errors.recaptcha) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.recaptcha;
        return newErrors;
      });
    }
  };

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Check password matching when confirm_password field is changed
    if (name === "confirm_password" || name === "password") {
      const passwordValue = name === "password" ? value : formData.password;
      const confirmValue =
        name === "confirm_password" ? value : formData.confirm_password;

      if (confirmValue && passwordValue !== confirmValue) {
        setErrors((prev) => ({
          ...prev,
          confirm_password: [t("passwords_do_not_match")],
        }));
      } else if (confirmValue) {
        // Clear confirm_password error if passwords match
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirm_password;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = [t("name_required")];
    }

    if (!formData.username.trim()) {
      newErrors.username = [t("username_required")];
    }

    if (!formData.email.trim()) {
      newErrors.email = [t("email_required")];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = [t("email_invalid")];
    }

    // Phone Number validation with optional country code +971
    const phone = formData.phone_number.trim();
    const countryCode = "+971";
    const validPrefixes = ["50", "54", "56", "52", "55", "58"];

    if (!phone) {
      newErrors.phone_number = [t("error.phone_required")];
    } else {
      let localNumber = phone;

      // If starts with country code, remove it
      if (phone.startsWith(countryCode)) {
        localNumber = phone.slice(countryCode.length);
      }

      // Remove any leading zeros if present after country code
      if (localNumber.startsWith("0")) {
        localNumber = localNumber.slice(1);
      }

      const prefix = localNumber.slice(0, 2);
      const remainingDigits = localNumber.slice(2);

      // Check prefix
      if (!validPrefixes.includes(prefix)) {
        newErrors.phone_number = [t("error.phone_invalid_prefix")];
      }
      // Check total digits count (should be exactly 9 digits local number)
      else if (localNumber.length !== 9) {
        newErrors.phone_number = [t("error.phone_invalid_digits")];
      }
      // Also ensure phone number length makes sense with or without country code
      else if (phone.length !== localNumber.length && phone.length !== localNumber.length + countryCode.length) {
        newErrors.phone_number = [t("error.phone_invalid")];
      }
    }

    if (!formData.password) {
      newErrors.password = [t("password_required")];
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = [t("confirm_password_required")];
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = [t("passwords_do_not_match")];
    }

    return newErrors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form first
    const validationErrors = validateForm();

    // Check if reCAPTCHA was completed
    if (!recaptchaToken) {
      validationErrors.recaptcha = [t("captcha_required")];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Map form fields to API expected format
      const apiFormData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirm_password,
        phone_number: formData.phone_number,
        language: formData.language,
      };

      const result = await userRegister(apiFormData, locale);

      if (result.success) {
        setSubmitSuccess(true);
        // Redirect or show success message
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      setErrors({ general: [t("unexpected_error")] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="overflow-y-visible pt-20 px-4">
      <div className="relative bg-gradient-to-r from-white via-[#ffefe8] to-white text-gray-500 rounded-3xl shadow-xl w-full max-w-6xl z-50">
        <div className="md:flex w-full">
          {/* Left side with illustration */}
          <div className="hidden md:flex flex-col justify-around md:w-2/5 bg-active_color items-center py-10 px-10 rounded-s-xl">
            <div className="flex flex-col items-center justify-center gap-5">
              <h1 className="text-mobile_header lg:text-header text-interactive_color">
                {header}
              </h1>
              <p className="text-gray-700 text-description_sm lg:text-description_lg">
                {description}
              </p>
            </div>
            <Image
              src={"/register.png"}
              width={600}
              height={700}
              alt={t("register_illustration_alt")}
            />
          </div>

          {/* Right side with form */}
          <div className="w-full md:w-3/5 py-4 px-5 md:px-10">
            <div className="text-center text-xl sm:text-2xl font-medium text-gray-800 uppercase">
              <div className="flex flex-col items-center justify-center gap-5">
                <Link href="/">
                  <Image
                    src={"/new-logo.png"}
                    width={250}
                    height={50}
                    alt={t("logo_alt")}
                    className="h-auto"
                  />
                </Link>
              </div>
            </div>

            {submitSuccess ? (
              <div className="text-center mt-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl text-green-600 font-medium mb-3">
                  {t("registration_successful")}
                </h3>
                <p className="mb-4">{t("account_created_successfully")}</p>
                <Link href="/sign-in">
                  <button className="text-white bg-interactive_color hover:bg-active_color rounded-xl py-2 px-6 text-sm sm:text-base transition">
                    {t("login_to_account")}
                  </button>
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 mt-5"
              >
                {errors.general && (
                  <div className="bg-red-50 p-3 rounded-lg mb-3">
                    <p className="text-red-500 text-sm">{errors.general[0]}</p>
                  </div>
                )}

                {/* Fullname Input */}
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="name"
                    className="mb-1 text-xs sm:text-sm text-gray-600"
                  >
                    {t("full_name")}:
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${errors.name ? "border-red-500" : "border-gray-400"
                        } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                      placeholder={t("enter_full_name")}
                      required
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Username Input */}
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="username"
                    className="mb-1 text-xs sm:text-sm text-gray-600"
                  >
                    {t("username")}:
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaUserAlt size={16} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${errors.username ? "border-red-500" : "border-gray-400"
                        } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                      placeholder={t("enter_username")}
                      required
                      dir="ltr"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username[0]}
                    </p>
                  )}
                </div>


                {/* PHONe */}
                <div className="flex gap-2 w-full flex-col md:flex-row">
                  {/* Phone Input */}
                  <div className="flex flex-col w-full md:w-1/2">
                    <label
                      htmlFor="phone_number"
                      className="mb-1 text-xs sm:text-sm text-gray-600"
                    >
                      {t("phone_number")}:
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <PhoneIcon size={18} />
                      </div>
                      <input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${errors.phone_number
                          ? "border-red-500"
                          : "border-gray-400"
                          } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                        placeholder={t("enter_phone_number")}
                        required
                        dir="ltr"
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone_number[0]}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col w-full md:w-1/2">
                    <label
                      htmlFor="email"
                      className="mb-1 text-xs sm:text-sm text-gray-600"
                    >
                      {t("email")}:
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${errors.email ? "border-red-500" : "border-gray-400"
                          } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                        placeholder={t("enter_email")}
                        required
                        dir="ltr"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full flex-col md:flex-row">
                  {/* Password Input */}
                  <div className="flex flex-col w-full md:w-1/2">
                    <label
                      htmlFor="password"
                      className="mb-1 text-xs sm:text-sm text-gray-600"
                    >
                      {t("password")}:
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="h-4 w-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-3 text-sm sm:text-base rounded-lg border ${errors.password ? "border-red-500" : "border-gray-400"
                          } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                        placeholder="**********"
                        required
                        dir="ltr"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password[0]}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex flex-col w-full md:w-1/2">
                    <label
                      htmlFor="confirm_password"
                      className="mb-1 text-xs sm:text-sm text-gray-600"
                    >
                      {t("confirm_password")}:
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="h-4 w-4" />
                      </div>
                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-3 text-sm sm:text-base rounded-lg border ${errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-400"
                          } placeholder-gray-500 focus:outline-none focus:border-active_color`}
                        placeholder="**********"
                        required
                        dir="ltr"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirm_password[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="my-3">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6Lf-N3QrAAAAADCbD2tKhah1FZWwYUoq0pOdymcS"
                    onChange={handleCaptchaChange}
                  />
                  {errors.recaptcha && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.recaptcha[0]}
                    </p>
                  )}
                </div>
                {/* Forgot Password Link */}
                <div className="text-right text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-interactive_color hover:text-active_color"
                  >
                    {t("forgot_password")}
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="w-full bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out p-1 border border-interactive_color">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 text-white bg-interactive_color text-sm sm:text-base lg:text-xs xxl:text-sm rounded-full px-4 py-2 font-medium hover:bg-active_color transition duration-150 ease-in"
                  >
                    <span className="mr-2 uppercase">
                      {isSubmitting
                        ? t("creating_account")
                        : t("create_account")}
                    </span>
                    <ArrowBigLeftIcon
                      className={`${!isRTL ? "hidden" : "block"}`}
                    />
                    <ArrowBigRight
                      className={`${isRTL ? "hidden" : "block"}`}
                    />
                  </button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center mt-6">
              <div className="flex flex-col text-interactive_color hover:text-active_color text-description_sm lg:text-description_lg justify-center items-center">
                <span className="ml-2 flex gap-2">
                  {t("have_account")}
                  <Link href="/sign-in" className="text-active_color font-bold">
                    <p>{t("login")}</p>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerRegisterForm;
