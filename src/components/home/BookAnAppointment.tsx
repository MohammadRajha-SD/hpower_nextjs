// BookAnAppointment.tsx
"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isPast, isToday } from "date-fns";
import { useTranslations } from "next-intl";
import BookingModal from "./BookingModal";

const BookAnAppointment = () => {
  const t = useTranslations("BookAnAppointment");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleBookAppointment = () => {
    setSelectedDate(addDays(new Date(), 1));
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-center py-20 p-6 xxl:px-48">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full flex flex-col lg:flex-row items-center gap-10 xxl:px-32">
        {/* Text Section */}
        <div className="text-center lg:text-start w-full">
          <h2 className="text-mobile_header lg:text-header text-interactive_color mb-8">
            {t("title")}
          </h2>
          <ul className="text-gray-700 text-sm md:text-base flex flex-col gap-3">
            <li>{t("step_1")}</li>
            <li>{t("step_2")}</li>
            <li>{t("step_3")}</li>
          </ul>
        </div>

        {/* Calendar Section */}
        <div className="w-full lg:w-auto">
          <h3 className="text-lg font-semibold mb-3 text-center text-gray-800">
            {t("select_date")}
          </h3>
          <div className="bg-gray-100 p-4 rounded-xl">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              classNames={{
                day_selected:
                  "bg-interactive_color text-white hover:bg-interactive_color",
                day_today: "bg-gray-200 text-gray-900 font-semibold",
              }}
              disabled={(date) => isPast(date) && !isToday(date)}
            />
          </div>
          <p className="text-center text-gray-700 mt-3 text-sm">
            {selectedDate
              ? `${t("selected_date")}: ${format(selectedDate, "PPP")}`
              : t("no_date_selected")}
          </p>
        </div>
      </div>

      {/* BookingModal Component */}
      <BookingModal
        isOpen={isDialogOpen}
        onOpenChange={handleBookAppointment}
        selectedDate={selectedDate}
        onBookAppointment={handleBookAppointment}
        handleDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default BookAnAppointment;
