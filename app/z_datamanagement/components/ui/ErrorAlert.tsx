import React from "react";

interface ErrorAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = "",
  onDismiss,
}) => {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`} role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 10.32 10.32zM10 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0-8.5a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z"/>
          </svg>
        </div>
        <div>
          <p>{message}</p>
        </div>
      </div>
      {onDismiss && (
        <span 
          className="absolute top-0 bottom-0 right-0 px-4 py-3" 
          onClick={onDismiss}
        >
          <svg 
            className="fill-current h-6 w-6 text-red-500" 
            role="button" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20"
          >
            <title>閉じる</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </span>
      )}
    </div>
  );
};

export default ErrorAlert; 