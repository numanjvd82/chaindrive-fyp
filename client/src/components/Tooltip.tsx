import React, { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  return (
    <div className="relative group inline-block">
      {children}

      <div
        className={`absolute whitespace-nowrap bg-gray-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 ${
          position === "top"
            ? "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
            : position === "bottom"
            ? "top-full left-1/2 transform -translate-x-1/2 mt-2"
            : position === "left"
            ? "right-full top-1/2 transform -translate-y-1/2 mr-2"
            : "left-full top-1/2 transform -translate-y-1/2 ml-2"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
