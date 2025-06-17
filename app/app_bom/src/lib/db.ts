import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) {
    return db;
  }

  console.log('データベースに接続します...');
  console.log('データベースファイル:', 'data/achievements.db');
  
  db = await open({
    filename: 'data/achievements.db',
    driver: sqlite3.Database
  });
  console.log('データベースに接続しました');

  // テーブルの存在確認
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('存在するテーブル:', tables);

  // BOM_PARTテーブルの構造確認
  const tableInfo = await db.all("PRAGMA table_info(BOM_PART)");
  console.log('BOM_PARTテーブルの構造:', tableInfo);

  // BOM_PARTテーブルの全レコードを確認
  const allParts = await db.all("SELECT * FROM BOM_PART");
  console.log('BOM_PARTの全レコード数:', allParts.length);
  console.log('BOM_PARTの最初の5件:', allParts.slice(0, 5));

  return db;
}

export async function closeDb() {
  if (db) {
    await db.close();
    db = null;
  }
}

// 梱包単位関連のクエリ
export async function getKonpoUnits(projectNumber: string) {
  const db = await getDb();
  
  const query = `
    SELECT 
      ROWID,
      KONPO_TANNI_ID,
      ZUMEN_ID,
      PART_ID,
      PART_KO,
      ZENSU_KO,
      KONPO_LIST_ID
    FROM KONPO_TANNI 
  `;

  const units = await db.all(query);
  return units;
}

export async function createKonpoUnit(projectNumber: string, data: {
  PART_ID: string;
  ZUMEN_ID: string;
  PART_KO: string;
  ZENSU_KO: string;
}) {
  const db = await getDb();
  const konpoTanniId = `KT-${Date.now()}`; // 一時的なID生成
  return db.run(`
    INSERT INTO KONPO_TANNI (
      KONPO_TANNI_ID,
      ZUMEN_ID,
      PART_ID,
      PART_KO,
      ZENSU_KO,
      KONPO_LIST_ID
    ) VALUES (?, ?, ?, ?, ?, NULL)
  `, [konpoTanniId, data.ZUMEN_ID, data.PART_ID, data.PART_KO, data.ZENSU_KO]);
}

export async function updateKonpoUnit(projectNumber: string, data: {
  ROWID: number;
  PART_KO: string;
  ZENSU_KO: string;
}) {
  const db = await getDb();
  return db.run(`
    UPDATE KONPO_TANNI 
    SET PART_KO = ?, ZENSU_KO = ?
    WHERE ROWID = ? AND KONPO_LIST_ID = ?
  `, [data.PART_KO, data.ZENSU_KO, data.ROWID, projectNumber]);
}

export async function deleteKonpoUnit(projectNumber: string, rowId: number) {
  const db = await getDb();
  return db.run(`
    DELETE FROM KONPO_TANNI 
    WHERE ROWID = ? AND KONPO_LIST_ID = ?
  `, [rowId, projectNumber]);
}

// 梱包リスト関連のクエリ
export async function getKonpoLists(projectNumber: string) {
  const db = await getDb();
  return db.all(`
    SELECT * FROM konpo_list 
    WHERE PROJECT_ID = ?
  `, [projectNumber]);
}

export async function createKonpoList(projectNumber: string, data: {
  KONPO_LIST_ID: string;
  KONPO_LIST_WEIGHT: number;
}) {
  const db = await getDb();
  return db.run(`
    INSERT INTO konpo_list (
      PROJECT_ID, KONPO_LIST_ID, KONPO_LIST_WEIGHT
    ) VALUES (?, ?, ?)
  `, [projectNumber, data.KONPO_LIST_ID, data.KONPO_LIST_WEIGHT]);
}

// 未連携部品の取得
export async function getUnlinkedParts(projectNumber: string) {
  console.log('未連携部品の取得を開始');
  const db = await getDb();

  // BOM_PARTの全レコード確認
  const allParts = await db.all("SELECT * FROM BOM_PART");
  console.log('BOM_PARTの全レコード数:', allParts.length);
  console.log('BOM_PARTの最初の5件:', allParts.slice(0, 5));

  // KONPO_TANNIの全レコード確認
  const allUnits = await db.all("SELECT * FROM KONPO_TANNI");
  console.log('KONPO_TANNIの全レコード数:', allUnits.length);
  console.log('KONPO_TANNIの最初の5件:', allUnits.slice(0, 5));

  const query = `
    SELECT p.* 
    FROM BOM_PART p
    LEFT JOIN KONPO_TANNI ku ON p.PART_ID = ku.PART_ID
    WHERE ku.PART_ID IS NULL
  `;
  console.log('実行するクエリ:', query);

  const parts = await db.all(query);
  console.log('取得した未連携部品数:', parts.length);
  console.log('取得した未連携部品の最初の5件:', parts.slice(0, 5));
  
  return parts;
}

