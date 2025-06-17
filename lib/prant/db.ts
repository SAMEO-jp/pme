import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import fs from 'fs'
import path from 'path'

// データベースファイルへのパス
const dbPath = path.resolve(process.cwd(), 'prant.db')

// データベース接続を初期化する関数
export async function openDb() {
  // データベースファイルが存在しない場合は初期化する
  const dbExists = fs.existsSync(dbPath)
  
  // SQLiteデータベースへの接続を開く
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  
  // 初回実行時にテーブルを作成
  if (!dbExists) {
    await initDb(db)
  }
  
  return db
}

// データベースを初期化する関数
async function initDb(db) {
  console.log('Initializing Prant database...')
  
  // 設備テーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS equipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT,
      installation_date TEXT,
      manufacturer TEXT,
      model TEXT,
      specifications TEXT,
      status TEXT DEFAULT 'operational',
      last_maintenance_date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 設備運転データテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS equipment_operations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER NOT NULL,
      operation_date TEXT NOT NULL,
      temperature REAL,
      pressure REAL,
      production_rate REAL,
      energy_consumption REAL,
      operator_id TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    )
  `)
  
  // 設備保全テーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER NOT NULL,
      maintenance_date TEXT NOT NULL,
      maintenance_type TEXT NOT NULL,
      description TEXT,
      technician_id TEXT,
      parts_replaced TEXT,
      cost REAL,
      next_maintenance_date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    )
  `)
  
  // 設備異常テーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS abnormal_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER NOT NULL,
      event_date TEXT NOT NULL,
      event_type TEXT NOT NULL,
      severity TEXT,
      description TEXT,
      action_taken TEXT,
      resolved_date TEXT,
      resolved_by TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    )
  `)
  
  // サンプルデータの挿入
  await insertSampleData(db)
  
  console.log('Prant database initialized successfully')
}

// サンプルデータを挿入する関数
async function insertSampleData(db) {
  // 高炉のサンプルデータ
  await db.run(`
    INSERT INTO equipments (name, type, location, installation_date, manufacturer, model, specifications, status)
    VALUES ('第1高炉', 'blast-furnace', '第1製鉄所', '2010-05-15', '重工業株式会社', 'BF-5000', '容積5000m³、日産10000トン', 'operational')
  `)
  
  // 製鋼のサンプルデータ
  await db.run(`
    INSERT INTO equipments (name, type, location, installation_date, manufacturer, model, specifications, status)
    VALUES ('第2製鋼', 'steelmaking', '第1製鉄所', '2012-08-20', '製鋼設備株式会社', 'SM-2500', '300トン転炉、連続処理', 'operational')
  `)
  
  // CDQのサンプルデータ
  await db.run(`
    INSERT INTO equipments (name, type, location, installation_date, manufacturer, model, specifications, status)
    VALUES ('CDQ設備', 'cdq', '第1製鉄所', '2015-03-10', 'エコ設備株式会社', 'CDQ-1000', '熱回収率85%、処理能力100トン/時', 'operational')
  `)
  
  // 圧延のサンプルデータ
  await db.run(`
    INSERT INTO equipments (name, type, location, installation_date, manufacturer, model, specifications, status)
    VALUES ('熱間圧延設備', 'rolling', '第2工場', '2018-11-05', '圧延機械株式会社', 'HR-800', '最大幅2000mm、厚さ1.2〜25.4mm', 'operational')
  `)
  
  // 連鋳のサンプルデータ
  await db.run(`
    INSERT INTO equipments (name, type, location, installation_date, manufacturer, model, specifications, status)
    VALUES ('連続鋳造設備', 'continuous-casting', '第2工場', '2016-07-22', '精密機械株式会社', 'CC-400', '4ストランド、鋳造速度1.2m/分', 'operational')
  `)
  
  // 運転データのサンプル
  const equipmentIds = await db.all('SELECT id FROM equipments')
  
  for (const { id } of equipmentIds) {
    // 過去30日分のランダムな運転データを生成
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      await db.run(`
        INSERT INTO equipment_operations (
          equipment_id, 
          operation_date, 
          temperature, 
          pressure, 
          production_rate, 
          energy_consumption,
          operator_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        dateString,
        Math.floor(Math.random() * 1000) + 500, // 温度 500-1500
        Math.floor(Math.random() * 100) + 50,   // 圧力 50-150
        Math.floor(Math.random() * 200) + 100,  // 生産量 100-300
        Math.floor(Math.random() * 5000) + 3000, // エネルギー消費 3000-8000
        `operator-${Math.floor(Math.random() * 5) + 1}` // ランダムなオペレーターID
      ])
    }
    
    // メンテナンス記録サンプル
    await db.run(`
      INSERT INTO maintenance_records (
        equipment_id,
        maintenance_date,
        maintenance_type,
        description,
        technician_id,
        parts_replaced,
        cost,
        next_maintenance_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30日前
      '定期点検',
      '年次定期点検を実施。主要部品の磨耗状況を確認。',
      'tech-101',
      'フィルター、Oリング',
      Math.floor(Math.random() * 500000) + 100000, // 10-60万円のコスト
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 180日後
    ])
    
    // 異常イベントサンプル（設備IDが奇数の場合のみ）
    if (id % 2 === 1) {
      await db.run(`
        INSERT INTO abnormal_events (
          equipment_id,
          event_date,
          event_type,
          severity,
          description,
          action_taken,
          resolved_date,
          resolved_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15日前
        '温度異常',
        '中',
        '運転中に温度が急上昇。設定値を1200℃超過。',
        '緊急停止後、冷却システムを確認。センサーの誤作動を発見し交換。',
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14日前
        'tech-202'
      ])
    }
  }
}

