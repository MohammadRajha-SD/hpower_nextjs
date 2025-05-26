"use client";

import CustomButton from "@/components/ui/CustomButton";
import { useTranslations } from "next-intl";
import Image from "next/image";

const NotFound = ({
  buttonHref = "/",
  buttonLabel,
  description,
  description2,
}: {
  buttonHref?: string;
  buttonLabel?: string;
  description?: string;
  description2?: string;
}) => {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-100 px-4">
      {/*================ Background Overlay =================*/}
      <div className="absolute inset-0 flex justify-center items-center text-center pointer-events-none">
        <h1 className="text-[60vw] md:text-[30vw] font-extrabold text-active_color absolute top-1/2 -translate-y-1/2 select-none opacity-25">
          404
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Logo */}
        <div className="my-28 relative">
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

        {/* Divider */}
        <div className="w-24 h-1 bg-interactive_color rounded-full mb-6"></div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-mobile_header lg:text-header text-interactive_color">
            {t("title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {description || t("description")}
          </p>
          <p className="text-base md:text-lg text-gray-500">
            {description2 || t("description2")}
          </p>
        </div>

        {/* Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <CustomButton children={t("home_button")} actionLink="/" />
          <CustomButton
            children={t("contact_button")}
            actionLink="/contact-us"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
