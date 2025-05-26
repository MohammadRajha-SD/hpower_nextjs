"use client";
import { usePlans } from "@/hooks/usePlans";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Check, CheckCircle, Loader } from "lucide-react";
import useUserDetails from "@/hooks/useUserDetails";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { FiMail, FiPhone } from "react-icons/fi";
import { formatCurrency, getFeaturesFromDescription } from "@/utils/helper";
import Cookies from "js-cookie";
import parse from "html-react-parser";

interface Plan {
  id: string;
  text: string;
  short_description: string;
  description: string;
  price: number;
  number_of_months: number;
  type: string;
}

const SubscriptionConfirmation = ({ id }: { id: string }) => {
  const translate = useTranslations("SubscriptionConfirmation");
  const { user } = useUserDetails();
  const { plans } = usePlans();
  const locale = useLocale();
  const packages = plans?.data as Plan[];
  const selectedPlan = packages?.find(
    (p: Plan) => p.id.toString() === id.toString()
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const getAuthToken = () => Cookies.get("authToken") || "";

  // Check if the user is already subscribed to this plan
  const isAlreadySubscribed = user?.subscriptions?.some(
    (subscription: { pack_id: string }) =>
      subscription.pack_id === selectedPlan?.id
  );

  const handleConfirmSubscription = async () => {
    if (isAlreadySubscribed) {
      toast.error(translate("already_subscribed"), {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/new-subscription?lang=${locale}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            pack_id: selectedPlan?.id,
            provider_id: user?.id,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {translate("subscription_confirmed")}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {data.message ||
                        translate("subscription_success_message")}{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {translate("close")}
                </button>
              </div>
            </div>
          ),
          { duration: 5000 }
        );
        router.push(`/subscription/${id}/success`);
      } else {
        throw new Error(data.message || "Failed to create subscription");
      }
    } catch (error) {
      toast.error(error.message, {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const SubscriptionSuccess = () => {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg lg:max-w-xl">
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {translate("subscription_confirmed_title")}
            </h2>

            <p className="text-gray-600 mb-6">
              {translate("subscription_confirmed_description")}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-start mb-4">
                <FiMail className="mt-1 mr-3 text-interactive_color" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {translate("check_email")}
                  </h3>
                  <p className="text-sm text-gray-900 mt-1">
                    {translate("email_confirmation_message")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">{translate("email")}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <p className="text-xs text-gray-500">{translate("phone")}</p>
                  <p className="text-sm font-medium text-gray-900" dir="ltr">
                    {user?.phone_number || "XXX-XXX-XXXX"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 bg-interactive_color text-white rounded-md font-medium hover:bg-active_color transition-colors md:w-auto"
            >
              {translate("back_to_home")}
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              {translate("support_message")}{" "}
              <a href="#" className="text-interactive_color font-medium">
                {translate("customer_support")}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900">
            {translate("plan_not_found")}
          </h2>
          <p className="mt-2 text-gray-600">
            {translate("plan_not_found_description")}
          </p>
          <button
            onClick={() => router.push("/subscription")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-interactive_color hover:bg-active_color focus:outline-none md:w-auto"
          >
            {translate("back_to_plans")}
          </button>
        </div>
      </div>
    );
  }

  if (
    typeof window !== "undefined" &&
    window.location.pathname.includes("/success")
  ) {
    return <SubscriptionSuccess />;
  }

  return (
    <div className="min-h-[60vh] py-4 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-interactive_color font-bold">
            {translate("complete_subscription")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {translate("review_plan")}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          {/* Plan Header */}
          <div className="bg-gradient-to-r from-interactive_color to-active_color px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {selectedPlan?.text}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {selectedPlan?.short_description}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center">
                <p className="text-xs sm:text-sm md:text-base font-bold text-white">
                  {formatCurrency(selectedPlan?.price, locale,16)}
                </p>
                <p className="text-purple-100 text-xs sm:text-sm md:text-base ml-1">
                  / {selectedPlan?.number_of_months} {translate("months")}
                </p>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              {translate("your_information")}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex gap-2 items-center">
                <FiMail className="mr-2 text-gray-400" size={18} />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {translate("email_address")}
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {user?.email || translate("not_available")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <FiPhone className="text-gray-400" size={18} />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {translate("phone_number")}
                  </p>
                  <p className="text-sm sm:text-base font-medium" dir="ltr">
                    {user?.phone_number || translate("not_available")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 gap-6">
            {/* Plan Features Section */}
            <div className="mb-4 sm:mb-6" >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {translate("plan_features")}
              </h3>
              <div className="space-y-2" dir="ltr">
                <ul className="list-none space-y-2">
                  {getFeaturesFromDescription(selectedPlan?.description)?.map(
                    (feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center py-1 ${
                          locale === "ar"
                            ? "flex-row-reverse text-right"
                            : "flex-row text-left"
                        }`}
                      >
                        <div className="rounded-full p-1 bg-green-100">
                          <svg
                            className="w-4 h-4 text-green-700"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base ml-2 mr-2">
                          {feature}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            {/* Subscription Summary Section */}
            <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-5">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
                {translate("subscription_summary")}
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between py-1">
                  <dt className="text-sm sm:text-base text-gray-600">
                    {translate("plan_type")}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-gray-900">
                    {selectedPlan?.type}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-sm sm:text-base text-gray-600">
                    {translate("billing_cycle")}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-gray-900">
                    {translate("billing_cycle_value", {
                      months: selectedPlan?.number_of_months,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-sm sm:text-base text-gray-600">
                    {translate("plan_price")}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-gray-900">
                    {formatCurrency(selectedPlan?.price, locale,16)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 bg-gray-50 px-4 py-3 border-t border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <dt className="text-base sm:text-lg font-medium text-gray-900">
                    {translate("total_due_today")}
                  </dt>
                  <dd className="text-lg sm:text-xl font-bold text-interactive_color">
                    {formatCurrency(selectedPlan?.price, locale,16)}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:justify-between gap-3">
            <Link
              href={`/become-a-partner`}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-full sm:w-auto"
            >
              {translate("back_to_plans")}
            </Link>
            <button
              onClick={handleConfirmSubscription}
              disabled={isSubmitting || isAlreadySubscribed}
              className={`inline-flex justify-center gap-2 items-center px-4 py-2 sm:px-6 sm:py-2 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
                isAlreadySubscribed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-interactive_color hover:bg-active_color"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin mr-2 h-4 w-4" />
                  {translate("processing")}
                </>
              ) : isAlreadySubscribed ? (
                <>
                  <Check className="h-4 w-4" />
                  {translate("already_subscribed")}
                </>
              ) : (
                translate("confirm_subscribe")
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          {translate("terms_agreement")}{" "}
          <Link
            href="terms"
            className="font-medium text-interactive_color hover:underline"
          >
            {translate("terms_of_service")}
          </Link>{" "}
          {translate("and")}{" "}
          <Link
            href="privacy-policy"
            className="font-medium text-interactive_color hover:underline"
          >
            {translate("privacy_policy")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmation;
