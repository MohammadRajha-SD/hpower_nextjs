"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { UserCircle2Icon, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNavigation from "./MobileNavigation";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/ui/CustomButton";
import useUserDetails from "@/hooks/useUserDetails";
import { dropdownVariants, getInitial } from "@/utils/helper";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser, loading } = useUserDetails();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <nav className="fixed top-0 z-50 bg-white lg:bg-white/70 backdrop-blur-md flex items-center justify-between w-full py-3 shadow-sm px-5 xl:px-[3%] xxl:px-[6%] xxxl:px-[12%] mx-auto border-b border-white/10">
      <div className="hidden lg:flex relative w-20 h-8 lg:w-36 lg:h-8 xxl:w-44 items-center mt-2">
        <Link href="/">
          <Image src={"/new-logo.png"} fill alt="HPOWER" className="h-auto" />
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-6 lg:gap-3 xxl:gap-6 ">
        <NavLinks className="flex items-center gap-6 lg:gap-3 xxl:gap-6" />

        {/* <div className="">
          <CustomButton
            actionLink={"/become-a-partner"}
            children={t("becomeParter")}
          />
        </div> */}
      </div>

      <div className="hidden lg:flex items-center gap-5">
        <LanguageSwitcher />

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 transition-all duration-300 hover:bg-gray-100 rounded-lg pl-2 px-2 py-1 border border-interactive_color hover:border-active_color"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-interactive_color text-white flex items-center justify-center font-medium shadow-md">
                {getInitial(user?.name)}
              </div>
              <span className="text-interactive_color text-sm font-medium">
                {user?.name || "User"}
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
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden origin-top-right"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <div className="py-1 divide-y divide-activbg-active_color">
                    <div className="flex gap-3 flex-wrap items-center px-4 py-3 bg-gray-50">
                      {/* <p className="text-xs text-gray-500">
                        {t("signed_in_as")}
                      </p> */}
                      <div className="w-8 h-8 rounded-full bg-interactive_color text-white flex items-center justify-center font-medium shadow-md">
                        {getInitial(user?.name)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-interactive_color hover:bg-active_color hover:text-white w-full text-left group"
                      >
                        <div className="bg-blue-50 p-1.5 rounded-md group-hover:bg-blue-100 transition-colors">
                          <User size={16} className="text-interactive_color" />
                        </div>
                        <span>{t("profile")}</span>
                      </Link>

                      <button
                        onClick={() => handleLogout("/sign-in")}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-interactive_color hover:bg-active_color hover:text-white w-full text-left group"
                      >
                        <div className="bg-red-50 p-1.5 rounded-md group-hover:bg-red-100 transition-colors" >
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
      </div>

      <div className="lg:hidden w-full">
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
