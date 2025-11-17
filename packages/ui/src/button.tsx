import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
  variant?: "light" | "dark";
};

export const Button = ({
  children,
  onClick,
  type = "button",
  fullWidth = true,
  variant = "light",
}: ButtonProps) => {
  const widthClass = fullWidth ? "w-full" : "inline-flex";

  const lightVariant = `
    bg-white text-black border border-white
    hover:bg-black hover:text-white
  `;

  const darkVariant = `
    bg-white text-black border border-black
    hover:bg-black hover:text-white
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${widthClass}
        px-6 py-2 rounded-md font-medium
        transition-all duration-300 ease-in-out

        ${variant === "light" ? lightVariant : darkVariant}
      `}
    >
      {children}
    </button>
  );
};
