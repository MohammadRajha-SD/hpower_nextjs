"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import CustomButton from "@/components/ui/CustomButton";
import Cookies from "js-cookie";
import useUserDetails from "@/hooks/useUserDetails";
import { useRouter } from "next/navigation";

const AccessDenied = () => {
  const t = useTranslations("accessDenied");
  const { setUser } = useUserDetails();
  const router = useRouter();

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const pulseVariants: any = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const iconAnimation = {
    hidden: { rotate: -90, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };
  const handleLogout = (route: string) => {
    Cookies.remove("userData");
    Cookies.remove("authToken");
    setUser(null);
    setTimeout(() => {
      router.push(route);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Top Color Bar */}
        <div className="h-2 bg-interactive_color"></div>

        <div className="p-8 flex flex-col items-center">
          {/* Icon */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={iconAnimation}
            className="mb-6"
          >
            <motion.div
              animate="pulse"
              variants={pulseVariants}
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center"
            >
              <Lock className="w-12 h-12 text-interactive_color" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-4 text-center"
          >
            {t("title")}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-center mb-8 max-w-md"
          >
            {t("description")}
          </motion.p>

          {/* Alert Box */}
          <motion.div
            variants={itemVariants}
            className="bg-amber-50 border-l-4 border-active_color p-4 mb-8 w-full"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-6 w-6 text-active_color mt-0.5 mr-3" />
              <p className="text-sm text-amber-700">
                {t("providerOnlyMessage")}
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full"
          >
            <CustomButton children={t("backToHome")} />
            <div className="hidden">
              <CustomButton
                handleClick={() => handleLogout("/provider-register")}
                children={t("becomeProvider")}
              />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="px-8 py-4 bg-gray-50 text-center text-sm text-gray-500"
        >
          <Link
            href="/contact-us"
            className="text-interactive_color font-bold hover:underline"
          >
            {t("supportMessage")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
