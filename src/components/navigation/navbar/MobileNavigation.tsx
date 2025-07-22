"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ChevronDown,
  UserCircle2Icon,
  LogOut,
} from "lucide-react";
import NavLinksMobile from "./NavLinksMobile";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import useUserDetails from "@/hooks/useUserDetails";
import { dropdownVariants, getInitial } from "@/utils/helper";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import Image from "next/image";

// Define the User type based on your useUserDetails hook
interface User {
  name: string;
}

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, setUser, loading } = useUserDetails();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("Navbar");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isRTL = locale === 'en';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setDropdownOpen(false); // close dropdown inside menu as well
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (route: string) => {
    Cookies.remove("userData");
    Cookies.remove("authToken");
    setUser(null);
    setTimeout(() => {
      router.push(route);
    }, 2000);
  };

  return (
    <div className="relative flex z-50" style={{ justifyContent: "space-between" }}>
      {/* Burger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2  text-gray-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
      </button>

      <div className="flex relative w-28 h-10 lg:w-36 lg:h-8 xxl:w-44 items-center ">
        <Link href="/">
          <Image src={"/new-logo.png"} fill alt="HPOWER" className="h-auto" />
        </Link>
      </div>

      <LanguageSwitcher />

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} h-full w-4/5 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
    ${isOpen ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"}`}
      >

        {/* <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      > */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-6 bg-white min-h-screen items-start">
          {/* Additional Action Buttons */}
          {user ? (
            <div className="relative " ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 transition-all duration-300 hover:bg-gray-100 rounded-lg pl-2 px-2 py-1 border border-interactive_color hover:border-active_color"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-interactive_color text-white flex items-center justify-center font-medium shadow-md">
                  {getInitial(user.name)}
                </div>
                <span className="text-interactive_color text-sm font-medium">
                  {user.name || "User"}
                </span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="absolute  mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden origin-top-right"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ zIndex: 100 }}
                    variants={dropdownVariants}
                  >
                    <div className="py-1 divide-y divide-activbg-active_color">
                      <div className="flex gap-3 flex-wrap items-center px-4 py-3 bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-interactive_color text-white flex items-center justify-center font-medium shadow-md">
                          {getInitial(user.name)}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => {
                            toggleMenu();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-interactive_color hover:bg-active_color hover:text-white w-full text-left group"
                        >
                          <div className="bg-blue-50 p-1.5 rounded-md group-hover:bg-blue-100 transition-colors">
                            <User
                              size={16}
                              className="text-interactive_color"
                            />
                          </div>
                          <span>{t("profile")}</span>
                        </Link>

                        <button
                          onClick={() => handleLogout("/sign-in")}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-interactive_color hover:bg-active_color hover:text-white w-full text-left group"
                        >
                          <div className="bg-red-50 p-1.5 rounded-md group-hover:bg-red-100 transition-colors">
                            <LogOut size={16} className="text-red-600" />
                          </div>
                          <span>{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/seeker-register"
              className={`flex items-center gap-2 bg-gray-50 border border-interactive_color rounded-full px-3 py-2 hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow ${loading && "invisible"}`}
            >
              <UserCircle2Icon size={18} className="text-gray-600" />
              <span className="text-interactive_color text-sm lg:text-xs xxl:text-sm font-medium">
                {t("register_create_account")}
              </span>
            </Link>
          )}

          {/* Navigation Links */}
          <NavLinksMobile className="flex flex-col gap-4  w-full" onClick={closeMenu} />
          {/* Service provider button */}
          {/* <LanguageSwitcher /> */}
          {/* <div className="flex flex-col gap-5">
            <CustomButton
              actionLink="/become-a-partner"
              children={t("becomeParter")}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
