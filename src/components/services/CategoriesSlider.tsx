"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const CategoriesSlider = () => {
  const { categories: cats } = useCategories();
  const t = useTranslations("ServicesSection");
  const router = useRouter();
  const parentCategories =
    cats?.data?.filter((cat: any) => !cat.has_parent) || [];

  const mainCategories =
    parentCategories?.map((parent) => ({
      ...parent,
      subcategories: parent.children || [],
    })) || [];

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClic1k = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };


  const handleCategoryClick = (category: any, isSubcategory = false, parentCategoryId?: number) => {
    // Build the query parameters
    const params = new URLSearchParams();

    if (isSubcategory) {
      // subcategory clicked
      if (parentCategoryId) {
        params.append("category", String(parentCategoryId));
      }
      params.append("subcategory", String(category.id));
    } else {
      // main category clicked
      params.append("category", String(category.id));
    }

    // Navigate to /services with query params
    router.push(`/en/services?${params.toString()}`);

    // Optionally, set selectedCategory and modal if you want to open popup
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // New reset handler
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
    router.push(`/en/services`); 
  };
  
  return (
    <div className="p-4">
       {/* Reset Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label={t("reset_filters")}
        >
          {t("reset_filters")}
        </button>
      </div>


      {/* Main Categories */}
      <h2 className="text-mobile_header lg:text-header text-interactive_color mb-6">
        {t("mainCategories")}
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        loop={mainCategories.length > 4}
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
        speed={3000}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
        }}
        className="mb-12"
      >
        {mainCategories.map((category) => (
          <SwiperSlide
            key={category.id}
            className="flex justify-center items-center cursor-pointer"
            onClick={() => handleCategoryClick(category, false)}
            aria-label={category.name}
          >
            <div className="flex flex-col gap-3 items-center justify-center w-[180px]">
              <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden">
                <Image
                  src={category.image_path || "/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <AnimatePresence>
                {category.name && (
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeVariants}
                    className="text-center text-lg font-semibold text-interactive_color"
                  >
                    {category.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Sub Categories */}
      <h2 className="text-mobile_header lg:text-header text-interactive_color mb-6">
        {t("subCategories")}
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        loop={
          mainCategories.flatMap((c) => c.subcategories).length > 4
        }
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
        speed={3000}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
        }}
      >
        {mainCategories
          .flatMap((category) =>
            (category.subcategories || []).map((sub) => ({
              ...sub,
              parentId: category.id,
            }))
          )
          .map((sub) => (
            <SwiperSlide
              key={sub.id}
              className="flex justify-center items-center cursor-pointer"
              onClick={() => handleCategoryClick(sub, true, sub.parentId)}
              aria-label={sub.name}
            >
              <div className="flex flex-col gap-3 items-center justify-center w-[180px]">
                <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden">
                  <Image
                    src={sub.image_path || "/placeholder.png"}
                    alt={sub.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <AnimatePresence>
                  {sub.name && (
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      variants={fadeVariants}
                      className="text-center text-lg font-semibold text-interactive_color"
                    >
                      {sub.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Example modal to show on category click */}
      {/* <ServicePopup
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedCategory={selectedCategory}
      /> */}
    </div>
  );
};

export default CategoriesSlider;
