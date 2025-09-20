import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  fullWidth?: boolean;
  variant?: "light" | "dark";
};

export const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  fullWidth = true,
  variant = "light",
}: ButtonProps) => {
  const widthClass = fullWidth ? "w-full" : "inline-flex";

  const baseClasses = `${widthClass} px-6 py-2 rounded-md font-medium cursor-pointer transition-colors duration-300 ease-in-out`;

   const variantClasses =
   variant === "light"
      ? "bg-white text-black border border-black hover:bg-black hover:text-white hover:border-white"
      : "bg-black text-white border border-white hover:bg-white hover:text-black hover:border-black";

  return (
    <button
      type={type} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};
