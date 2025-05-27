"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

// Form Field Component
const FormField = ({
  label,
  icon,
  register,
  name,
  errors,
  type = "text",
  options = null,
  placeholder,
  required = false, // New prop to indicate if the field is mandatory
}) => {
  const Icon = icon;
  const locale = useLocale();
  const t = useTranslations("FinalStep");

  // Determine validation rules based on field type
  const getValidationRules = () => {
    const rules: Record<string, any> = {};

    // Only add required validation if the field is marked as required
    if (required) {
      rules.required =
        locale === "en" ? `${label} is required` : `${label} مطلوب`;
    }

    // Add email validation pattern if field type is email
    if (type === "email") {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message:
          locale === "en"
            ? "Invalid email address"
            : "البريد الإلكتروني غير صالح",
      };
    }

    return rules;
  };

  return (
    <div className="form-group">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-gray-500 ml-2 text-xs">
            ({t("optional") || "Optional"})
          </span>
        )}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {type === "select" ? (
          <select
            {...register(name, getValidationRules())}
            className="w-full pl-10 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-interactive_color focus:border-transparent transition duration-200 appearance-none bg-white"
          >
            <option value="">{placeholder}</option>
            {options &&
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        ) : (
          <input
            {...register(name, getValidationRules())}
            type={type}
            placeholder={placeholder}
            className="w-full pl-10 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-interactive_color focus:border-transparent transition duration-200"
          />
        )}
      </div>
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-1"
        >
          {errors[name].message ||
            `${label} ${locale === "ar" ? "مطلوب" : "is required"}`}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;
