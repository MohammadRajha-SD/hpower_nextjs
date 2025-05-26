"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "./BookingModal";
import { addDays } from "date-fns";

const PartnersSlider = ({ data }) => {
  const swiperRef = useRef<any>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const handleResize = () => {
      if (navigationPrevRef.current && navigationNextRef.current) {
        // Reinitialize navigation if needed
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="">
      <div className="container mx-auto px-4">
        <div className="w-full overflow-hidden relative">
          <div
            className="absolute left-0 top-0 w-12 lg:w-60 h-full z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #FFFAF8 40%, rgba(255, 249, 249, 0))",
            }}
          />
          <div
            className="absolute right-0 top-0 w-12 lg:w-60 h-full z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, #FFFAF8 40%, rgba(255, 249, 249, 0))",
            }}
          />

          <button
            ref={navigationPrevRef}
            className="absolute left-4 lg:left-16 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center focus:outline-none transition-all duration-300 hover:bg-active_color hover:text-white hover:scale-110"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            ref={navigationNextRef}
            className="absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center focus:outline-none transition-all duration-300 hover:bg-active_color hover:text-white hover:scale-110"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            loop={data.length > 4}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={3000}
            slidesPerView={1}
            allowTouchMove={true}
            navigation={{
              prevEl: navigationPrevRef.current
                ? navigationPrevRef.current
                : undefined,
              nextEl: navigationNextRef.current
                ? navigationNextRef.current
                : undefined,
            }}
            onSwiper={(swiper) => {
              if (navigationPrevRef.current && navigationNextRef.current) {
                // @ts-ignore
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = navigationNextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="w-full py-10"
          >
            {data?.map((item: any) => (
              <SwiperSlide
                key={item.id}
                className="flex justify-center items-center"
              >
                <div
                  className="w-36 h-36 bg-white shadow-md rounded-xl flex items-center justify-center p-4 group cursor-pointer"
                  aria-label={item.title}
                >
                  <Image
                    src={item.image_path}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PartnersSlider;