// データベースからすべての設備を取得する関数
export async function getAllEquipments() {
  const db = await openDb()
  return db.all('SELECT * FROM equipments ORDER BY type, name')
}

// 設備タイプでフィルタリングして設備を取得する関数
export async function getEquipmentsByType(type) {
  const db = await openDb()
  return db.all('SELECT * FROM equipments WHERE type = ? ORDER BY name', [type])
}

// 設備IDで設備を取得する関数
export async function getEquipmentById(id) {
  const db = await openDb()
  return db.get('SELECT * FROM equipments WHERE id = ?', [id])
}

// 設備の運転データを取得する関数
export async function getEquipmentOperations(equipmentId, limit = 30) {
  const db = await openDb()
  return db.all(`
    SELECT * FROM equipment_operations 
    WHERE equipment_id = ? 
    ORDER BY operation_date DESC 
    LIMIT ?
  `, [equipmentId, limit])
}

// 設備の異常イベントを取得する関数
export async function getAbnormalEvents(equipmentId, limit = 10) {
  const db = await openDb()
  return db.all(`
    SELECT * FROM abnormal_events 
    WHERE equipment_id = ? 
    ORDER BY event_date DESC 
    LIMIT ?
  `, [equipmentId, limit])
}

// 設備の保全記録を取得する関数
export async function getMaintenanceRecords(equipmentId, limit = 10) {
  const db = await openDb()
  return db.all(`
    SELECT * FROM maintenance_records 
    WHERE equipment_id = ? 
    ORDER BY maintenance_date DESC 
    LIMIT ?
  `, [equipmentId, limit])
}

// 新しい設備を追加する関数
export async function addEquipment(equipmentData) {
  const db = await openDb()
  const result = await db.run(`
    INSERT INTO equipments (
      name, 
      type, 
      location, 
      installation_date, 
      manufacturer, 
      model, 
      specifications, 
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    equipmentData.name,
    equipmentData.type,
    equipmentData.location,
    equipmentData.installation_date,
    equipmentData.manufacturer,
    equipmentData.model,
    equipmentData.specifications,
    equipmentData.status || 'operational'
  ])
  
  return result.lastID
}

// 設備情報を更新する関数
export async function updateEquipment(id, equipmentData) {
  const db = await openDb()
  await db.run(`
    UPDATE equipments 
    SET 
      name = ?, 
      type = ?, 
      location = ?, 
      installation_date = ?, 
      manufacturer = ?, 
      model = ?, 
      specifications = ?, 
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    equipmentData.name,
    equipmentData.type,
    equipmentData.location,
    equipmentData.installation_date,
    equipmentData.manufacturer,
    equipmentData.model,
    equipmentData.specifications,
    equipmentData.status,
    id
  ])
  
  return { id }
}

