"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef(null);

  const languages = [
    { code: "ar", name: "العربية", flag: "/ar.svg" },
    { code: "en", name: "English", flag: "/en.png" },
  ];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (newLang) => {
    setIsOpen(false);
    const currentPath = pathname.slice(3); // remove /en or /ar
    const query = searchParams.toString();
    const newPath = `/${newLang}${currentPath}${query ? `?${query}` : ""}`;
    router.push(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 p-2 rounded-lg border border-interactive_color hover:border-active_color hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={languages.find((l) => l.code === locale)?.flag || "/ar.svg"}
          alt="Flag"
          width={20}
          height={20}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm lg:text-xs xxl:text-sm font-medium mt-[2px]">
          {locale === "ar" ? "العربية" : "English"}
        </span>
        <ChevronDownIcon size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50 my-2"
            dir="rtl"
          >
            {languages.map(({ code, name, flag }) => (
              <li
                key={code}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-active_color group transition"
                onClick={() => switchLanguage(code)}
              >
                <Image
                  src={flag}
                  alt={name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm group-hover:text-white">{name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
