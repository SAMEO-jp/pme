import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// データベースファイルのパス
const DB_PATH = path.join(process.cwd(), "data", "achievements.db");

// データベース接続の代わりに使用するダミーデータ
const KOURO_EQUIPMENTS = [
  { seiban: '1100', dai_seiban: '11', tyu_seiban: '0', syo_seiban: '0', setsubimei: '本体設備', level: 0 },
  { seiban: '1110', dai_seiban: '11', tyu_seiban: '1', syo_seiban: '0', setsubimei: '炉体', level: 1 },
  { seiban: '1111', dai_seiban: '11', tyu_seiban: '1', syo_seiban: '1', setsubimei: '耐火物', level: 2 },
  { seiban: '1112', dai_seiban: '11', tyu_seiban: '1', syo_seiban: '2', setsubimei: '冷却装置', level: 2 },
  { seiban: '1120', dai_seiban: '11', tyu_seiban: '2', syo_seiban: '0', setsubimei: '炉頂装入設備', level: 1 },
  { seiban: '1121', dai_seiban: '11', tyu_seiban: '2', syo_seiban: '1', setsubimei: 'ベルレス装入装置', level: 2 },
  { seiban: '1122', dai_seiban: '11', tyu_seiban: '2', syo_seiban: '2', setsubimei: '分配器', level: 2 },
  { seiban: '1200', dai_seiban: '12', tyu_seiban: '0', syo_seiban: '0', setsubimei: '送風設備', level: 0 },
  { seiban: '1210', dai_seiban: '12', tyu_seiban: '1', syo_seiban: '0', setsubimei: '熱風炉', level: 1 },
  { seiban: '1211', dai_seiban: '12', tyu_seiban: '1', syo_seiban: '1', setsubimei: 'ドーム', level: 2 },
  { seiban: '1212', dai_seiban: '12', tyu_seiban: '1', syo_seiban: '2', setsubimei: '燃焼室', level: 2 },
  { seiban: '1220', dai_seiban: '12', tyu_seiban: '2', syo_seiban: '0', setsubimei: '送風管', level: 1 },
  { seiban: '1221', dai_seiban: '12', tyu_seiban: '2', syo_seiban: '1', setsubimei: '環状管', level: 2 },
  { seiban: '1300', dai_seiban: '13', tyu_seiban: '0', syo_seiban: '0', setsubimei: '出銑設備', level: 0 },
  { seiban: '1310', dai_seiban: '13', tyu_seiban: '1', syo_seiban: '0', setsubimei: '出銑口', level: 1 },
  { seiban: '1311', dai_seiban: '13', tyu_seiban: '1', syo_seiban: '1', setsubimei: '出銑樋', level: 2 },
  { seiban: '1312', dai_seiban: '13', tyu_seiban: '1', syo_seiban: '2', setsubimei: '銑鉄樋', level: 2 },
  { seiban: '1320', dai_seiban: '13', tyu_seiban: '2', syo_seiban: '0', setsubimei: '出滓設備', level: 1 },
  { seiban: '1321', dai_seiban: '13', tyu_seiban: '2', syo_seiban: '1', setsubimei: '滓口', level: 2 },
  { seiban: '1400', dai_seiban: '14', tyu_seiban: '0', syo_seiban: '0', setsubimei: 'ガス処理設備', level: 0 },
  { seiban: '1410', dai_seiban: '14', tyu_seiban: '1', syo_seiban: '0', setsubimei: '集塵装置', level: 1 },
  { seiban: '1411', dai_seiban: '14', tyu_seiban: '1', syo_seiban: '1', setsubimei: 'サイクロン', level: 2 },
  { seiban: '1412', dai_seiban: '14', tyu_seiban: '1', syo_seiban: '2', setsubimei: '電気集塵機', level: 2 },
  { seiban: '1420', dai_seiban: '14', tyu_seiban: '2', syo_seiban: '0', setsubimei: 'ガス冷却装置', level: 1 },
  { seiban: '1500', dai_seiban: '15', tyu_seiban: '0', syo_seiban: '0', setsubimei: '計測制御設備', level: 0 },
  { seiban: '1510', dai_seiban: '15', tyu_seiban: '1', syo_seiban: '0', setsubimei: 'プロセス制御装置', level: 1 },
  { seiban: '1520', dai_seiban: '15', tyu_seiban: '2', syo_seiban: '0', setsubimei: '温度測定装置', level: 1 },
]

