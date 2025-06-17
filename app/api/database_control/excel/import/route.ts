import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
import * as XLSX from "xlsx";

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "achievements.db");
const TEMP_DIR = path.join(process.cwd(), "tmp");

// 一時ディレクトリが存在しない場合は作成
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// CSVファイルを解析する関数
function parseCSV(content: string): { headers: string[]; data: any[] } {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let inQuote = false;
    let currentValue = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuote && i + 1 < line.length && line[i + 1] === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (char === "," && !inQuote) {
        result.push(currentValue);
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    result.push(currentValue);
    return result;
  };

  const headers = parseCSVLine(lines[0]);
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: any = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] === "" ? null : values[idx];
    });
    data.push(row);
  }

  return { headers, data };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tableName = formData.get("tableName") as string | null;

    // ファイル必須チェック
    if (!file) {
      return NextResponse.json(
        { error: "ファイルは必須です" },
        { status: 400 }
      );
    }

    // テーブル名 or ファイル未指定チェック
    if (!tableName) {
      return NextResponse.json(
        { error: "テーブル名は必須です" },
        { status: 400 }
      );
    }

    // DBファイル存在チェック
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json(
        { error: "データベースファイルが見つかりません" },
        { status: 404 }
      );
    }

    // 一時ファイル保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(TEMP_DIR, `${Date.now()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    // SQLite DBオープン
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    let totalUpdated = 0;
    let totalErrors = 0;
    const results: any[] = [];

    await db.run("BEGIN TRANSACTION");
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (fileExt === "csv") {
        // CSV処理…
        // （中略。メッセージ部分は上記例を参考に）
      } else if (fileExt === "xlsx") {
        // Excel処理…
      } else {
        await db.close();
        fs.unlinkSync(tempFilePath);
        return NextResponse.json(
          {
            error:
              "サポートされていないファイル形式です。CSVまたはExcelを使用してください。",
          },
          { status: 400 }
        );
      }

      await db.run("COMMIT");
      await db.close();
      fs.unlinkSync(tempFilePath);

      return NextResponse.json({
        success: true,
        message: `データベースが正常にインポートされました。${totalUpdated}行が更新されました。`,
        details: results,
        totalUpdated,
        totalErrors,
      });
    } catch (e) {
      await db.run("ROLLBACK");
      await db.close();
      fs.unlinkSync(tempFilePath);
      throw e;
    }
  } catch (error) {
    console.error("データベースインポートエラー:", error);
    return NextResponse.json(
      {
        error: `データベースインポート中にエラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const bodyParser = false;
