export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

export const EVENT_CATEGORIES = {
  meeting: {
    label: '会議',
    color: '#4CAF50',
  },
  design: {
    label: '設計',
    color: '#2196F3',
  },
  planning: {
    label: '計画',
    color: '#9C27B0',
  },
  indirect: {
    label: '間接業務',
    color: '#FF9800',
  },
  other: {
    label: 'その他',
    color: '#607D8B',
  },
  purchase: {
    label: '購買',
    color: '#E91E63',
  },
  project: {
    label: 'プロジェクト',
    color: '#00BCD4',
  },
  stakeholder: {
    label: 'ステークホルダー',
    color: '#795548',
  },
} as const;

export const GRID_SETTINGS = {
  hourHeight: 64,
  minHour: 0,
  maxHour: 24,
  timeSlotWidth: 100,
} as const; 