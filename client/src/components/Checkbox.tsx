import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  children?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, children, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={`w-5 h-5 border rounded-md focus:outline-none focus:ring-2 ${
              error
                ? "border-error focus:ring-error"
                : "border-gray-300 focus:ring-primary"
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            {...props}
          />
          {label && <span className="text-gray-700">{label}</span>}
          {children && <div className="text-gray-700">{children}</div>}
        </label>
        {error && <p className="mt-1 text-error text-sm">{error}</p>}
      </div>
    );
  }
);

export default Checkbox;
