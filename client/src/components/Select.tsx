import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  optionLabel?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, optionLabel, ...props }, ref) => {
    return (
      <div className="mb-4">
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
          <select
            ref={ref}
            className={`bg-transparent w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? "border-error focus:ring-error"
                : "border-gray-300 focus:ring-primary"
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            {...props}
          >
            {optionLabel && <option value="">{optionLabel}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1 text-error text-sm">{error}</p>}
      </div>
    );
  }
);

export default Select;
