import clsx from "clsx"; // Use clsx for conditional class management
import React, { PropsWithChildren } from "react";
import Loader from "./Loader";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean; // Loading state
  className?: string; // Custom classes
  children?: React.ReactNode;
}

const Button: React.FC<
  PropsWithChildren<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>
> = ({
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  ...rest
}) => {
  // Base styles
  const baseStyles =
    "font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center";

  // Variant styles
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary:
      "bg-gray-500 text-gray-700 hover:bg-gray-400 focus:ring-gray-300",
    link: "bg-transparent text-blue-500 hover:underline focus:ring-transparent",
  };

  // Size styles
  const sizeStyles = {
    sm: "text-sm py-[2px] px-4",
    md: "text-md py-[4px] px-6",
    lg: "text-lg py-[6px] px-8",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={isLoading || rest.disabled} // Disable button if loading
      {...rest}
    >
      {isLoading ? <Loader /> : rest.children}
    </button>
  );
};

export default Button;
