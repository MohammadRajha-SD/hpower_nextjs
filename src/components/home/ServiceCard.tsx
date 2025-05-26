import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

interface ServiceCardProps {
  title: string;
  description?: string;
  image: string;
  id: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  id,
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden group shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer ">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />

      {/* Overlay with animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10 text-white transition-all duration-500 group-hover:translate-y-0 translate-y-5">
        <h3 className="text-xl font-bold mb-1 drop-shadow">{title}</h3>

        {/* Description with animated reveal */}
        <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out">
          {description && (
            <p className="text-sm mb-3 text-white/90 line-clamp-3 drop-shadow">
              {parse(description)}
            </p>
          )}
        </div>

        <Link
          href={`/services/${id}`}
          className="inline-block bg-interactive_color hover:bg-active_color text-white px-5 py-2 text-center rounded-full text-sm font-medium transition duration-300"
        >
          {isRtl ? "عرض التفاصيل" : "          View Details"}
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
