import { useState, useEffect } from 'react';
import { getKintaiByWeek, updateKintaiByWeek } from '../imports';
import { DEFAULT_WORK_TIMES } from '../imports';

interface WorkTime {
  date: string;
  startTime?: string;
  endTime?: string;
}

export const useWorkTimes = (
  year: number,
  week: number,
  weekDays: Date[],
  currentUser: { employeeNumber: string; name: string }
) => {
  const [workTimes, setWorkTimes] = useState<WorkTime[]>([]);

  // 勤務時間データを初期化する関数
  const initializeWorkTimes = () => {
    // ローカルストレージから勤務時間データを取得
    const storageKey = `workTimes_${year}_${week}`;
    const savedWorkTimes = localStorage.getItem(storageKey);
    
    if (savedWorkTimes) {
      try {
        const parsedWorkTimes = JSON.parse(savedWorkTimes);
        setWorkTimes(parsedWorkTimes);
        console.log('ローカルストレージから勤務時間データを取得しました', parsedWorkTimes.length);
      } catch (error) {
        console.error('勤務時間データの解析に失敗しました:', error);
        initializeDefaultWorkTimes();
      }
    } else {
      loadWorkTimesFromDb();
    }
  };

  // データベースから勤務時間データを取得する関数
  const loadWorkTimesFromDb = async () => {
    try {
      console.log(`データベースから勤務時間データを取得します: ${year}年 第${week}週`);
      const kintaiData = await getKintaiByWeek(year, week);
      
      if (kintaiData && kintaiData.length > 0) {
        console.log('データベースから勤務時間データを取得しました', kintaiData.length);
        setWorkTimes(kintaiData);
        
        // キャッシュとして保存
        const storageKey = `workTimes_${year}_${week}`;
        localStorage.setItem(storageKey, JSON.stringify(kintaiData));
      } else {
        console.log('データベースに勤務時間データがありませんでした。デフォルト値を使用します。');
        initializeDefaultWorkTimes();
      }
    } catch (error) {
      console.error('データベースからの勤務時間データ取得に失敗しました:', error);
      initializeDefaultWorkTimes();
    }
  };

  // デフォルトの勤務時間データを初期化する関数
  const initializeDefaultWorkTimes = () => {
    // ユーザーごとのデフォルト設定を取得
    const userDefaultKey = `workTimes_default_${currentUser.employeeNumber}`;
    const userDefaults = localStorage.getItem(userDefaultKey);
    let defaultStartTimes = { ...DEFAULT_WORK_TIMES.START_TIMES };
    let defaultEndTimes = { ...DEFAULT_WORK_TIMES.END_TIMES };
    
    if (userDefaults) {
      try {
        const parsedDefaults = JSON.parse(userDefaults);
        defaultStartTimes = { ...defaultStartTimes, ...parsedDefaults.startTimes };
        defaultEndTimes = { ...defaultEndTimes, ...parsedDefaults.endTimes };
      } catch (error) {
        console.error('ユーザーデフォルト設定の解析に失敗しました:', error);
      }
    }
    
    // 週の各日のデフォルト勤務時間データを初期化
    const newWorkTimes = weekDays.map(day => {
      const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      const dayOfWeek = day.getDay(); // 0: 日曜日, 1-5: 平日, 6: 土曜日
      
      return {
        date: dateString,
        startTime: defaultStartTimes[dayOfWeek as keyof typeof defaultStartTimes] || "",
        endTime: defaultEndTimes[dayOfWeek as keyof typeof defaultEndTimes] || ""
      };
    });
    
    setWorkTimes(newWorkTimes);
    
    // キャッシュとして保存
    const storageKey = `workTimes_${year}_${week}`;
    localStorage.setItem(storageKey, JSON.stringify(newWorkTimes));
  };

  // 勤務時間変更ハンドラ
  const handleWorkTimeChange = (date: string, startTime: string, endTime: string) => {
    console.log('勤務時間変更:', { date, startTime, endTime });
    
    const updatedWorkTimes = workTimes.map(wt => 
      wt.date === date 
        ? { ...wt, startTime, endTime } 
        : wt
    );
    
    setWorkTimes(updatedWorkTimes);
    
    // ローカルストレージに保存
    const storageKey = `workTimes_${year}_${week}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedWorkTimes));
  };

  // 勤務時間データを保存する関数
  const saveWorkTimes = async () => {
    try {
      const savedKintai = await updateKintaiByWeek(year, week, workTimes);
      if (!savedKintai) {
        throw new Error("勤務時間データの保存に失敗しました");
      }
      return true;
    } catch (error) {
      console.error('勤務時間データの保存に失敗しました:', error);
      return false;
    }
  };

  return {
    workTimes,
    initializeWorkTimes,
    loadWorkTimesFromDb,
    handleWorkTimeChange,
    saveWorkTimes
  };
}; 