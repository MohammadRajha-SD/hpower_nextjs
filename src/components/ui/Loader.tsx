//================ Loader.tsx ================
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative h-20 w-20">
        {/* Outer ring with gradient and pulse animation */}
        <div className="absolute inset-0 rounded-full border-4 border-interactive_color opacity-30 animate-pulse" />
        {/* Main spinning ring with gradient border */}
        <div
          className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-interactive_color border-r-active_color animate-spin"
          style={{ animationDuration: "1.2s" }}
        />
        {/* Inner dot with color transition */}{" "}
        <div className="absolute inset-0 rounded-full border-t-4 border-active_color animate-spin" />
        <div className="absolute inset-0 rounded-full border-t-4 border-active_color animate-spin-slow" />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-active_color animate-ping"
          style={{ animationDuration: "1.5s" }}
        />
      </div>
    </div>
  );
};

export default Loader;
