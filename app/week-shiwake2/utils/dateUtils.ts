/**
 * 指定された年と週から、その週の開始日と終了日を取得する
 */
export function getWeekDates(year: number, week: number) {
  // 1月1日を基準に計算
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfWeek = firstDayOfYear.getDay(); // 0: 日曜日, 1: 月曜日, ...

  // その年の最初の週の開始日（月曜日）を計算
  const firstWeekStart = new Date(year, 0, 1 + (1 - firstDayOfWeek + 7) % 7);

  // 指定された週の開始日を計算
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7);

  // 週の終了日（日曜日）を計算
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    startDate: weekStart,
    endDate: weekEnd
  };
}

/**
 * 開始日から終了日までの日付配列を取得する
 */
export function getWeekDaysArray(startDate: Date, endDate: Date) {
  const days: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * 日付を「MM/DD (曜日)」形式でフォーマットする
 */
export function formatDayWithWeekday(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}/${day} (${weekday})`;
}

/**
 * 日付を「YYYY-MM-DD」形式でフォーマットする
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimeString(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const firstWeekday = firstDayOfYear.getDay();
  const firstMonday = new Date(date.getFullYear(), 0, 1 + (8 - firstWeekday) % 7);
  const diff = date.getTime() - firstMonday.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
} 