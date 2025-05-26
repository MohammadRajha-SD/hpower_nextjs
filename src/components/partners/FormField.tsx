"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

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
}) => {
  const Icon = icon;
  const locale = useLocale();

  // Determine validation rules based on field type
  const getValidationRules = () => {
    // Start with required validation
    const rules: Record<string, any> = { required: true };

    if (name === "companyWebsite") {
      rules.validate = (value: string) => {
        if (!value) return true;

        const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]+)?$/i;
        return urlPattern.test(value)
          ? true
          : locale === "ar"
            ? "رابط الموقع غير صالح"
            : "Invalid website URL";
      };
    }
    // Add email validation pattern if field type is email
    if (type === "email") {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: locale === "en" ? "Invalid email address" : "البريد الإلكتروني غير صالح",
      };
    }

    return rules;
  };

  return (
    <div className="form-group">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {type === "select" ? (
          <select
            {...register(name, { required: true })}
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
          {errors[name].message || `${label} ${locale === "ar" ? "مطلوب" : "is required"}`}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;