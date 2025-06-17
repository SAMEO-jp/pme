"use client"

import React from 'react';

export interface UserTabHeaderProps {
  activeTab: 'all' | 'position' | 'org';
  onTabChange: (tab: 'all' | 'position' | 'org') => void;
}

const UserTabHeader: React.FC<UserTabHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        <button
          onClick={() => onTabChange('all')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => onTabChange('position')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'position'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          役職別
        </button>
        <button
          onClick={() => onTabChange('org')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'org'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          組織図
        </button>
      </nav>
    </div>
  );
};

export default UserTabHeader; 