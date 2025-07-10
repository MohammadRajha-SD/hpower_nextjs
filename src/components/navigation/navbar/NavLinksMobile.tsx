"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

const NavLinks = ({ className = "", onClick }: NavLinksProps) => {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const { categories: cats } = useCategories();

  const parentCategories = cats?.data?.filter((cat: any) => !cat.has_parent) || [];

  const mainCategories =
    parentCategories.map((parent) => ({
      ...parent,
      subcategories: parent.children || [],
    })) || [];

  const [servicesOpen, setServicesOpen] = useState(false);
  const [openMainCategory, setOpenMainCategory] = useState<string | null>(null);

  const links = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services"), dropdown: true },
    { href: "/about-us", label: t("about_us") },
    { href: "/contact-us", label: t("contact-us") },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return (
      pathname === `/${locale}${href}` ||
      pathname.startsWith(`/${locale}${href}/`)
    );
  };

  return (
    <div className={`relative ${className}`}>
      {links.map((link) => {
        if (link.dropdown) {
          return (
            <div key={link.href}>
              {/* Button shown on mobile only */}
              <button
                onClick={() => {
                  setServicesOpen(!servicesOpen);
                  setOpenMainCategory(null);
                }}
                className={`w-full flex justify-between items-center text-left font-medium px-4 py-2 lg:hidden ${isActive(link.href)
                  ? "text-active_color font-bold"
                  : "text-interactive_color"
                  }`}
              >
                <span>{link.label}</span>
                {servicesOpen ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </button>

              {/* Dropdown container visible only on mobile */}
              {servicesOpen && (
                <div className="max-h-[500px] overflow-y-auto transition-all duration-300 ease-in-out pt-1 lg:hidden">
                  <div className="border-t border-gray-200 px-4 py-2">
                    <a
                      href="/services"
                      className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-700"
                    >
                      {t("all")}
                    </a>
                  </div>
                  {mainCategories.map((category) => {
                    const isOpen = openMainCategory === category.id;

                    return (
                      <div key={category.id} className="border-t border-gray-200 px-4 py-2">
                        <button
                          onClick={() =>
                            setOpenMainCategory((prev) =>
                              prev === category.id ? null : category.id
                            )
                          }
                          className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-700"
                        >
                          <span>{category.name}</span>
                          {isOpen ? (
                            <ChevronUp size={16} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400" />
                          )}
                        </button>

                        {isOpen && category.subcategories.length > 0 && (
                          <div className="pl-4 ml-1 border-l border-gray-200 mt-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/${locale}/services?category=${category.id}&subcategory=${sub.id}`}
                                className="block text-sm text-gray-600 py-1 hover:underline"
                                onClick={onClick}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Normal links shown on desktop and mobile
        return (
          <Link
            key={link.href}
            href={`/${locale}${link.href}`}
            className={`block font-medium px-4 py-2 transition duration-300 ease-in-out ${isActive(link.href)
              ? "text-active_color font-bold border-b-2 border-active_color"
              : "text-interactive_color hover:text-active_color"
              } ${link.dropdown ? "hidden md:block" : ""}`} // hide dropdown link on desktop if needed
            onClick={onClick}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
