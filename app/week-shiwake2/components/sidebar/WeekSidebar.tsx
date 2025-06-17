'use client';

import { useState } from 'react';
import { useWeekStore } from '../../store/useWeekStore';
import { EVENT_CATEGORIES } from '../../utils/constants';
import { IndirectTabContent } from './IndirectTabContent';
import { MeetingTabContent } from './MeetingTabContent';
import { DesignTabContent } from './DesignTabContent';
import { PlanningTabContent } from './PlanningTabContent';
import { OtherTabContent } from './OtherTabContent';
import { PurchaseTabContent } from './PurchaseTabContent';
import { ProjectTabContent } from './ProjectTabContent';
import { StakeholderTabContent } from './StakeholderTabContent';

export function WeekSidebar() {
  const [activeTab, setActiveTab] = useState<keyof typeof EVENT_CATEGORIES>('meeting');
  const { currentYear, currentWeek, setCurrentYear, setCurrentWeek } = useWeekStore();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentWeek(parseInt(e.target.value));
  };

  return (
    <div className="w-80 bg-white border-r h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <select
            value={currentYear}
            onChange={handleYearChange}
            className="border rounded p-1"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
          <select
            value={currentWeek}
            onChange={handleWeekChange}
            className="border rounded p-1"
          >
            {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
              <option key={week} value={week}>
                第{week}週
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* タブ */}
      <div className="flex border-b">
        {Object.entries(EVENT_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as keyof typeof EVENT_CATEGORIES)}
            className={`flex-1 p-2 text-sm ${
              activeTab === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'meeting' && <MeetingTabContent />}
        {activeTab === 'design' && <DesignTabContent />}
        {activeTab === 'planning' && <PlanningTabContent />}
        {activeTab === 'indirect' && <IndirectTabContent />}
        {activeTab === 'other' && <OtherTabContent />}
        {activeTab === 'purchase' && <PurchaseTabContent />}
        {activeTab === 'project' && <ProjectTabContent />}
        {activeTab === 'stakeholder' && <StakeholderTabContent />}
      </div>
    </div>
  );
} 