"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle, Mail, ArrowRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

const SubscriptionSuccessPage = () => {
  const t = useTranslations("SubscriptionSuccessPage");

  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              {t("title")}
            </h1>

            <p className="mt-3 text-base text-gray-600">{t("thank_you")}</p>
          </div>

          <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 pt-0.5">
                <Mail className="h-6 w-6 text-interactive_color hover:text-active_color" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {t("check_email")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{t("email_sent")}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="">
              <div className="flex justify-center items-center">
                <Link
                  href="/"
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-interactive_color hover:bg-active_color text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="h-4 w-4" />
                  {t("return_home")}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>
                {t("questions")}{" "}
                <Link
                  href="/contact-us"
                  className="font-medium text-interactive_color hover:text-active_color"
                >
                  {t("customer_support")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;
