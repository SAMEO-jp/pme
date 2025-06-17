import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // ユーザーの存在確認
    const user = await db.get(`
      SELECT user_id, name_japanese
      FROM all_user
      WHERE user_id = ?
    `, [userId]);

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 現在のユーザーIDを設定
    await db.run(
      'INSERT OR REPLACE INTO app_settings (key, value, description) VALUES (?, ?, ?)',
      ['Now_userID', userId, '現在ログイン中のユーザーID']
    );

    return NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name_japanese
      }
    });
  } catch (error) {
    console.error('ユーザー認証エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー認証に失敗しました' },
      { status: 500 }
    );
  }
} 