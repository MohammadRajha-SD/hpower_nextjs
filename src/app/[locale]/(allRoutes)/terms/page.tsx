import React from "react";
import { useTranslations } from "next-intl";

const Terms: React.FC = () => {
  const t = useTranslations("Terms");

  return (
    <div className="min-h-[600px] py-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-mobile_header lg:text-header text-center text-interactive_color mb-12">
          {t("title")}
        </h1>

        <div className="p-8">
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("paragraph_1")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("paragraph_2")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_1")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_2")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_3")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_4")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_5")}
          </p>
          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("point_6")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
