"use client";

import React from "react";

interface SelectInputProps {
  options: Array<{ id: string; name: { en: string } }>;
  defaultValue?: string;
  label: string;
  onChange: (value: string) => void;
}

const SelectInput = ({
  options,
  defaultValue,
  label,
  onChange,
}: SelectInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-xs sm:text-sm text-gray-600">{label}</label>
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.id)}
        className="w-full pl-4 pr-4 py-3 text-sm sm:text-base rounded-lg border border-gray-400 placeholder-gray-500 focus:outline-none focus:border-active_color px-2"
      >
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name.en}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
