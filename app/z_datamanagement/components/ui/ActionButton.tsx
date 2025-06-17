import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonProps {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info";
  size?: "small" | "medium" | "large";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  isLoading?: boolean;
  tooltip?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  icon,
  isLoading = false,
  tooltip,
}) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    info: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const buttonContent = href ? (
    <Link href={href} className={baseClasses}>
      {content}
    </Link>
  ) : (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {content}
    </button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};

export default ActionButton; 