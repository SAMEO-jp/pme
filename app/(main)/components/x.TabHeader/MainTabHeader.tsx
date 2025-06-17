'use client';

import React from 'react';

interface MainTabHeaderProps {
  title?: string;
  currentTab?: string;
  children?: React.ReactNode;
}

export const MainTabHeader: React.FC<MainTabHeaderProps> = ({ title, currentTab, children }) => {
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title || currentTab}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainTabHeader; 