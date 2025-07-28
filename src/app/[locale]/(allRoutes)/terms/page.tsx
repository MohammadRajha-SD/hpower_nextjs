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
            {t("intro")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("agreement")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("definition_us")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("definition_you")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("info_note")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("accuracy_disclaimer")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("ownership")}
          </p>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("trademarks")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
