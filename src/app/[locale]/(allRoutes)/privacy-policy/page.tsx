import React from "react";
import { useTranslations } from "next-intl";

const PrivacyPolicy: React.FC = () => {
  const t = useTranslations("PrivacyPolicy");

  return (
    <div className="min-h-[600px] py-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-mobile_header lg:text-header text-center text-interactive_color mb-12">
          {t("title")}
        </h1>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t("section.title")}
          </h2>

          <p className="text-description_sm lg:text-description_lg mb-6 leading-relaxed">
            {t("section.description_1")}
          </p>

          <p className="text-description_sm lg:text-description_lg leading-relaxed">
            {t.rich("section.description_2", {
              email: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
