"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Error({
  buttonHref = "/",
  buttonLabel,
  description,
  description2,
}) {
  const t = useTranslations("ErrorPage");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6 },
    },
  };

  return (
    <div className="flex flex-col items-center pt-10 gap-10 min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <motion.div
        className="relative z-10 text-center max-w-7xl w-full px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Code Background */}
        <motion.div
          className="absolute inset-0 flex justify-center items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-[30vw] md:text-[15vw] font-extrabold text-red-300 select-none">
            500
          </h1>
        </motion.div>

        {/* Logo/Image */}
        <div className="flex justify-center items-center relative my-20">
          <Image
            src={"/new-logo.png"}
            width={150}
            height={150}
            alt="Company Logo"
            quality={100}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Content */}
        <div className="text-center text-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-red-600">
            {t("title")}
          </h2>
          <p className="text-lg md:text-xl mb-4">
            {description || t("description")}
          </p>
          <p className="text-md md:text-lg text-gray-600 mb-10">
            {description2 || t("sub_description")}
          </p>

          {/* Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex justify-center"
          >
            <Link
              href={buttonHref}
              className="inline-flex items-center px-6 py-3 bg-interactive_color text-white rounded-lg hover:bg-active_color transition duration-300 shadow-md hover:shadow-lg"
              aria-label={t("go_home_label", {
                label: buttonLabel || t("goHome"),
              })}
            >
              {buttonLabel || t("goHome")}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
