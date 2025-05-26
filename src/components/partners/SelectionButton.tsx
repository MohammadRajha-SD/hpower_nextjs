import React from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { Plus } from "lucide-react";

interface SelectionProps {
  item: any;
  selected: boolean;
  onToggle?: (service: any) => void;
  fromOtherButton?: boolean;
}
const SelectionButton = ({
  item,
  selected,
  onToggle,
  fromOtherButton = false,
}: SelectionProps) => {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(item)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`p-2 border rounded-lg flex items-center justify-center gap-3 w-full ${
        selected
          ? "bg-interactive_color text-white border-transparent"
          : "border-gray-300 text-gray-700 hover:border-interactive_color"
      } transition-all duration-200`}
    >
      {selected && <FaCheck className="inline mx-1 h-3 w-3" />}
      {item}
      {fromOtherButton && <Plus size={22} />}
    </motion.button>
  );
};

export default SelectionButton;
