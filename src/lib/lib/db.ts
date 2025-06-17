import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// データベースファイルのパスを設定
const dbPath = path.join(process.cwd(), 'data', 'achievements.db');

// データベース接続を初期化
const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database
});

// データベース操作のためのヘルパー関数
export const db = {
  async all(sql: string, params: any[] = []) {
    const db = await dbPromise;
    return db.all(sql, params);
  },

  async get(sql: string, params: any[] = []) {
    const db = await dbPromise;
    return db.get(sql, params);
  },

  async run(sql: string, params: any[] = []) {
    const db = await dbPromise;
    return db.run(sql, params);
  }
}; 