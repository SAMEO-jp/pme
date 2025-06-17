import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // SQLiteのテーブル一覧を取得
  const tables = await prisma.$queryRawUnsafe(
    `SELECT name, type, tbl_name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;`
  );

  return NextResponse.json(tables);
} 