// 運転データを記録する関数
export async function recordOperation(operationData) {
  const db = await openDb()
  const result = await db.run(`
    INSERT INTO equipment_operations (
      equipment_id,
      operation_date,
      temperature,
      pressure,
      production_rate,
      energy_consumption,
      operator_id,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    operationData.equipment_id,
    operationData.operation_date,
    operationData.temperature,
    operationData.pressure,
    operationData.production_rate,
    operationData.energy_consumption,
    operationData.operator_id,
    operationData.notes
  ])
  
  return result.lastID
}

// 保全記録を追加する関数
export async function addMaintenanceRecord(maintenanceData) {
  const db = await openDb()
  const result = await db.run(`
    INSERT INTO maintenance_records (
      equipment_id,
      maintenance_date,
      maintenance_type,
      description,
      technician_id,
      parts_replaced,
      cost,
      next_maintenance_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    maintenanceData.equipment_id,
    maintenanceData.maintenance_date,
    maintenanceData.maintenance_type,
    maintenanceData.description,
    maintenanceData.technician_id,
    maintenanceData.parts_replaced,
    maintenanceData.cost,
    maintenanceData.next_maintenance_date
  ])
  
  // 最終メンテナンス日を設備テーブルに更新
  await db.run(`
    UPDATE equipments
    SET last_maintenance_date = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    maintenanceData.maintenance_date,
    maintenanceData.equipment_id
  ])
  
  return result.lastID
}

// 異常イベントを記録する関数
export async function recordAbnormalEvent(eventData) {
  const db = await openDb()
  const result = await db.run(`
    INSERT INTO abnormal_events (
      equipment_id,
      event_date,
      event_type,
      severity,
      description,
      action_taken,
      resolved_date,
      resolved_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    eventData.equipment_id,
    eventData.event_date,
    eventData.event_type,
    eventData.severity,
    eventData.description,
    eventData.action_taken,
    eventData.resolved_date,
    eventData.resolved_by
  ])
  
  return result.lastID
}

// 未解決の異常イベントを取得する関数
export async function getUnresolvedEvents() {
  const db = await openDb()
  return db.all(`
    SELECT a.*, e.name as equipment_name, e.type as equipment_type
    FROM abnormal_events a
    JOIN equipments e ON a.equipment_id = e.id
    WHERE a.resolved_date IS NULL
    ORDER BY a.event_date DESC
  `)
}

// システム全体の統計情報を取得する関数
export async function getSystemStats() {
  const db = await openDb()
  
  // 設備タイプ別の数
  const equipmentCounts = await db.all(`
    SELECT type, COUNT(*) as count
    FROM equipments
    GROUP BY type
  `)
  
  // 運転状況のサマリー
  const statusCounts = await db.all(`
    SELECT status, COUNT(*) as count
    FROM equipments
    GROUP BY status
  `)
  
  // 直近30日間の異常件数
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]
  
  const recentAbnormalCount = await db.get(`
    SELECT COUNT(*) as count
    FROM abnormal_events
    WHERE event_date >= ?
  `, [thirtyDaysAgoStr])
  
  // 直近のメンテナンス実績
  const recentMaintenanceCount = await db.get(`
    SELECT COUNT(*) as count
    FROM maintenance_records
    WHERE maintenance_date >= ?
  `, [thirtyDaysAgoStr])
  
  return {
    equipmentCounts,
    statusCounts,
    recentAbnormalCount: recentAbnormalCount.count,
    recentMaintenanceCount: recentMaintenanceCount.count
  }
} 