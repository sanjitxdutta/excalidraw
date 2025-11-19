import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export const Card = ({
  children,
  className = "",
  fullWidth = true,
}: CardProps) => {
  const widthClass = fullWidth ? "w-full" : "inline-flex";
  return (
    <div
      className={`${widthClass} p-8 bg-white rounded-xl shadow-2xl transition-all ${className}`}
    >
      {children}
    </div>
  );
};
