"use client"

import React from 'react';
import { UserData, Position, POSITION_ORDER } from '../utils/organizationUtils';

interface PositionGroupsProps {
  groups: Record<Position, UserData[]>;
  onUserClick?: (user: UserData) => void;
}

const PositionGroups: React.FC<PositionGroupsProps> = ({ groups, onUserClick }) => {
  return (
    <div className="p-4 space-y-6">
      {POSITION_ORDER.map(position => {
        const users = groups[position];
        if (!users || users.length === 0) return null;

        return (
          <div key={position} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">{position}</h3>
            </div>
            <div className="divide-y">
              {users.map(user => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onUserClick?.(user)}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">
                    {user.department && `${user.department}`}
                    {user.section && ` - ${user.section}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PositionGroups; 