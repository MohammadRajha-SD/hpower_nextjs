import Image from "next/image";
import React, { useState } from "react";
import SocialLinks from "./SocialsLinks";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Link from "next/link";

const ContactForm = ({ fromHome }) => {
  const t = useTranslations("ContactForm");

  // State for form inputs, errors, and loading
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = t("name_required");
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = t("name_too_short");
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("email_required");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t("email_invalid");
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = t("message_required");
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = t("message_too_short");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const payload = new URLSearchParams();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("message", formData.message);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/contact-us`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload.toString(),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(t("submit_success"));
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        toast.error(t("submit_error") || data.message);
      }
    } catch (error) {
      toast.error(t("submit_error") || "An error occurred. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const whatsappNumber = "971506164629"; // Remove '+' and spaces from +971 50 616 4629

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {fromHome ? (
            //================ From Home Layout ================
            <div className="flex flex-col md:flex-row gap-8">
              {/* Form Side */}
              <div className="w-full md:w-1/2">
                <h2 className="text-mobile_header lg:text-header text-interactive_color mb-8">
                  {t("title")}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("full_name")}
                      className={`w-full px-4 py-3 rounded-full border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("email")}
                      className={`w-full px-4 py-3 rounded-full border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("message")}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-3xl border ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-interactive_color hover:bg-active_color text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("sending")}
                      </>
                    ) : (
                      t("send")
                    )}
                  </button>
                </form>
              </div>

              {/* Illustration Side */}
              <div className="w-full md:w-1/2 hidden md:flex items-center justify-center relative h-64 md:h-auto">
                <Image
                  src="/images/home/contact-us.svg"
                  alt="Contact us illustration"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          ) : (
            //================ Not from Home Layout ================
            <div>
              <div className="flex flex-col items-center gap-5 lg:flex-row justify-between mb-8">
                {/* Phone Number */}
                <div className="flex items-center gap-2">
                  <span className="">{t("phone")}</span>
                  <Link
                    href={`https://wa.me/${whatsappNumber}`} // WhatsApp link
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security for external links
                    aria-label="WhatsApp"
                    dir="ltr"
                  >
                    + 971 50 616 4629
                  </Link>
                </div>

                {/* Social Media */}
                <div className="flex">
                  <SocialLinks width="w-[200px]" sizeIcon={25} />
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <span className="">{t("contact_email")}</span>
                  <a
                    href="mailto:info@hpower.ae"
                    className="text-interactive_color hover:text-active_color hover:underline"
                  >
                    info@hpower.ae
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("full_name")}
                      className={`w-full px-4 py-3 rounded-full border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("email")}
                      className={`w-full px-4 py-3 rounded-full border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("message")}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-3xl border ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-intertext-interactive_color`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-interactive_color hover:bg-active_color text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("sending")}
                    </>
                  ) : (
                    t("send")
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
