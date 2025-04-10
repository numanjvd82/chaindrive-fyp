import clsx from "clsx";
import React, { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className, containerClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(type !== "password");
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
      <div className={clsx("w-full mb-4", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : type}
            className={clsx(
              "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
              error
                ? "border-error focus:ring-error"
                : "border-gray-300 focus:ring-primary",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              className // Allow user-defined styles
            )}
            {...props}
          />
          {type === "password" && (
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer select-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-error text-sm">{error}</p>}
      </div>
    );
  }
);

export default Input;
