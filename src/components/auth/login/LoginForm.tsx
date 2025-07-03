"use client";

import React, { useState } from "react";
import { FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import Image from "next/image";
import { ArrowBigLeftIcon, ArrowBigRight, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { multiLogin } from "@/actions/auth";
import Cookies from "js-cookie";
import CustomButton from "@/components/ui/CustomButton";

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  // Initialize translation hooks
  const t = useTranslations("Login");

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await multiLogin(formData, locale);

      if (result.success && result.data) {
        const { token, user } = result.data;

        // Save token and user data in cookies
        Cookies.set("authToken", token, { expires: 7 }); // expires in 7 days
        Cookies.set("userData", JSON.stringify(user), { expires: 7 });
        router.push("/");
      } else {
        setError(
          result.message ||
            result.errors?.general?.join(", ") ||
            t("login_failed")
        );
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError(t("unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="relative bg-gradient-to-r from-white via-[#ffefe8] to-white text-gray-500 rounded-3xl shadow-xl w-full max-w-6xl overflow-hidden z-50">
        <div className="md:flex w-full">
          {/* ================ Illustration Side ================ */}
          <div className="hidden md:flex md:w-2/5 bg-active_color justify-center items-center py-10 px-10 rounded-e-xl">
            <Image
              src="/login.png"
              width={600}
              height={700}
              alt={t("login_illustration")}
            />
          </div>

          {/* ================ Form Side ================ */}
          <div className="w-full md:w-3/5 py-4 px-5 md:px-10">
            <div className="text-center text-xl sm:text-2xl font-medium text-gray-800 uppercase">
              <Link href="/" className="flex flex-col items-center gap-2">
                <Image
                  src={"/new-logo.png"}
                  width={250}
                  height={50}
                  alt="HPOWER"
                />
              </Link>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              {/* ================ Email Input ================ */}
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="mb-1 text-xs sm:text-sm text-gray-600"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border border-gray-400 placeholder-gray-500 focus:outline-none focus:border-active_color"
                    placeholder={t("email_placeholder")}
                    required
                    dir={isRTL ? "ltr" : "auto"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* ================ Password Input ================ */}
              <div className="flex flex-col w-full">
                <label
                  htmlFor="password"
                  className="mb-1 text-xs sm:text-sm text-gray-600"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 text-sm sm:text-base rounded-lg border border-gray-400 placeholder-gray-500 focus:outline-none focus:border-active_color"
                    placeholder={t("password_placeholder")}
                    required
                    dir={isRTL ? "ltr" : "auto"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? t("hide_password") : t("show_password")
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ================ Forgot Password ================ */}
              <div className="text-right text-sm">
                <a
                  href="/forgot-password"
                  className="text-interactive_color hover:text-active_color"
                >
                  {t("forgot_password")}
                </a>
              </div>

              {/* ================ Submit Button ================ */}
              <div className="w-full bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out p-1 border border-interactive_color">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 text-white bg-interactive_color text-sm sm:text-base lg:text-xs xxl:text-sm rounded-full px-4 py-2 font-medium hover:bg-active_color transition duration-150 ease-in"
                  disabled={isLoading}
                >
                  <span className="mr-2 uppercase">
                    {isLoading ? t("logging_in") : t("login")}
                  </span>
                  {isRTL ? <ArrowBigLeftIcon /> : <ArrowBigRight />}
                </button>
              </div>
            </form>

            {/* ================ Register Links ================ */}
            <div className="text-center mt-6">
              <div className="flex flex-col text-interactive_color hover:text-active_color text-description_sm lg:text-description_lg items-center">
                <span>{t("no_account")}</span>
                <div className="flex justify-center gap-10 mt-2 font-normal">
                  {/* <CustomButton
                    children={t("provider")}
                    actionLink="/provider-register"
                  /> */}
                  <CustomButton
                    children={t("seeker")}
                    actionLink="/seeker-register"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
