import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db_utils';
import { getWeekDates, formatDate } from '@/app/week-shiwake2/utils/dateUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const week = searchParams.get('week');
  
  try {
    // パラメータのバリデーション
    const yearNum = Number.parseInt(year || '');
    const weekNum = Number.parseInt(week || '');
    
    if (isNaN(yearNum) || isNaN(weekNum)) {
      return NextResponse.json({ success: false, message: "無効なパラメータです" }, { status: 400 });
    }
    
    const db = await getDbConnection();
    
    try {
      // 週の開始日と終了日を取得
      const { startDate, endDate } = getWeekDates(yearNum, weekNum);
      
      // 勤務時間データを取得
      let workTimes = await db.all(
        `SELECT date, 
                strftime('%H:%M', clock_in) as startTime,
                strftime('%H:%M', clock_out) as endTime
         FROM m_kintai 
         WHERE date BETWEEN ? AND ?
         ORDER BY date`,
        [formatDate(startDate), formatDate(endDate)]
      );
      
      // データが存在しない場合はテストデータを生成
      if (workTimes.length === 0) {
        console.log('テストデータを生成します...');
        const testData = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          // 土日はスキップ
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dateStr = formatDate(currentDate);
            testData.push({
              date: dateStr,
              startTime: '09:00',
              endTime: '18:00'
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // テストデータをデータベースに登録
        await db.run('BEGIN TRANSACTION');
        try {
          for (const data of testData) {
            await db.run(
              `INSERT INTO m_kintai 
               (user_id, date, clock_in, clock_out, break_minutes, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
              ['338782', data.date, `${data.date} ${data.startTime}:00`, `${data.date} ${data.endTime}:00`, 60, '出勤']
            );
          }
          await db.run('COMMIT');
          workTimes = testData;
        } catch (error) {
          await db.run('ROLLBACK');
          throw error;
        }
      }
      
      return NextResponse.json({ success: true, data: workTimes });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('勤務時間データの取得中にエラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーの詳細:', error.message);
      console.error('エラーのスタックトレース:', error.stack);
    }
    return NextResponse.json(
      { success: true, data: [] },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const week = searchParams.get('week');
  
  try {
    // パラメータのバリデーション
    const yearNum = Number.parseInt(year || '');
    const weekNum = Number.parseInt(week || '');
    
    if (isNaN(yearNum) || isNaN(weekNum)) {
      return NextResponse.json({ success: false, message: "無効なパラメータです" }, { status: 400 });
    }
    
    // リクエストボディを取得
    const body = await request.json();
    const { workTimes } = body;
    
    if (!Array.isArray(workTimes) || workTimes.length === 0) {
      return NextResponse.json({ success: false, message: "無効な勤怠データです" }, { status: 400 });
    }
    
    const db = await getDbConnection();
    
    try {
      // トランザクション開始
      await db.run('BEGIN TRANSACTION');
      
      // 各日のデータを更新
      for (const data of workTimes) {
        const { date, startTime, endTime } = data;
        
        // 日付の形式を検証
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          continue; // 無効な日付はスキップ
        }
        
        // clock_inとclock_outを生成
        const clockIn = startTime ? `${date} ${startTime}:00` : null;
        const clockOut = endTime ? `${date} ${endTime}:00` : null;
        
        // 現在のデータを取得
        const existingData = await db.get(
          "SELECT * FROM m_kintai WHERE date = ?",
          [date]
        );
        
        if (existingData) {
          // 既存データを更新
          await db.run(
            `UPDATE m_kintai 
             SET clock_in = ?, clock_out = ?, updated_at = datetime('now', 'localtime')
             WHERE date = ?`,
            [clockIn, clockOut, date]
          );
        } else if (clockIn || clockOut) {
          // 新規データ（時間がある場合のみ）を作成
          await db.run(
            `INSERT INTO m_kintai 
             (date, clock_in, clock_out, break_minutes, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
            [date, clockIn, clockOut, 60, '出勤']
          );
        }
      }
      
      // トランザクションをコミット
      await db.run('COMMIT');
      
      // 更新後のデータを取得
      const { startDate, endDate } = getWeekDates(yearNum, weekNum);
      const updatedData = await db.all(
        `SELECT date, 
                strftime('%H:%M', clock_in) as startTime,
                strftime('%H:%M', clock_out) as endTime
         FROM m_kintai 
         WHERE date BETWEEN ? AND ?
         ORDER BY date`,
        [formatDate(startDate), formatDate(endDate)]
      );
      
      return NextResponse.json({ success: true, data: updatedData });
    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK');
      throw error;
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('勤務時間データの更新中にエラーが発生しました:', error);
    return NextResponse.json(
      { success: false, message: "勤務時間データの更新に失敗しました" },
      { status: 500 }
    );
  }
} 