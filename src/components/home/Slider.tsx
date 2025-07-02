"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useSlides } from "@/hooks/useSlider";
import parse from "html-react-parser";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Slider = () => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('slider')
  const { slides } = useSlides();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-full"
      >
        {slides?.slides?.map((slide) => (
          <SwiperSlide key={"slide_" + slide.id} className="relative">
            <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
              <Image
                src={slide.image_path}
                alt={slide.description ?? ""}
                fill
                priority
                quality={100}
                className="object-cover brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 text-white z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight text-white drop-shadow-lg">
                  {slide.text}
                </h2>
                <div className="w-24 h-1 my-4" />
                <span className="text-xl md:text-2xl font-medium max-w-xl text-white drop-shadow-md">
                  {parse(slide.desc)}
                </span>
                <Link
                  href={"/services"}
                  className="mt-8 px-8 py-3 rounded-full bg-white hover:bg-active_color  text-black hover:text-white font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 duration-300"
                >
                  {t("explore_more")}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slider;
