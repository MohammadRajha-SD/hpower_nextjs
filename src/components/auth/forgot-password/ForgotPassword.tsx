"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowBigLeftIcon, ArrowBigRight } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";

interface FormData {
    email: string;
}

const ForgotPassword = () => {
    const locale = useLocale();
    const router = useRouter();
    const isRTL = locale === "ar";
    const t = useTranslations("ForgotPassword");

    const [formData, setFormData] = useState<FormData>({ email: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ email: e.target.value });
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Send request to reset password API
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/user/forgot-password`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": locale,
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || t("error_occurred"));
            } else {
                setSuccessMessage(t("reset_link_sent"));
                setFormData({ email: "" });
            }
        } catch (err) {
            console.error(err);
            setError(t("error_occurred"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="relative bg-gradient-to-r from-white via-[#ffefe8] to-white text-gray-500 rounded-3xl shadow-xl w-full max-w-6xl overflow-hidden z-10 mx-auto">
                <div className="md:flex w-full">
                    {/* Left Side Illustration */}
                    <div className="hidden md:flex md:w-2/5 bg-active_color justify-center items-center py-10 px-10 rounded-e-xl">
                        <Image
                            src="/login.png"
                            width={600}
                            height={700}
                            alt={t("forgot_password_illustration")}
                        />
                    </div>

                    {/* Form Side */}
                    <div className="w-full md:w-3/5 py-4 px-5 md:px-10">
                        <div className="text-center text-xl sm:text-2xl font-medium text-gray-800 uppercase">
                            <Link href="/" className="flex flex-col items-center gap-2">
                                <Image
                                    src="/new-logo.png"
                                    width={250}
                                    height={50}
                                    alt="HPOWER"
                                />
                            </Link>
                        </div>

                        {/* Feedback Messages */}
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
                            {/* Email Input */}
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

                            {/* Submit Button */}
                            <div className="w-full bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out p-1 border border-interactive_color">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 text-white bg-interactive_color text-sm sm:text-base lg:text-xs xxl:text-sm rounded-full px-4 py-2 font-medium hover:bg-active_color transition duration-150 ease-in"
                                    disabled={isLoading}
                                >
                                    <span className="mr-2 uppercase">
                                        {isLoading ? t("sending") : t("send_reset_link")}
                                    </span>
                                    {isRTL ? <ArrowBigLeftIcon /> : <ArrowBigRight />}
                                </button>
                            </div>
                        </form>

                        {/* Back to login */}
                        <div className="text-center mt-6">
                            <Link
                                href="/sign-in"
                                className="text-interactive_color hover:text-active_color text-sm"
                            >
                                {t("back_to_login")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
