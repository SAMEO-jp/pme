import { readFileSync } from 'fs';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function createKonpoTables() {
  try {
    // SQLファイルの読み込み
    const sqlPath = join(process.cwd(), 'app', 'bom', 'libs', 'create_konpo_tables.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // データベース接続
    const db = await open({
      filename: join(process.cwd(), 'data', 'achievements.db'),
      driver: sqlite3.Database
    });

    // SQLの実行
    await db.exec(sql);
    await db.close();

    console.log('梱包リストのテーブルを作成しました');
  } catch (error) {
    console.error('梱包リストのテーブル作成に失敗しました:', error);
    throw error;
  }
} 