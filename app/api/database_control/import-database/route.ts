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
    if (!tableName || !file) {
      return NextResponse.json(
        { error: "テーブル名とファイルは必須です" },
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

    const results: any[] = [];
    let totalUpdated = 0;
    let totalErrors = 0;

    await db.run("BEGIN TRANSACTION");
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (fileExt === "csv") {
        // CSV処理
        const content = buffer.toString("utf-8");
        const { headers, data } = parseCSV(content);
        const targetTable =
          tableName ||
          file.name.replace(/\.csv$/i, "").replace(/[^a-zA-Z0-9_]/g, "_");

        // テーブル存在チェック
        const tableExists = await db.get(
          `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          [targetTable]
        );
        if (!tableExists) {
          await db.close();
          fs.unlinkSync(tempFilePath);
          return NextResponse.json(
            { error: `テーブル "${targetTable}" が見つかりません` },
            { status: 404 }
          );
        }

        // カラム情報取得
        const tableInfo = await db.all(`PRAGMA table_info(${targetTable})`);
        const columnNames = tableInfo.map((col) => col.name);

        // 必要カラムチェック
        const missingColumns = columnNames.filter(
          (col) => !headers.includes(col)
        );
        if (missingColumns.length > 0) {
          results.push({
            table: targetTable,
            status: "error",
            message: `必要なカラムがありません: ${missingColumns.join(", ")}`,
          });
        } else {
          // 既存データ削除
          await db.run(`DELETE FROM ${targetTable}`);
          let rowCount = 0;
          let errorCount = 0;

          // データ挿入
          for (const row of data) {
            const values: any[] = [];
            const placeholders: string[] = [];
            for (const colName of columnNames) {
              if (colName in row) {
                values.push(row[colName]);
                placeholders.push("?");
              }
            }
            if (values.length > 0) {
              try {
                const sql = `INSERT INTO ${targetTable} (${columnNames.join(
                  ","
                )}) VALUES (${placeholders.join(",")})`;
                await db.run(sql, values);
                rowCount++;
              } catch (e) {
                errorCount++;
              }
            }
          }

          results.push({
            table: targetTable,
            status: "success",
            rowsUpdated: rowCount,
            errors: errorCount,
          });
          totalUpdated += rowCount;
          totalErrors += errorCount;
        }
      } else if (fileExt === "xlsx") {
        // Excel処理（略）
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
