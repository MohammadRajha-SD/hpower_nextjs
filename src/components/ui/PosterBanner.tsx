import { useLocale } from "next-intl";
import React from "react";

const PosterBanner = ({
  header,
  description,
}: {
  header: string;
  description?: string;
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className="relative w-full h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(/banner.webp)` }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 ${
          isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
        } from-gray-900/80 via-transparent to-transparent`}
      ></div>

      {/* Content centered */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 pt-40 w-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h1 className="text-2xl lg:text-5xl font-normal mb-4 text-center">
          {header}
        </h1>
        {description && <p className="text-lg text-center">{description}</p>}
      </div>
    </div>
  );
};
export default PosterBanner;
