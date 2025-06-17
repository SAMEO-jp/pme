'use client';

import { useState } from 'react';
import { createEvent } from '../../utils/eventUtils';
import { useWeekStore } from '../../store/useWeekStore';

export function DesignTabContent() {
  const { addEvent, currentYear, currentWeek } = useWeekStore();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleAddEvent = () => {
    if (!title) return;
    const newEvent = createEvent(
      title,
      new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      'design'
    );
    addEvent(newEvent);
    setTitle('');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">設計</h2>
      <div className="mb-4 space-x-2">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル" className="border p-1 rounded" />
        <input value={startTime} onChange={e => setStartTime(e.target.value)} type="time" className="border p-1 rounded" />
        <input value={endTime} onChange={e => setEndTime(e.target.value)} type="time" className="border p-1 rounded" />
        <button onClick={handleAddEvent} className="bg-blue-400 text-white px-2 py-1 rounded">追加</button>
      </div>
    </div>
  );
} 