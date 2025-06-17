// 週番号を計算（ISO週番号）
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// 現在の週番号を取得
export const getCurrentWeek = (): number => {
  return getWeekNumber(new Date());
};

// 日付から週の開始日と終了日を取得
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  const end = new Date(d.setDate(diff + 6));
  return { start, end };
};

// 週の日付を取得
export const getWeekDates = (year: number, week: number): { startDate: Date; endDate: Date } => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const startDate = new Date(date.setDate(diff));
  const endDate = new Date(date.setDate(diff + 6));
  return { startDate, endDate };
};

// 日付を短い形式でフォーマット
export const formatDateShort = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}; 