// 未連携部品の数を取得
export async function getUnlinkedPartsCount(projectNumber: string) {
  console.log('未連携部品数のカウントを開始');
  const db = await getDb();
  
  // BOM_PARTテーブルの全レコード数を確認
  const totalParts = await db.get('SELECT COUNT(*) as count FROM BOM_PART');
  console.log('BOM_PARTの全レコード数:', totalParts?.count);

  // KONPO_TANNIテーブルの全レコード数を確認
  const totalKonpoUnits = await db.get('SELECT COUNT(*) as count FROM KONPO_TANNI');
  console.log('KONPO_TANNIの全レコード数:', totalKonpoUnits?.count);

  const result = await db.get(`
    SELECT COUNT(*) as count
    FROM BOM_PART p
    LEFT JOIN KONPO_TANNI ku ON p.PART_ID = ku.PART_ID
    WHERE ku.PART_ID IS NULL
  `);
  console.log('未連携部品数:', result?.count);
  
  return result?.count || 0;
}

// 梱包単位の重量更新
export async function updateKonpoUnitWeights(projectNumber: string) {
  const db = await getDb();
  return db.run(`
    UPDATE KONPO_TANNI
    SET BUZAI_WEIGHT = (
      SELECT PART_TANNI_WEIGHT 
      FROM BOM_PART 
      WHERE BOM_PART.PART_ID = KONPO_TANNI.PART_ID
    ),
    TOTAL_WEIGHT = BUZAI_WEIGHT * PART_KO * ZENSU_KO
    WHERE KONPO_LIST_ID = ?
  `, [projectNumber]);
}

// 部品情報の更新
export async function refreshParts(projectNumber: string) {
  const db = await getDb();
  return db.run(`
    UPDATE KONPO_TANNI
    SET PART_NAME = (
      SELECT PART_NAME 
      FROM BOM_PART 
      WHERE BOM_PART.PART_ID = KONPO_TANNI.PART_ID
    )
    WHERE KONPO_LIST_ID = ?
  `, [projectNumber]);
}

// BOM_PARTテーブルのデータを取得
export async function getBomParts(projectNumber: string) {
  console.log('BOM_PARTの取得を開始:', projectNumber);
  const db = await getDb();
  
  // テーブルの構造確認
  const tableInfo = await db.all("PRAGMA table_info(BOM_PART)");
  console.log('BOM_PARTテーブルの構造:', tableInfo);

  // 全レコードの確認
  const allParts = await db.all("SELECT * FROM BOM_PART");
  console.log('BOM_PARTの全レコード数:', allParts.length);
  console.log('BOM_PARTの最初の5件:', allParts.slice(0, 5));
  
  const query = `
    SELECT 
      PART_ID,
      PART_NAME,
      PART_TANNI_WEIGHT,
      MANUFACTURER,
      ZUMEN_ID,
      PART_TYPE,
      PART_SIZE,
      PART_MATERIAL,
      PART_SURFACE,
      PART_REMARKS,
      PART_COUNT,
      PART_UNIT,
      PART_PRICE,
      PART_TOTAL_PRICE,
      PART_ORDER_NO,
      PART_ORDER_DATE,
      PART_DELIVERY_DATE,
      PART_STATUS,
      PART_LOCATION,
      PART_SUPPLIER,
      PART_SUPPLIER_CONTACT,
      PART_SUPPLIER_TEL,
      PART_SUPPLIER_EMAIL,
      PART_SUPPLIER_ADDRESS,
      PART_SUPPLIER_REMARKS
    FROM BOM_PART
    ORDER BY PART_ID
  `;
  console.log('実行するクエリ:', query);

  const parts = await db.all(query);
  console.log('取得したBOM_PARTの最初の5件:', parts.slice(0, 5));
  console.log('取得したBOM_PARTのカラム:', Object.keys(parts[0] || {}));
  
  return parts;
}