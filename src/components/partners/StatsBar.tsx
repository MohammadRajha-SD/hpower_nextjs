"use client";
import React from "react";
import { useTranslations } from "next-intl";
import {
  FaSmile,
  FaStar,
  FaThumbsUp,
  FaHeadset,
  FaCommentDots,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const StatsBar = () => {
  const t = useTranslations("StatsBar");

  const stats = [
    {
      icon: <FaSmile className="text-lg mr-2" />,
      text: t("happy_customers"),
    },
    {
      icon: <FaCommentDots className="text-lg mr-2" />,
      text: t("reviews"),
    },
    {
      icon: <FaStar className="text-lg mr-2" />,
      text: t("rating"),
    },
    {
      icon: <FaThumbsUp className="text-lg mr-2" />,
      text: t("trusted_pros"),
    },
    {
      icon: <FaHeadset className="text-lg mr-2" />,
      text: t("live_support"),
    },
  ];

  return (
    <div className="w-full bg-active_color hover:bg-interactive_color text-white py-4 text-sm lg:text-base">
      {/* Mobile View: Swiper */}
      <div className="">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.3}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 20,
            disableOnInteraction: false,
          }}
          speed={5000}
          breakpoints={{
            400: {
              slidesPerView: 2,
            },
            700: {
              slidesPerView: 3,
            },
            1040: {
              slidesPerView: 4,
            },
          }}
        >
          {stats.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center px-4 py-2 gap-2">
                {item.icon}
                {item.text}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default StatsBar;
