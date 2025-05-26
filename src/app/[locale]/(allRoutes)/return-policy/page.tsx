import React from "react";
import { useTranslations } from "next-intl";

const ReturnPolicy: React.FC = () => {
  const t = useTranslations("ReturnPolicy");

  return (
    <div className="min-h-[600px] py-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-mobile_header lg:text-header text-center text-interactive_color mb-12">
          {t("title")}
        </h1>

        <div className="p-8">
          <p className="text-description_sm lg:text-description_lg mb-8 leading-relaxed">
            {t("individual_clients.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
