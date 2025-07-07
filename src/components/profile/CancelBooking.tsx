"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { sendCancellationEmail } from "@/actions/canceBookingMail";
import Cookies from "js-cookie";

interface CancelBookingProps {
  serviceName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  providerEmail: string;
  providerName: string;
  providerPhone: string;
  status: string;
  bookingId: string,
  setShowSuccessPopup: (showSuccessPopup: boolean) => void;
}

const CancelBooking: React.FC<CancelBookingProps> = ({
  serviceName,
  userName,
  userEmail,
  userPhone,
  providerEmail,
  providerName,
  providerPhone,
  status,
  setShowSuccessPopup,
  bookingId,
}) => {
  const t = useTranslations("cancelBooking");
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  // Check if all required fields are filled
  const isFormValid =
    reason.trim() && serviceName && userEmail && providerEmail;

  const handleCancelBooking = async () => {
    if (status === 'paid') {
      if (!isFormValid) {
        toast.error(
          t("required_fields_error") || "Please fill all required fields"
        );
        return;
      }

      try {
        const response = await sendCancellationEmail({
          serviceName,
          userName,
          userEmail,
          userPhone,
          providerEmail,
          providerName,
          providerPhone,
          reason,
          locale: t.raw("locale") || "en",
        });

        if (response.success) {
          toast.success(
            t("toast_success") || "Cancellation email sent successfully",
            { duration: 4000 }
          );
          setOpen(false);
          setReason("");
        } else {
          toast.error(
            response.error || t("toast_error") || "Failed to cancel booking",
            { duration: 4000 }
          );
        }
        setShowSuccessPopup(true);
      } catch (error: any) {
        console.error("Error cancelling booking:", error);
        toast.error(
          error.message || t("toast_error") || "An unexpected error occurred",
          { duration: 4000 }
        );
      }
    } else {
      // send to backend to cancel it 
      try {
        const token = Cookies.get("authToken");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

        const response = await fetch(`${baseUrl}/booking/${bookingId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
          }),
        });

        if (!response.ok) {
          toast.error(t("toast_error") || "Failed to cancel booking", { duration: 4000 });
        }

        const result = await response.json();

        toast.success(
          t("toast_success") || "Cancellation email sent successfully",
          { duration: 4000 }
        );

        setOpen(false);
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error(
          error.message || t("toast_error") || "An unexpected error occurred",
          { duration: 4000 }
        );
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <motion.button
          className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <X className="h-4 w-4 mr-1" />
          {t("cancel_booking_button")}
        </motion.button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="text-xl font-bold text-gray-800"
            dir="auto"
          >
            {t("cancel_booking_title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600" dir="auto">
            {t("cancel_booking_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {status == 'paid' &&
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("service_name_label")}
              </label>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                readOnly
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("reason_label")}
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
                placeholder={t("reason_placeholder")}
                rows={4}
              />
            </div>
          </div>
        }

        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${isFormValid || status !== 'paid'
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={handleCancelBooking}
            disabled={!isFormValid && status === 'paid'}
          >
            {t("confirm_cancel")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBooking;
