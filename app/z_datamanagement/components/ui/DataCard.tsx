import React, { ReactNode } from "react";

interface DataCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  children,
  className = "",
  headerAction,
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {headerAction && <div>{headerAction}</div>}
      </div>
      {children}
    </div>
  );
};

export default DataCard; 