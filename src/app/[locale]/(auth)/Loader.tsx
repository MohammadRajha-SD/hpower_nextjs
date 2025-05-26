"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface LoaderProps {
  isLoading?: boolean;
  color?: string;
  size?: "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  isLoading = true,
  color = "#FF7C44",
  size = "large",
  message,
  fullScreen = false,
}) => {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("Loading");

  // Use the translation only if no message was provided
  const displayMessage = message || t("loading");

  // Control animation timing
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  // Size configurations
  const sizeConfig = {
    small: {
      wrapper: "h-8 w-8",
      dot: "h-1.5 w-1.5",
      text: "text-xs",
    },
    medium: {
      wrapper: "h-12 w-12",
      dot: "h-2 w-2",
      text: "text-sm",
    },
    large: {
      wrapper: "h-16 w-16",
      dot: "h-3 w-3",
      text: "text-base",
    },
  };

  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-transparent "
    : "flex items-center justify-center";

  return (
    <div
      className={`${containerClass} w-full min-h-screen transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col items-center">
        <div className={`relative ${sizeConfig[size].wrapper}`}>
          {/* Animated dots */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute ${sizeConfig[size].dot} rounded-full`}
              style={{
                backgroundColor: color,
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateY(-150%)`,
                opacity: 0,
                animation: `loaderDotFade 1.2s linear infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>

        {displayMessage && (
          <p
            className={`mt-4 ${sizeConfig[size].text} font-medium animate-pulse text-interactive_color`}
          >
            {displayMessage}
          </p>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes loaderDotFade {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
