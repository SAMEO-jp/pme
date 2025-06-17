import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface AllUser {
  user_id: string;
  name_japanese: string;
  TEL: string;
  mail: string;
  name_english: string;
  name_yomi: string;
  company: string;
  bumon: string;
  in_year: string;
  Kengen: string;
  TEL_naisen: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'ユーザーIDが指定されていません'
      }, { status: 400 });
    }

    // 必要なカラムのみを取得
    const user = await db.get(
      `SELECT 
        user_id,
        name_japanese,
        TEL,
        mail,
        name_english,
        name_yomi,
        company,
        bumon,
        in_year,
        Kengen,
        TEL_naisen,
        sitsu,
        ka,
        syokui
      FROM all_user 
      WHERE user_id = ?`,
      [userId]
    ) as AllUser | undefined;

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'ユーザーが見つかりません'
      }, { status: 404 });
    }

    // 現在の日時情報を取得
    const now = new Date();
    const currentTime = now.getTime();
    
    // 週番号を計算（ISO週番号）
    const getWeekNumber = (date: Date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    // 日付情報を一つのオブジェクトにまとめる
    const dateInfo = {
      timestamp: currentTime,
      week: getWeekNumber(now),
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };

    // レスポンスデータを最適化
    const responseData = {
      user_id: user.user_id,
      name_japanese: user.name_japanese,
      TEL: user.TEL,
      mail: user.mail,
      name_english: user.name_english,
      name_yomi: user.name_yomi,
      company: user.company,
      bumon: user.bumon,
      in_year: user.in_year,
      Kengen: user.Kengen,
      TEL_naisen: user.TEL_naisen,
      sitsu: user.sitsu,
      ka: user.ka,
      syokui: user.syokui,
      dateInfo: dateInfo
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました:', error);
    return NextResponse.json({
      success: false,
      message: 'ユーザー情報の取得中にエラーが発生しました',
      error: String(error)
    }, { status: 500 });
  }
}
