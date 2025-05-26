"use client";
import { useTranslations } from "next-intl";
import FAQComponent from "./FAQComponent";
import { useFaqs } from "@/hooks/useFaqs";

const FAQ = () => {
  const t = useTranslations("faq");
  const { faqs, faq_categories } = useFaqs();
  const faqsData = faqs?.data;

  // Group FAQs by category
  const groupedFaqs = faqsData?.reduce(
    (acc, faq) => {
      const category = faq.faq_category_name || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="p-4 xl:px-48 min-h-[600px]">
      <div className="">
        <h1 className="text-interactive_color text-mobile_header lg:text-header text-center py-10">
          {t("common_questions")}
        </h1>
        <div className="flex flex-col gap-2">
          {!faqsData || faqsData.length === 0 ? (
            <div className="text-center text-gray-500">No FAQs available</div>
          ) : (
            Object.entries(groupedFaqs || {}).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold text-interactive_color mb-4">
                  {category}
                </h2>
                <FAQComponent faqItems={items} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
