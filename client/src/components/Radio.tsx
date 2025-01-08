import React, { forwardRef } from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          className={`w-5 h-5 border rounded-full focus:outline-none focus:ring-2 ${
            error
              ? "border-error focus:ring-error"
              : "border-gray-300 focus:ring-primary"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          {...props}
        />
        {label && <span className="text-gray-700">{label}</span>}
      </div>
    );
  }
);

export default Radio;
