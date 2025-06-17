"use client"

import React from 'react';
import { UserData } from '../utils/organizationUtils';

interface OrganizationChartProps {
  data: UserData[];
  onUserClick: (user: UserData) => void;
}

const OrganizationChart: React.FC<OrganizationChartProps> = ({ data, onUserClick }) => {
  // 役職の優先順位を定義
  const positionOrder = {
    '所長': 1,
    '部長': 2,
    '室長': 3,
    '課長': 4,
    '主任': 5,
    '一般': 6
  };

  // 役職でソート
  const sortedData = [...data].sort((a, b) => {
    const orderA = positionOrder[a.syokui as keyof typeof positionOrder] || 999;
    const orderB = positionOrder[b.syokui as keyof typeof positionOrder] || 999;
    return orderA - orderB;
  });

  // 役職ごとにグループ化
  const groupedByPosition = sortedData.reduce((acc, user) => {
    const position = user.syokui || 'その他';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(user);
    return acc;
  }, {} as Record<string, UserData[]>);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">組織図</h2>
      <div className="space-y-6">
        {Object.entries(groupedByPosition).map(([position, users]) => (
          <div key={position} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{position}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onUserClick(user)}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.bumon}</p>
                      {user.syokui && (
                        <p className="text-xs text-gray-400">{user.syokui}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationChart; 