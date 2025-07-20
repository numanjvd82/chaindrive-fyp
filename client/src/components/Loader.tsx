import clsx from "clsx";
import { motion } from "motion/react";

const Loader = ({
  size = "md",
  color = "text-white",
  className = "",
  variant = "spinner",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  variant?: "spinner" | "dots" | "pulse" | "bars";
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const dotSizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const barSizeClasses = {
    sm: "w-1 h-4",
    md: "w-1.5 h-6",
    lg: "w-2 h-8",
    xl: "w-3 h-10",
  };

  if (variant === "dots") {
    return (
      <div className={clsx("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(dotSizeClasses[size], "bg-current rounded-full", color)}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={clsx(sizeClasses[size], "bg-current rounded-full", color, className)}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
    );
  }

  if (variant === "bars") {
    return (
      <div className={clsx("flex space-x-1 items-end", className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={clsx(barSizeClasses[size], "bg-current rounded-t", color)}
            animate={{
              scaleY: [1, 0.3, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  // Default spinner variant
  return (
    <motion.svg
      className={clsx("animate-spin", sizeClasses[size], color, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </motion.svg>
  );
};

export default Loader;
