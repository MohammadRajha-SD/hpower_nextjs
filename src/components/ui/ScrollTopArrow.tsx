"use client";
import { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigUpIcon, ArrowUp, ArrowUpIcon } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px from the top
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function with smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 px-3 pb-2 pt-4 bg-active_color hover:bg-interactive_color text-white rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowBigUpIcon
            className="animate-bounce group-hover:animate-none"
            size={26}
          />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
