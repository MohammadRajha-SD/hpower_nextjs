"use client";

import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigLeftIcon, ArrowBigRight } from "lucide-react";

interface ResetPasswordProps {
    token: string;
    email: string;
}

const ResetPassword = ({ token, email }: ResetPasswordProps) => {
    const t = useTranslations("ResetPassword");
    const locale = useLocale();
    const router = useRouter();
    const isRTL = locale === "ar";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError(t("passwords_mismatch"));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": locale,
                },
                body: JSON.stringify({ email, token, password, password_confirmation: confirmPassword, }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || t("error_occurred"));
            } else {
                setSuccessMessage(t("password_reset_success"));
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => router.push("/sign-in"), 2000);
            }
        } catch (err) {
            setError(t("error_occurred"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="relative bg-gradient-to-r from-white via-[#ffefe8] to-white text-gray-500 rounded-3xl shadow-xl w-full max-w-6xl mx-auto overflow-hidden z-50">
                <div className="md:flex w-full">
                    {/* Left Side Illustration */}
                    <div className="hidden md:flex md:w-2/5 bg-active_color justify-center items-center py-10 px-10 rounded-e-xl">
                        <Image src="/login.png" width={600} height={700} alt={t("illustration_alt")} />
                    </div>

                    {/* Right Side Form */}
                    <div className="w-full md:w-3/5 py-4 px-5 md:px-10">
                        <div className="text-center text-xl sm:text-2xl font-medium text-gray-800 uppercase">
                            <Link href="/" className="flex flex-col items-center gap-2">
                                <Image src="/new-logo.png" width={250} height={50} alt="HPOWER" />
                            </Link>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                            {/* Password */}
                            <div className="flex flex-col w-full">
                                <label className="mb-1 text-xs sm:text-sm text-gray-600">{t("new_password")}</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 text-sm rounded-lg border border-gray-400 focus:outline-none focus:border-active_color"
                                        placeholder={t("password_placeholder")}
                                        required
                                        dir={isRTL ? "ltr" : "auto"}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={t("toggle_password")}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col w-full">
                                <label className="mb-1 text-xs sm:text-sm text-gray-600">{t("confirm_password")}</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 text-sm rounded-lg border border-gray-400 focus:outline-none focus:border-active_color"
                                        placeholder={t("confirm_password_placeholder")}
                                        required
                                        dir={isRTL ? "ltr" : "auto"}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="w-full bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 p-1 border border-interactive_color">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 text-white bg-interactive_color rounded-full px-4 py-2 font-medium hover:bg-active_color"
                                    disabled={isLoading}
                                >
                                    <span className="mr-2 uppercase">
                                        {isLoading ? t("submitting") : t("reset_password")}
                                    </span>
                                    {isRTL ? <ArrowBigLeftIcon /> : <ArrowBigRight />}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6">
                            <Link href="/sign-in" className="text-interactive_color hover:text-active_color text-sm">
                                {t("back_to_login")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
