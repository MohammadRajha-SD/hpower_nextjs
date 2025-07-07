import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPinIcon, StarIcon } from "lucide-react";
import { formatCurrency } from "@/utils/helper";
import parse from "html-react-parser";

const ServiceCard = ({ service, viewMode, router }: any) => {
  const t = useTranslations();
  const isGrid = viewMode === "grid";
  const isBusy = service.enable_booking === 0;
  const locale = useLocale();

  const handleClick = () => {
    router.push(`/services/${service.id}`);
  };
  const formatSlug = (slug?: string) => {
    if (!slug) return "-";

    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow cursor-pointer overflow-hidden transition ${isGrid ? "" : "flex"
        } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className={`${isGrid ? "h-48 w-full" : "w-1/3 min-h-40"}`}>
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={service.images?.[0] || "/placeholder-image.jpg"}
            alt={service.name}
            width={400}
            height={400}
            className="object-cover w-full min-h-48 max-md:min-h-60" // Added min-h-48 and max-md:min-h-60
          />
        </div>
        <div className="absolute top-2 right-2 space-y-1">
          {service.featured !== 0 && (
            <span className="bg-interactive_color text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <StarIcon className="w-3 h-3" />
              {t("featured")}
            </span>
          )}
          {isBusy && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {t("service_busy")}
            </span>
          )}
        </div>
      </div>

      <div className={`p-4 ${isGrid ? "" : "w-2/3"}`}>
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {parse(service.description)}
        </p>

        <div className="mt-2 flex justify-between items-center">
          <div>
            <span className="text-interactive_color font-semibold">
              {formatCurrency(
                parseFloat(
                  service.discount_price < 1
                    ? service.price
                    : service.discount_price
                ),
                locale,
                16
              )}
            </span>
            {service.discount_price > 1 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatCurrency(parseFloat(service.price), locale, 14)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Clock width={14} />
            {locale === "ar" ? "المده : " : "Duration :"}
            {service.duration.slice(0, 5)}
          </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
          <span>
            {service.addresses && service.addresses?.map((address, index) => (
              <span key={index}>{formatSlug(address.address)}{index < service.addresses.length - 1 ? ', ' : ''}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
