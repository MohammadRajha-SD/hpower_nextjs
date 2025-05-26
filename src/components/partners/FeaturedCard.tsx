import React, { useState } from "react";
import parse from "html-react-parser";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`flex-1 p-8 text-center rounded-lg shadow-md transition-all duration-300 transform ${
        isHovered ? "scale-105 shadow-lg bg-gray-100" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`mb-5 mx-auto flex justify-center transition-transform duration-300 ${
          isHovered ? "scale-110" : ""
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-xl font-bold mb-3 transition-colors duration-300 text-interactive_color`}
      >
        {title}
      </h3>
      <p className="text-gray-500 transition-opacity duration-300">
        {parse(description)}
      </p>
    </div>
  );
};

export default FeatureCard;
