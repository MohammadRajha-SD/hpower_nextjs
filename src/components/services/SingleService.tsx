"use client";
import Image from "next/image";
import { useServices } from "@/hooks/useServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { BiErrorAlt } from "react-icons/bi";
import parse from "html-react-parser";
import Cookies from "js-cookie";
import BookingForm from "./BookingForm";
import useUserDetails from "@/hooks/useUserDetails";
import Loader from "../ui/Loader";
import { formatCurrency } from "@/utils/helper";
import SuccessPopup from "./SuccessPopup";
import { sendBookingEmail } from "@/actions/bookingMail";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  Eye,
  XCircleIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "lucide-react";

import { FaExclamation } from "react-icons/fa";
import AddressPromptDialog from "../home/AddressPromptDialog";

const SingleService = ({ serviceId }: { serviceId: string }) => {
  const { services, emirates } = useServices();
  const { user, userType } = useUserDetails();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);

  const [couponData, setCouponData] = useState<{
    discount: number;
    discountType: string;
    expires_at: string;
  } | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [emirate, setEmirate] = useState("");
  const [hint, setHint] = useState("");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("SingleService");

  const service = services?.services?.find(
    (s: any) => s.id === parseInt(serviceId)
  );

  if (!service) {
    return (
      <div className="w-full text-center py-32">
        <Loader />
      </div>
    );
  }

  const servicePrice = parseFloat(
    service.discount_price < 1 ? service.price : service.discount_price
  );

  const isBookingDisabled = service.enable_booking == 0;

  const images: string[] = service.images?.length
    ? service.images
    : ["https://via.placeholder.com/800x600"];

  const getAuthToken = () => Cookies.get("authToken") || "";

  const hasBookedService = user?.bookings?.some(
    (booking: any) =>
      booking.service_id === parseInt(serviceId) &&
      booking.booking_status === "Pending"
  );

  const handleApplyCoupon = async (formData: FormData) => {
    if (!couponCode.trim()) {
      toast.error(t("enter_coupon_code"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/check-coupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            code: couponCode,
            service_id: service.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message_en || t("invalid_coupon"));

      if (result.success) {
        const { discount, discount_type, expires_at } = result.data;
        setCouponData({
          discount: parseFloat(discount),
          discountType: discount_type,
          expires_at,
        });
        setAppliedCoupon(true);
        toast.success(t("coupon_applied"));
      } else throw new Error(t("invalid_coupon"));
    } catch (error) {
      toast.error(t("invalid_coupon"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    const updateData = {
      address: address,
      apartment_name: apartmentName,
      building_number: buildingNumber,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/add-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
    } catch (error) {
    }
  };

  const handleBooking = async (formData: FormData) => {
    if (isBookingDisabled) {
      toast.error(t("service_unavailable"));
      return;
    }

    const startAt = formData.get("start_at") as string;

    if (!startAt) {
      toast.error(t("select_datetime"));
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/new-booking?lang=${locale}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message_en || t("booking_failed"));

      const fullAddress = `${address}${apartmentName ? `, ${apartmentName}` : ""}${buildingNumber ? `, ${buildingNumber}` : ""}`;

      const alreadyExists = user.addresses?.some((a: any) => {
        return (
          a.address?.toLowerCase() === address?.toLowerCase() &&
          a.apartment_name?.toLowerCase() === apartmentName?.toLowerCase() &&
          a.building_number?.toLowerCase() === buildingNumber?.toLowerCase()
        );
      });

      if (saveAddress && selectedSavedAddressId == null && !alreadyExists) {
        await handleAddAddress();
      }


      const bookingData = {
        serviceName: service.name,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "",
        userPhone: user?.phone_number || "",
        providerEmail: service.provider.email,
        providerName: service.provider.name,
        address: fullAddress,
        // address: formData.get("address") as string,
        // apartment_name: apartmentName,
        // building_number: buildingNumber,
        quantity: parseInt(formData.get("quantity") as string) || 1,
        hint: formData.get("hint") as string,
        start_at: startAt,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: locale,
        BookingData: new Date().toISOString(),
      };

      // const emailResult = await sendBookingEmail(bookingData);

      // if (!emailResult.success) {
      //   console.error("Failed to send booking email:", emailResult.error);
      // }

      toast.success(t("booking_successful"));
      // setShowSuccessPopup(true);
      setQuantity(1);
      setAddress("");
      setHint("");
      setCouponCode("");
      setAppliedCoupon(false);
      setCouponData(null);

      if (result.payment_url) {
        window.location.href = result.payment_url;
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (appliedCoupon && couponData && servicePrice) {
      const { discount, discountType } = couponData;
      let savings = 0,
        discountPercentage = 0,
        discountPrice = servicePrice;
      if (discountType === "percent") {
        savings = (servicePrice * discount) / 100;
        discountPercentage = discount;
      } else if (discountType === "fixed") {
        savings = discount;
        discountPercentage = parseInt(
          ((discount / servicePrice) * 100).toFixed(0)
        );
      }
      discountPrice = servicePrice - savings;
      return { savings: savings.toFixed(2), discountPercentage, discountPrice };
    }
    return { savings: "0", discountPercentage: 0, discountPrice: servicePrice };
  };

  const { savings, discountPercentage, discountPrice } = calculateDiscount();
  const finalPrice = appliedCoupon ? discountPrice : servicePrice;

  const formatSlug = (slug?: string) => {
    if (!slug) return "-";

    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
      <Toaster />

      <div className="block lg:hidden w-full h-[250px] sm:h-[350px] md:h-[450px] relative z-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black opacity-25" />
                {/* {isBookingDisabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center p-4 sm:p-6 bg-white bg-opacity-90 rounded-lg max-w-[90%] sm:max-w-md">
                      <BiErrorAlt className="mx-auto h-10 w-10 text-red-500 mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2">
                        {t("service_busy_title")}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700">
                        {t("service_busy_message")}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col lg:flex-row mt-8 lg:mt-2">
        <div className="flex items-center px-8 md:ps-10 lg:w-1/2">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-mobile_header lg:text-header text-interactive_color text-center">
              {service.name}
            </h1>

            {isBookingDisabled && (
              <div className="mb-8 p-6 bg-red-50 border-l-4 border-interactive_color rounded-lg">
                <div className="flex items-start gap-3">
                  <BiErrorAlt className="flex-shrink-0 h-6 w-6 text-interactive_color mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-interactive_color mb-1">
                      {t("service_busy_title")}
                    </h3>
                    <p className="text-interactive_color">{t("service_busy_message")}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-2 p-2 rounded-xl flex flex-col justify-center items-center">
              <div className="flex items-end gap-4 mb-2 flex-col sm:flex-row">
                {/* <p className="text-2xl font-bold text-interactive_color bg-gradient-to-r from-green-50 to-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out tracking-wide hover:scale-105">
                  {formatCurrency(finalPrice, locale, 20)}
                </p> */}

                <div className="flex items-center space-x-3">
                  {/* Old Price */}
                  {/* servicePrice */}
                  {parseInt(service.price) > parseInt(service.discount_price) &&
                    <p className="text-lg line-through text-gray-400">
                      {formatCurrency(parseInt(service.price), locale, 20)}
                    </p>
                  }

                  {/* New Final Price */}
                  <p className="text-2xl font-bold text-interactive_color bg-gradient-to-r from-green-50 to-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out tracking-wide hover:scale-105">
                    {formatCurrency(finalPrice, locale, 20)}
                  </p>
                </div>

                {appliedCoupon && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(servicePrice, locale, 20)}
                  </span>
                )}
                {appliedCoupon && couponData && (
                  <span className="px-3 py-1 text-sm font-bold text-white bg-green-600 rounded-full animate-pulse">
                    {discountPercentage}% {t("off")}
                  </span>
                )}
              </div>
              {appliedCoupon && couponData && (
                <p className="text-green-600 font-medium">
                  {t("you_saved")} {formatCurrency(parseFloat(savings), locale)}{" "}
                  {t("with_coupon")}
                </p>
              )}
              {appliedCoupon && couponData && (
                <p className="text-gray-600 text-sm">
                  {t("expires_at")}:{" "}
                  {new Date(couponData.expires_at).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            <BookingForm
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
              selectedSavedAddressId={selectedSavedAddressId}
              setSelectedSavedAddressId={setSelectedSavedAddressId}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              handleApplyCoupon={handleApplyCoupon}
              loadingCheck={loading}
              bookingLoading={bookingLoading}
              service={service}
              isBookingDisabled={isBookingDisabled}
              handleBooking={handleBooking}
              quantity={quantity}
              setQuantity={setQuantity}
              address={address}
              emirate={emirate}
              setEmirate={setEmirate}
              setAddress={setAddress}
              hint={hint}
              setHint={setHint}
              apartmentName={apartmentName}
              setApartmentName={setApartmentName}
              buildingNumber={buildingNumber}
              setBuildingNumber={setBuildingNumber}
              hasBookedService={hasBookedService}
              setShowSuccessPopup={setShowSuccessPopup}
            />

            <hr className="my-4 border-gray-200" />

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-5 text-gray-800">
                {t("service_details")}
              </h2>

              <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg gap-2">
                <ClockIcon className="w-5 h-5 text-interactive_color mr-2" />
                <span className="font-medium text-gray-700">
                  {t("duration")}:
                </span>
                <span className=" text-gray-600">
                  {service.duration?.slice(0, 5) || t("one_hour")}
                </span>
              </div>

              {isBookingDisabled && (
                <div className="flex items-center mb-4 p-3 bg-red-50 rounded-lg">
                  <FaExclamation className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-600">
                    {t("status")}:
                  </span>
                  <span className="ml-1 text-red-600">
                    {t("currently_unavailable")}
                  </span>
                </div>
              )}

              <div>{parse(service.description)}</div>

              <div className="bg-white">
                <button
                  onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                  className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 mb-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 ">
                    <CalendarIcon className="w-5 h-5 mr-2 text-gray-600" />
                    {t("working_schedule")}
                  </div>
                  {isScheduleOpen ? (
                    <ChevronDownIcon
                      className={`w-6 h-6 text-gray-600 transition-transform`}
                    />
                  ) : (
                    <div className="flex items-center cursor-pointer gap-2 hover:underline text-interactive_color hover:text-active_color mt-2">
                      <p className="text-sm "> {t("check_schedule")}</p>
                      <Eye className={`w-6 h-6 transition-transform `} />
                    </div>
                  )}
                </button>
                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ${isScheduleOpen ? "max-h-[500px]" : "max-h-0"}`}
                >
                  {service.provider.schedules.map(
                    (schedule: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-3 rounded-lg ${schedule.working_hours === "Closed"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-green-50 text-gray-700"
                          }`}
                      >
                        <span className="font-medium">{schedule.day}</span>
                        <div className="flex items-center gap-2">
                          {schedule.working_hours === "Closed" ? (
                            <>
                              <XCircleIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                              <span className="text-sm">{t("closed")}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-1.5 text-green-500" />
                              <span className="text-sm">
                                {schedule.working_hours}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <hr className="my-4 border-gray-200" />
              <div>
                <button
                  onClick={() => setIsAddressOpen(!isAddressOpen)}
                  className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 mb-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 mr-2 text-gray-600" />
                    {t("service_addresses")}
                  </div>
                  {isAddressOpen ? (
                    <ChevronDownIcon className="w-6 h-6 text-gray-600 transition-transform" />
                  ) : (
                    <div className="flex items-center cursor-pointer gap-2 hover:underline text-interactive_color hover:text-active_color mt-2">
                      <p className="text-sm">{t("view_addresses")}</p>
                      <Eye className="w-6 h-6 transition-transform" />
                    </div>
                  )}
                </button>


                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ${isAddressOpen ? "max-h-[500px]" : "max-h-0"
                    }`}
                >
                  {service.addresses?.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 bg-gray-100 rounded-lg">
                      {t("no_addresses")}
                    </div>
                  ) : (
                    service.addresses?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-lg bg-blue-50 text-gray-700"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{formatSlug(item?.address)}</span>
                          <span className="text-sm text-gray-500 inline-flex items-center gap-1">
                            {t("service_charge")}:
                            <Image
                              src="/aed.svg"
                              width={12}
                              height={12}
                              alt="AED"
                              className="inline-block hover:scale-110 transition-transform duration-200"
                            /> {item.service_charge}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 w-full lg:w-1/2 relative lg:h-[90vh]">
          <div
            className="hidden lg:block h-full w-full"
            style={{
              clipPath: isRTL
                ? "polygon(0 0, 80% 0%, 100% 100%, 0 100%)"
                : "polygon(20% 0, 100% 0%, 100% 100%, 0 100%)",
            }}
          >
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              navigation
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="h-full w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="h-full w-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${img})` }}
                  >
                    <div className="absolute inset-0 bg-black opacity-25" />
                    {/* {isBookingDisabled && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center p-6 bg-white bg-opacity-90 rounded-lg max-w-md">
                          <BiErrorAlt className="mx-auto h-12 w-12 text-red-500 mb-3" />
                          <h3 className="text-xl font-bold text-red-600 mb-2">
                            {t("service_busy_title")}
                          </h3>
                          <p className="text-gray-700">
                            {t("service_busy_message")}
                          </p>
                        </div>
                      </div>
                    )} */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {showSuccessPopup && (
            <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
          )}
        </div>
      </div>

      <AddressPromptDialog />
    </div>
  );
};

export default SingleService;
