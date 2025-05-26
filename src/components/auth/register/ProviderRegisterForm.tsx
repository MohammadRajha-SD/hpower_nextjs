import React, { useState } from "react";
import { FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import Image from "next/image";
import {
  ArrowBigLeftIcon,
  ArrowBigRight,
  Mail,
  PhoneIcon,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import SelectInput from "../SelectInput";
import { providerRegister } from "@/actions/auth";
import { ApiFormData, FormData, RegisterResponse } from "@/lib/types";
import { useCategories } from "@/hooks/useCategories";

const ProviderRegisterForm = ({
  header,
  description,
}: {
  header: string;
  description: string;
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { categories } = useCategories();
  const t = useTranslations("ProviderRegister");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    language: locale,
    provider_type_id: 1,
    category_id: 1,
  });

  const [showPassword, setShowPassword] = useState(false);
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
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Map form fields to API expected format
      const apiFormData: ApiFormData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        language: formData.language,
        category_id: formData.category_id,
        provider_type_id: formData.provider_type_id,
      };

      const result: RegisterResponse = await providerRegister(apiFormData);

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

  return (
    <div className="min-h-screen pt-20 px-4">
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
                <p className="mb-4">
                  {t("provider_account_created_successfully")}
                </p>
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

                <div className="flex gap-2 w-full flex-col md:flex-row">
                  {/* Fullname Input */}
                  <div className="flex flex-col w-full md:w-1/2">
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
                        className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${
                          errors.name ? "border-red-500" : "border-gray-400"
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
                        className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${
                          errors.phone_number
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
                </div>

                {/* Email Input */}
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="email"
                    className="mb-1 text-xs sm:text-sm text-gray-600"
                  >
                    {t("email")}
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
                      className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-400"
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

                {/* Password Input */}
                <div className="flex flex-col w-full">
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
                      className={`w-full pl-10 pr-10 py-3 text-sm sm:text-base rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-400"
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

                {/* Category Selection */}
                <div className="flex flex-col w-full">
                  <SelectInput
                    options={categories}
                    defaultValue=""
                    label={t("select_category")}
                    onChange={handleCategoryChange}
                  />
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
                        : t("create_provider_account")}
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

export default ProviderRegisterForm;
