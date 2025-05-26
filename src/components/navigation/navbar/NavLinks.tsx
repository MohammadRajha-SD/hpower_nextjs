"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

const NavLinks = ({ className = "", onClick }: NavLinksProps) => {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const links = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
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
    <div className={className}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={`/${locale}${link.href}`}
          className={`font-medium lg:text-xs xxl:text-sm px-4 py-2 transition duration-300 ease-in-out ${
            isActive(link.href)
              ? "text-active_color font-bold border-b-2 border-active_color"
              : "text-interactive_color hover:text-active_color"
          } `}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
