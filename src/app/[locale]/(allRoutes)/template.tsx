"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import TransitionLoader from "./TransitionLoader"
export default function Template({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = `${pathname}?${searchParams.toString()}`;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pageKey} className="h-full">
        <TransitionLoader />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
