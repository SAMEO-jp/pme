import Database from 'better-sqlite3';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
const db = new Database(dbPath);

export interface Project {
  projectNumber: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  clientName: string;
  classification: string;
  budgetGrade: string;
  projectStartDate: string;
  projectEndDate: string;
  installationDate: string;
  drawingCompletionDate: string;
  equipmentCategory: string;
  equipmentNumbers: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  spare1: string;
  spare2: string;
  spare3: string;
  isProject: string;
}

export interface Zumen {
  ROWID: number;
  Zumen_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  Souti_ID: string;
  Souti_name: string;
  rev_number: string;
  Tantou_a1: string;
  Tantou_b1: string;
  Tantou_c1: string;
  status: string;
  Syutuzubi_Date: string;
  Sakuzu_a: string;
  Sakuzu_b: string;
  Sakuzu_date: string;
  Scale: string;
  Size: string;
  KANREN_ZUMEN: string;
}

export interface Part {
  ROWID: number;
  PART_ID: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  PART_NAME: string;
  REMARKS: string;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string | null;
}

export interface RelatedZumen {
  Zumen_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  KANREN_ZUMEN: string;
}

export interface Buzai {
  ROWID: number;
  BUZAI_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}

export interface KonpoUnit {
  KONPO_LIST_ID: string;
  PART_ID: string;
  KONPO_NUM: number;
  TOTAL_WEIGHT: number;
  BUZAI_WEIGHT: number;
}

export function getAllProjects(): Project[] {
  const stmt = db.prepare('SELECT * FROM projects');
  return stmt.all() as Project[];
}

export function getProjectByNumber(projectNumber: string): Project | undefined {
  const stmt = db.prepare('SELECT * FROM projects WHERE projectNumber = ?');
  return stmt.get(projectNumber) as Project | undefined;
}

export function getZumenByProjectId(projectNumber: string): Zumen[] {
  const stmt = db.prepare(`
    SELECT z.* 
    FROM BOM_ZUMEN z
    INNER JOIN projects p ON z.project_ID = p.projectNumber
    WHERE p.projectNumber = ?
  `);
  return stmt.all(projectNumber) as Zumen[];
}

export function getZumenParts(zumenId: string): Part[] {
  const stmt = db.prepare(
    `SELECT * FROM BOM_PART WHERE Zumen_ID = ?`
  );
  return stmt.all(zumenId) as Part[];
}

export function getRelatedZumens(zumenId: string): RelatedZumen[] {
  const zumen = db.prepare(
    `SELECT Kumitate_Zumen, KANREN_ZUMEN FROM BOM_ZUMEN WHERE Zumen_ID = ?`
  ).get(zumenId) as { Kumitate_Zumen: string | null; KANREN_ZUMEN: string | null } | undefined;

  if (!zumen) {
    return [];
  }

  const relatedZumenIds = [
    ...(zumen.Kumitate_Zumen && zumen.Kumitate_Zumen !== 'NULL' ? zumen.Kumitate_Zumen.split(';') : []),
    ...(zumen.KANREN_ZUMEN && zumen.KANREN_ZUMEN !== 'NULL' ? zumen.KANREN_ZUMEN.split(';') : [])
  ].filter(id => id.trim());

  if (relatedZumenIds.length === 0) {
    return [];
  }

  const placeholders = relatedZumenIds.map(() => '?').join(',');
  const relatedZumens = db.prepare(
    `SELECT Zumen_ID, Zumen_Name, Zumen_Kind, Kumitate_Zumen, KANREN_ZUMEN 
     FROM BOM_ZUMEN 
     WHERE Zumen_ID IN (${placeholders})`
  ).all(...relatedZumenIds) as RelatedZumen[];

  return relatedZumens;
}

export function getBuzaiByPartId(partId: string, zumenId: string): Buzai[] {
  const stmt = db.prepare(
    `SELECT * FROM BOM_BUZAI WHERE PART_ID = ? AND ZUMEN_ID = ?`
  );
  return stmt.all(partId, zumenId) as Buzai[];
}

export function getZumensReferencingAsKumitate(zumenId: string): RelatedZumen[] {
  const stmt = db.prepare(
    `SELECT Zumen_ID, Zumen_Name, Zumen_Kind, Kumitate_Zumen, KANREN_ZUMEN 
     FROM BOM_ZUMEN 
     WHERE Kumitate_Zumen LIKE ? OR Kumitate_Zumen LIKE ? OR Kumitate_Zumen LIKE ?`
  );
  
  // パターン: "zumenId" または "zumenId;" または ";zumenId;"
  const patterns = [
    `${zumenId}`,
    `${zumenId};%`,
    `%;${zumenId};%`
  ];
  
  return stmt.all(...patterns) as RelatedZumen[];
} 