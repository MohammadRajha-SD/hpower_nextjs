"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

const FirstSection = () => {
  const t = useTranslations("FirstSection");
  const locale = useLocale();

  // Set the correct download link based on locale
  const downloadLink = `/ProfileHPower.pdf`;

  return (
    <section className="flex flex-col items-center py-10 gap-8 max-w-6xl mx-auto px-4 lg:px-0">
      {/* Section Title */}
      <h1 className="text-mobile_header lg:text-header text-center text-interactive_color">
        {t("title")}
      </h1>

      {/* Download Button */}
      <div>
        <a
          href={downloadLink}
          download
          className="flex items-center text-description_lg gap-2 px-4 py-2 rounded-lg bg-interactive_color text-white font-semibold hover:bg-active_color transition duration-300"
        >
          {t("download")}
          <Download />
        </a>
      </div>

      {/* Logo */}
      <Link href="/">
        <Image
          src={"/new-logo.png"}
          width={200}
          height={40}
          alt="HPOWER"
          className="h-auto"
        />
      </Link>

      {/* Description Text */}
      <div className="text-description_sm lg:text-description_lg text-center text-gray-700 text-lg leading-relaxed">
        <p>{t("description")}</p>
      </div>
    </section>
  );
};

export default FirstSection;
