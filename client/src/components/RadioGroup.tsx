import { forwardRef } from "react";
import Radio from "./Radio";

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  error?: string;
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ name, options, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <Radio
            ref={ref}
            {...props}
            name={name}
            key={option.value}
            label={option.label}
            error={error}
            value={option.value}
          />
        ))}
        {error && <p className="mt-1 text-error text-sm">{error}</p>}
      </div>
    );
  }
);

export default RadioGroup;
