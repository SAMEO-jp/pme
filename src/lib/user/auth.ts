import { db } from '../db';

/**
 * ユーザーを認証する関数
 * @param userId 認証するユーザーID
 * @returns 認証されたユーザー情報
 */
export async function authenticateUser(userId: string) {
  try {
    const user = await db.get(`
      SELECT user_id, name_japanese
      FROM all_user
      WHERE user_id = ?
    `, [userId]);

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    // 現在のユーザーIDを設定
    await db.run(
      'INSERT OR REPLACE INTO app_settings (key, value, description) VALUES (?, ?, ?)',
      ['Now_userID', userId, '現在ログイン中のユーザーID']
    );

    return {
      user_id: user.user_id,
      name: user.name_japanese
    };
  } catch (error) {
    console.error('ユーザー認証エラー:', error);
    throw error;
  }
}

/**
 * 現在のユーザー情報を取得する関数
 * @returns 現在のユーザー情報
 */
export async function getCurrentUser() {
  try {
    const currentUserId = await db.get(
      'SELECT value FROM app_settings WHERE key = "Now_userID"'
    );

    if (!currentUserId) {
      return null;
    }

    const user = await db.get(`
      SELECT user_id, name_japanese
      FROM all_user
      WHERE user_id = ?
    `, [currentUserId.value]);

    return user ? {
      user_id: user.user_id,
      name: user.name_japanese
    } : null;
  } catch (error) {
    console.error('現在のユーザー情報取得エラー:', error);
    return null;
  }
}

/**
 * ログアウトする関数
 */
export async function logout() {
  try {
    await db.run(
      'DELETE FROM app_settings WHERE key = "Now_userID"'
    );
  } catch (error) {
    console.error('ログアウトエラー:', error);
    throw error;
  }
} 