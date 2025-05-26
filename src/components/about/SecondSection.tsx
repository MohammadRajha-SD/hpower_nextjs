"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const SecondSection = () => {
  const t = useTranslations("SecondSection");

  const sectionData = t.raw("sections");

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16">
          {sectionData?.map((section: any, idx: number) => (
            <div key={idx} className="w-full text-center gap-2">
              <Image
                src={section.image}
                width={100}
                height={100}
                alt={section.alt}
                className="h-auto mx-auto"
              />
              <h2 className="text-mobile_header lg:text-header text-interactive_color mb-4">
                {section.title}
              </h2>

              {section.content ? (
                <p className="text-start">{section.content}</p>
              ) : (
                <div className="text-start">
                  {section.items?.map((item: any, index: number) => (
                    <div key={index} className="mb-8">
                      <p className="font-semibold text-lg mb-2">
                        {item.subtitle}
                      </p>
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