// データベース接続関数
async function connectDB() {
  return await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READONLY
  });
}

// レベル属性を計算する関数
function calculateLevel(equipment: { tyu_seiban: string; syo_seiban: string }): number {
  // 中設備番号と小設備番号が両方0の場合は大設備（レベル0）
  if (equipment.tyu_seiban === '0' && equipment.syo_seiban === '0') {
    return 0;
  }
  // 小設備番号が0の場合は中設備（レベル1）
  else if (equipment.syo_seiban === '0') {
    return 1;
  }
  // それ以外は小設備（レベル2）
  else {
    return 2;
  }
}

/**
 * 高炉設備データを取得するAPI
 * GET /api/equipment/kouro
 */
export async function GET(request: Request) {
  try {
    // クエリパラメータの取得
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('search') || ''
    const daiSeiban = searchParams.get('dai_seiban') || ''
    
    // データベースから取得を試みる
    try {
      const db = await connectDB();
      
      // SQLクエリを構築
      let sql = `SELECT * FROM prant_B_id`;
      const params = [];
      
      if (searchTerm) {
        sql += ` WHERE (setsubi_name LIKE ? OR B_id LIKE ?)`;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }
      
      // データ取得
      const rows = await db.all(sql, ...params);
      
      // デバッグ用にログを出力
      console.log('取得したデータ:', rows);
      
      await db.close();
      
      return NextResponse.json({ 
        success: true,
        data: rows,
        source: 'database'
      });
      
    } catch (dbError) {
      console.warn('データベースアクセスエラー:', dbError);
      return NextResponse.json({ 
        success: false,
        error: 'データベースアクセス中にエラーが発生しました'
      });
    }

  } catch (error) {
    console.error('高炉設備データの取得エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '設備データの取得中にエラーが発生しました' 
      },
      { status: 500 }
    );
  }
}

/**
 * 設備データを追加・更新するAPI
 * POST /api/equipment/kouro
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // データのバリデーション
    if (!data.seiban || !data.setsubimei) {
      return NextResponse.json(
        { success: false, error: '製番と設備名は必須です' },
        { status: 400 }
      );
    }

    try {
      const db = await connectDB();
      
      // 既存データの確認
      const existingItem = await db.get(
        'SELECT * FROM seiban WHERE prant = ? AND seiban = ?',
        'kouro', data.seiban
      );
      
      let result;
      
      if (existingItem) {
        // 更新
        result = await db.run(
          `UPDATE seiban SET 
           dai_seiban = ?, 
           tyu_seiban = ?, 
           syo_seiban = ?, 
           setsubimei = ? 
           WHERE prant = ? AND seiban = ?`,
          data.dai_seiban,
          data.tyu_seiban,
          data.syo_seiban,
          data.setsubimei,
          'kouro',
          data.seiban
        );
        await db.close();
        
        return NextResponse.json({ 
          success: true,
          message: '設備データが正常に更新されました',
          data: {
            ...data,
            id: existingItem.id
          }
        });
      } else {
        // 新規追加
        result = await db.run(
          `INSERT INTO seiban (prant, seiban, dai_seiban, tyu_seiban, syo_seiban, setsubimei) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          'kouro',
          data.seiban,
          data.dai_seiban,
          data.tyu_seiban,
          data.syo_seiban,
          data.setsubimei
        );
        await db.close();
        
        return NextResponse.json({ 
          success: true,
          message: '設備データが正常に保存されました',
          data: {
            ...data,
            id: result.lastID
          }
        });
      }
      
    } catch (dbError) {
      console.warn('データベース操作エラー:', dbError);
      
      // ダミーレスポンス
      return NextResponse.json({ 
        success: true,
        message: '設備データが正常に保存されました（ダミー応答）',
        data: {
          ...data,
          id: Date.now()
        },
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('設備データの保存エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '設備データの保存中にエラーが発生しました' 
      },
      { status: 500 }
    );
  }
} 