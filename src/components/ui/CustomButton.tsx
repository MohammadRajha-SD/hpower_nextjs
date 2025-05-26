import Link from "next/link";
import React, { ReactNode } from "react";

const CustomButton = ({
  children,
  actionLink,
  icon,
  handleClick,
  style,
}: {
  children: string;
  actionLink?: string;
  icon?: ReactNode;
  handleClick?: () => void;
  style?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out px-1 py-1  border border-interactive_color `}
      onClick={handleClick}
    >
      <Link
        href={actionLink || "/"}
        className={`bg-interactive_color text-white text-sm lg:text-xs xxl:text-sm rounded-full px-4 py-2 font-medium hover:bg-active_color flex gap-2 shadow-xl whitespace-nowrap ${style}`}
      >
        {children}
        {icon && icon}
      </Link>
    </div>
  );
};

export default CustomButton;
