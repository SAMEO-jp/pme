export interface DateInfo {
  timestamp: number;
  week: number;
  year: number;
  month: number;
  day: number;
}

// 週番号を計算（ISO週番号）
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// 現在の日時情報を取得
export const getCurrentDateInfo = (): DateInfo => {
  const now = new Date();
  return {
    timestamp: now.getTime(),
    week: getWeekNumber(now),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
};

// 日時情報をlocalStorageに保存
export const saveDateInfoToLocalStorage = (): boolean => {
  try {
    const dateInfo = getCurrentDateInfo();
    localStorage.setItem('currentUser_dateInfo', JSON.stringify(dateInfo));
    return true;
  } catch (error) {
    console.error('Error saving date info to localStorage:', error);
    return false;
  }
};

// localStorageから日時情報を取得
export const getDateInfoFromLocalStorage = (): DateInfo | null => {
  try {
    const dateInfoString = localStorage.getItem('currentUser_dateInfo');
    if (!dateInfoString) {
      return null;
    }
    return JSON.parse(dateInfoString) as DateInfo;
  } catch (error) {
    console.error('Error retrieving date info from localStorage:', error);
    return null;
  }
}; 