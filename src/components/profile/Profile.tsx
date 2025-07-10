"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, UserCheck, LogOut, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useUserDetails from "@/hooks/useUserDetails";
import EditProfileModal from "./Popup";
import { useServices } from "@/hooks/useServices";
import { useTranslations } from "next-intl";
import CancelBooking from "./CancelBooking";
import { getStatus, getStatusStyles } from "@/utils/helper";
import SuccessPopup from "./SuccessPopup";
import { MapPin, CreditCard } from "lucide-react";
import ProfileImage from "./ProfileImage";
import ProfileAddresses from "./ProfileAddresses";

const Profile: React.FC = () => {
  const t = useTranslations("profile");
  const { services } = useServices();
  const { user, setUser, userType } = useUserDetails();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("booked");

  // Services provided by the user (for providers)
  const providerServices =
    services?.services
      ?.filter((service: any) => service.provider.email === user?.email)
      ?.map((s: any) => s.name) || [];

  // Services booked by the user (for non-providers)
  const userServices = (() => {
    if (!user?.bookings || !services?.services) return [];

    // Aggregate bookings by service_id
    const bookingAggregation = user.bookings.reduce(
      (acc: any, booking: any) => {
        const serviceId = booking.service_id;
        if (!acc[serviceId]) {
          acc[serviceId] = { count: 0, bookings: [] };
        }
        acc[serviceId].count += 1;
        acc[serviceId].bookings.push({
          id: booking.id,
          status: booking.booking_status,
          payment_status: booking.payment_status,
          payment_link: booking.payment_link
        });
        return acc;
      },
      {}
    );

    // Map to service details with quantity and latest status
    return services.services
      .filter((service: any) => bookingAggregation[service.id])
      .map((service: any) => {
        const { count, bookings } = bookingAggregation[service.id];

        // Sort bookings by id (descending) to get the latest
        const latestBooking = bookings.sort((a: any, b: any) => b.id - a.id)[0];

        return {
          id: service.id,
          name: service.name,
          quantity: count,
          status: latestBooking.status,
          payment_status: latestBooking.payment_status,
          payment_link: latestBooking.payment_link,
          providerEmail: service.provider.email,
          providerName: service.provider.name,
          providerPhone: service.provider.phone_number,
          booking_id: latestBooking.id
        };
      });
  })();

  const router = useRouter();

  const handleUpdateProfile = (data: {
    email?: string;
    phoneNumber?: string;
    username?: string;
    name?: string;
    password?: string;
    address?: string;
    userType?: string;
  }) => {
    if (user) {
      // Create a new user object with updated fields, preserving existing ones
      const updatedUser = {
        ...user,
        email: data.email ?? user.email,
        phone_number: data.phoneNumber ?? user.phone_number,
        username: data.username ?? user.username,
        name: data.name ?? user.name,
        address: data.address ?? user.address,
        user_type: data.userType ?? user.user_type ?? userType,
      };

      setUser(updatedUser);

      // Persist updated user data in cookies
      Cookies.set("userData", JSON.stringify(updatedUser), { expires: 7 });
    }
  };


  const handleUpdateProfileImage = (data) => {
    if (user) {
      const updatedUser = {
        ...user,
        image_path: data.image,
      };

      setUser(updatedUser);

      // Persist updated user data in cookies
      Cookies.set("userData", JSON.stringify(updatedUser), { expires: 7 });
    }
  };

  const handleLogout = async () => {
    Cookies.remove("userData");
    Cookies.remove("authToken");
    setUser(null);
    router.push("/sign-in");
  }

  const formatSlug = (slug?: string) => {
    if (!slug) return "-";

    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredServices = userServices?.filter(
    (service) => activeTab === 'booked' ? service.payment_status.toLowerCase() === "paid" && service.status.toLowerCase() !== "approved" : activeTab === 'completed' ? service.status.toLowerCase() === "approved" : service.status.toLowerCase() === activeTab
  );

  console.log(user);
  return (
    <motion.div
      className="relative rounded-xl w-full p-6 bg-white shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-around gap-20">
        {/* Left Column - Profile Info */}
        <div className="md:w-1/3 flex flex-col items-center">
          <ProfileImage user={user} handleUpdateProfileImage={handleUpdateProfileImage} />

          <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-1">
            {user?.name || t("default_user_name")}
          </h1>

          <div className="bg-interactive_color hover:bg-active_color text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
            {userType || "user"}
          </div>

          <div className="space-y-3 w-full">
            <EditProfileModal
              email={user?.email || ""}
              phoneNumber={user?.phone_number || ""}
              username={user?.username || ""}
              name={user?.name || ""}
              address={user?.address || ""}
              userType={userType || ""}
              onUpdateProfile={handleUpdateProfile}
            />

            <motion.button
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-red-500 hover:bg-active_color text-white rounded-lg shadow-md transition-all duration-300 ease-in-out font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </motion.button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:w-2/3 md:border-l md:border-gray-200 md:pl-8 flex flex-col justify-center gap-20 py-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-interactive_color rounded-full mr-2"></span>
              {t("contact_information")}
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <ul className="space-y-4">
                <motion.li
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <div className="bg-interactive_color hover:bg-active_color p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("name_label")}</p>
                    <p className="text-gray-800 font-medium">
                      {user?.name || t("default_user_name")}
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <div className="bg-interactive_color hover:bg-active_color p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("username_label")}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {user?.username?.toLowerCase() || t("default_username")}
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  <div className="bg-interactive_color hover:bg-active_color p-2 rounded-full">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("email_label")}</p>
                    <p className="text-gray-800 font-medium">
                      {user?.email || t("default_email")}
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                >
                  <div className="bg-interactive_color hover:bg-active_color p-2 rounded-full">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("phone_label")}</p>
                    <p className="text-gray-800 font-medium" dir="ltr">
                      {user?.phone_number || t("phone_not_provided")}
                    </p>
                  </div>
                </motion.li>

                {/* <motion.li
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                >
                  <div className="bg-interactive_color hover:bg-active_color p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("address_label")}</p>
                    <p className="text-gray-800 font-medium" dir="ltr">
                      {formatSlug(user?.address)}
                    </p>
                  </div>
                </motion.li> */}
              </ul>
            </div>
          </motion.div>

          {userType === "provider" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-interactive_color rounded-full mr-2"></span>
                {t("services")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {providerServices?.map((service: string) => (
                  <motion.div
                    key={service}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-3 w-full border-gray-300 text-gray-700 hover:border-interactive_color transition-all duration-200`}
                  >
                    {service}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >

              {/* Orders start */}
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-interactive_color rounded-full mr-2"></span>
                {t("orders")}
              </h2>

              {/* TABS */}
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["booked", "completed", "cancelled", "pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all duration-200 ${activeTab === status
                      ? "bg-interactive_color text-white"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {t(`status_${status}`)}
                  </button>
                ))}
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-2">
                {filteredServices?.length > 0 ? (
                  filteredServices.map((service: any) => (
                    <div
                      key={service.name}
                      className={`relative p-4 border rounded-lg flex flex-col w-full border-gray-200 bg-white shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-lg truncate text-gray-800">
                          {service.name}
                        </span>
                      </div>

                      {/* Booking Status */}
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("booking_status")} {/* حـالة الحجز */}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full flex items-center gap-2 ${getStatusStyles(
                              service.status.toLowerCase()
                            )}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {t(`status_${getStatus(service.status.toLowerCase())}`)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("payment_status")} {/* حـالة الدفع */}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full flex items-center gap-2 ${getStatusStyles(
                              service.payment_status.toLowerCase()
                            )}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {t(`status_${getStatus(service.payment_status.toLowerCase())}`)}
                          </span>
                        </div>
                      </div>

                      {/* Cancel Button */}
                      {(service.payment_status.toLowerCase() == 'paid' || (service.payment_status.toLowerCase() == 'pending' && service.status.toLowerCase() != 'cancelled')) &&
                        <CancelBooking
                          serviceName={service.name}
                          bookingId={service.booking_id}
                          status={service.payment_status.toLowerCase()}
                          userName={user.name}
                          userEmail={user.email}
                          userPhone={user.phone_number}
                          providerEmail={service?.providerEmail}
                          providerName={service?.providerName}
                          providerPhone={service.providerPhone}
                          setShowSuccessPopup={() => setShowSuccessPopup(true)}
                        />
                      }

                      {service.payment_status.toLowerCase() == 'pending' && service.status.toLowerCase() != 'cancelled' &&
                        <motion.a
                          href={service.payment_link ?? "#"}
                          target="_blank"
                          className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm font-medium"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}

                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          {t("payment_link")}
                        </motion.a>
                      }
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {t("no_services_booked")}
                    </p>
                  </motion.div>
                )}
              </div>
              {/* Orders end */}

              <ProfileAddresses user={user} />
            </motion.div>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}
    </motion.div>
  );
};

export default Profile;
