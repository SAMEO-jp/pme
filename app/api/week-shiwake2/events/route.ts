import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db_utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const week = searchParams.get('week');

  if (!year || !week) {
    return NextResponse.json(
      { success: false, message: '年と週を指定してください' },
      { status: 400 }
    );
  }

  const db = await getDbConnection();
  try {
    // 週の開始日と終了日を計算
    const startDate = new Date(parseInt(year), 0, 1);
    const firstDayOfWeek = startDate.getDay();
    const weekStart = new Date(startDate);
    weekStart.setDate(1 + (parseInt(week) - 1) * 7 - firstDayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // イベントデータを取得
    const events = await db.all(`
      SELECT 
        id,
        title,
        startDateTime,
        endDateTime,
        color
      FROM m_events
      WHERE startDateTime >= ? AND startDateTime <= ?
      ORDER BY startDateTime ASC
    `, [weekStart.toISOString(), weekEnd.toISOString()]);

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('イベントデータの取得に失敗:', error);
    return NextResponse.json(
      { success: false, message: 'イベントデータの取得に失敗しました' },
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const week = searchParams.get('week');

  if (!year || !week) {
    return NextResponse.json(
      { success: false, message: '年と週を指定してください' },
      { status: 400 }
    );
  }

  try {
    const { events } = await request.json();
    if (!Array.isArray(events)) {
      return NextResponse.json(
        { success: false, message: 'イベントデータが不正です' },
        { status: 400 }
      );
    }

    const db = await getDbConnection();
    try {
      await db.run('BEGIN TRANSACTION');

      // 既存のイベントを削除
      await db.run(`
        DELETE FROM m_events
        WHERE startDateTime >= ? AND startDateTime <= ?
      `, [
        new Date(parseInt(year), 0, 1).toISOString(),
        new Date(parseInt(year), 11, 31).toISOString()
      ]);

      // 新しいイベントを追加
      for (const event of events) {
        await db.run(`
          INSERT INTO m_events (id, title, startDateTime, endDateTime, color)
          VALUES (?, ?, ?, ?, ?)
        `, [
          event.id,
          event.title,
          event.startDateTime,
          event.endDateTime,
          event.color || null
        ]);
      }

      await db.run('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('イベントデータの保存に失敗:', error);
    return NextResponse.json(
      { success: false, message: 'イベントデータの保存に失敗しました' },
      { status: 500 }
    );
  }
} 