"use client";
import React from "react";
import Link from "next/link";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import SocialLinks from "./SocialsLinks";
import { useServices } from "@/hooks/useServices";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface Service {
  id: string | number;
  name: string;
  name_ar: string;
}

// Dummy data for company sections with translatable titles and items
const com_data = (t: (key: string) => string) => [
  {
    title: t("quickLinks"),
    items: [
      { name: t("Common_Questions"), link: "/faqs" },
      { name: t("becomeAParter"), link: "/become-a-partner" },
      { name: t("Return_Policy"), link: "/return-policy" },
      { name: t("Privacy_Policy"), link: "/privacy-policy" },
      { name: t("Terms_and_Conditions"), link: "/terms" },
    ],
  },
];

const Footer = () => {
  const { services } = useServices();
  const featuredServices = services?.services?.slice(0, 4);
  const t = useTranslations("Footer");
  const locale = useLocale();
  const whatsappNumber = "971506164629";

  return (
    <>
      {/* Top Footer */}
      <div className="relative bg-gray-200 text-gray-100 px-4 xl:px-48 flex justify-center items-center">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full py-2">
          <p className="text-md text-center md:text-left text-interactive_color font-semibold hidden md:block">
            {t("Email")}
          </p>
          <div className="md:mt-0">
            <SocialLinks width="w-[120px]" sizeIcon={25} />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <footer className="bg-[#f5f5f5] text-gray-500 py-4">
        <div className="w-full px-4 xl:px-48">
          <div className="flex flex-col items-center justify-center w-full lg:flex-row lg:justify-evenly gap-10">
            {/* Links Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto">
              {/* Services Section */}
              <div className="w-full">
                <h2 className="text-md font-semibold text-gray-800 mb-4 max-md:text-center">
                  {t("products")}
                </h2>
                <ul className="flex flex-col gap-2 items-center md:items-start">
                  {featuredServices?.length > 0 &&
                    featuredServices?.map((item: Service) => (
                      <li
                        key={"footer_feateured_service_" + item.id}
                        className="group text-sm text-gray-500 hover:text-gray-900 transition-all duration-300 w-fit relative"
                      >
                        <Link
                          href={`/services/${item.id}`}
                          aria-label={`Visit ${item.name}`}
                          className="block px-1 py-0.5"
                        >
                          {locale == 'ar' ? (item?.name_ar ?? item.name) : item.name}
                        </Link>
                        <span className="block h-[1px] w-0 bg-gray-500 transition-all duration-300 group-hover:w-full group-hover:start-0 end-0 absolute -bottom-1" />
                      </li>
                    ))}
                </ul>
              </div>

              {/* Dynamic Sections */}
              {com_data(t).map((section, index) => (
                <div key={"com_data_section_" + index} className="w-full">
                  <h2 className="text-md font-semibold text-gray-800 mb-4 max-md:text-center">
                    {section.title}
                  </h2>
                  <ul className="flex flex-col gap-2 items-center md:items-start">
                    {section.items.map((item, idx) => (
                      <li
                        key={"section_items_" + idx}
                        className="group text-sm text-gray-500 hover:text-gray-900 cust-trans w-fit relative"
                      >
                        <Link
                          href={item.link}
                          aria-label={`Visit ${item.name}`}
                          className="block px-1 py-0.5"
                        >
                          {item.name}
                        </Link>
                        <span className="block h-[1px] w-0 bg-gray-500 cust-trans group-hover:w-full group-hover:start-0 end-0 absolute -bottom-1" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Links */}
              <div className="w-full">
                <h2 className="text-md font-semibold text-gray-800 mb-4 max-md:text-center">
                  {t("Contact_Us_Footer")}
                </h2>
                <div className="flex flex-col gap-2 items-center md:items-start">
                  <Link
                    href={`https://wa.me/${whatsappNumber}`} // WhatsApp link
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security for external links
                    aria-label="WhatsApp"
                    className="group flex items-center hover:text-green-500 gap-2"
                  >
                    <FaWhatsapp
                      size={15}
                      className="text-interactive_color hover:text-green-500"
                    />
                    <span dir="ltr" className="pt-1">
                      + 971 50 616 4629
                    </span>
                  </Link>
                  <Link
                    href="mailto:info@hpower.ae"
                    aria-label="Email us"
                    className="flex items-center text-sm gap-3 text-gray-500 hover:text-gray-800 px-1 py-0.5"
                  >
                    <FaEnvelope size={15} />
                    <span>info@hpower.ae</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Family Icons Section */}
      <div className="flex flex-col items-center gap-5 bg-[#ebebeb] px-6 xl:px-48 text-gray-800 py-4">
        <div className="flex justify-center items-center gap-4">
          <div>
            <Image
              quality={100}
              src={"/images/home/payment1.svg"}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div>
            <Image
              quality={100}
              src={"/images/home/payment2.svg"}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div>
            <Image
              quality={100}
              src={"/images/home/google-pay.svg"}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div>
            <Image
              quality={100}
              src={"/images/home/apple-pay.webp"}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div>
            <Image
              quality={100}
              src={"/images/home/logo-samsung.png"}
              alt=""
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-[#373737] text-gray-100 py-4 px-4 xl:px-48">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          <p className="text-md text-center md:text-left">
            <span>{t("All_Copyright")}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
