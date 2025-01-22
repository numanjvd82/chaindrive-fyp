import React from "react";

interface IPROPS {
  text: string;
  class?: string;
  onClick?: () => void;
}

const Button: React.FC<IPROPS> = ({ text, class: className, onClick }) => {
  return (
    <div>
      <a
        onClick={onClick}
        className={`text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition ${className}`}
        aria-label="Sign up"
      >
        {text}
      </a>
    </div>
  );
};

export default Button;
