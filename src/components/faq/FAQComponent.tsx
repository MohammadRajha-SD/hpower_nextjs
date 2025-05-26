import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import parse from "html-react-parser";

const FAQComponent = ({ faqItems }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div>
      {faqItems?.map((item: any, index: number) => (
        <div key={item.id} className="mb-4 border-b rounded-md overflow-hidden">
          <button
            className="w-full text-right flex justify-between items-center p-4 bg-gray-50"
            onClick={() => toggleItem(index)}
          >
            <h2 className="font-semibold max-sm:text-sm text-interactive_color text-start">
              {item.question}
            </h2>

            <HiPlus
              className={`${
                openItems[index] ? "rotate-45" : ""
              } text-red-500 cust-trans`}
              size={20}
            />
          </button>

          {openItems[index] && (
            <div className="p-4 animate-fade-up cust-trans">
              <p className="text-gray-700 text-md max-sm:text-sm">
                {parse(item.answer)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;
