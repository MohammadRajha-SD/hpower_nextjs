"use client";

import ContactForm from "@/components/home/ContactForm";
import React from "react";
import { useTranslations } from "next-intl";

const ContactPage = () => {
  const t = useTranslations("ContactForm");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-32">
      <h1 className="text-interactive_color text-mobile_header lg:text-header mb-4 text-center">
        {t("title")}
      </h1>
      <ContactForm fromHome={false} />
    </div>
  );
};

export default ContactPage;
