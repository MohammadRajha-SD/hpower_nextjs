"use client";
import Image from "next/image";
import PosterBanner from "../ui/PosterBanner";
import FeatureCard from "./FeaturedCard";
import StatsBar from "./StatsBar";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import PartnerForm from "./PartnerForm";
import Pricing from "../home/Pricing";

const BecomeAPartner = () => {
  const t = useTranslations("BecomeAPartner");

  const features = [
    {
      image: "/how-1.webp",
      title: t("features.0.title"),
      description: t("features.0.description"),
    },
    {
      image: "/how-2.webp",
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      image: "/how-3.webp",
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
  ];

  return (
    <div className="w-full py-10">
      <PosterBanner header={t("header")} description={t("description")} />
      <StatsBar />

      {/* <Pricing /> */}
      <PartnerForm />

      {/* Mobile View: Swiper */}
      <div className="block md:hidden px-4 py-16">
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
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <FeatureCard
                icon={
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <Image
                      fill
                      src={feature.image}
                      alt={feature.title}
                      className="object-contain"
                    />
                  </div>
                }
                title={feature.title}
                description={feature.description}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View: Grid */}
      <div className="hidden md:grid container mx-auto px-4 grid-cols-3 gap-8 py-20">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={
              <div className="relative w-32 h-32">
                <Image
                  fill
                  src={feature.image}
                  alt={feature.title}
                  className="object-contain"
                />
              </div>
            }
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BecomeAPartner;
