import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "blue",
  className = "",
}) => {
  const sizeMap = {
    small: "h-4 w-4 border-2",
    medium: "h-10 w-10 border-b-2",
    large: "h-16 w-16 border-4",
  };

  const colorMap = {
    blue: "border-blue-500",
    red: "border-red-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    gray: "border-gray-500",
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color as keyof typeof colorMap] || "border-blue-500";

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSize} ${spinnerColor}`}></div>
    </div>
  );
};

export default LoadingSpinner; 