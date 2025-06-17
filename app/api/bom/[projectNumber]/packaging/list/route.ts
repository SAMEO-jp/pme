import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    // 梱包リストの基本情報を取得
    const lists = await db.all(`
      SELECT 
        kl.KONPO_LIST_ID,
        kl.PROJECT_ID,
        kl.KONPO_LIST_WEIGHT,
        kl.HASSOU_IN,
        kl.HASSOU_TO,
        kl.IMAGE_ID
      FROM KONPO_LIST kl
      WHERE kl.PROJECT_ID = ?
      ORDER BY kl.KONPO_LIST_ID
    `, [params.projectNumber]);

    // 梱包単位の情報を取得
    const units = await db.all(`
      SELECT 
        KONPO_LIST_ID,
        GROUP_CONCAT(KONPO_TANNI_ID) as UNIT_IDS
      FROM KONPO_TANNI
      WHERE KONPO_LIST_ID IS NOT NULL
      GROUP BY KONPO_LIST_ID
    `);

    // 梱包単位の情報をマージ
    const listsWithUnits = lists.map(list => ({
      ...list,
      HASSOU_IN: list.HASSOU_IN || 'なし',
      HASSOU_TO: list.HASSOU_TO || 'なし',
      IMAGE_ID: list.IMAGE_ID || 'なし',
      status: '登録済'
    }));

    // 梱包単位に紐づくが、KONPO_LISTに存在しないリストを取得
    const unregisteredLists = units
      .filter(unit => !lists.some(list => list.KONPO_LIST_ID === unit.KONPO_LIST_ID))
      .map(unit => ({
        KONPO_LIST_ID: unit.KONPO_LIST_ID,
        PROJECT_ID: params.projectNumber,
        KONPO_LIST_WEIGHT: 0,
        HASSOU_IN: 'なし',
        HASSOU_TO: 'なし',
        IMAGE_ID: 'なし',
        status: '要確認'
      }));

    // 梱包単位に紐づいていないリストを特定
    const listsWithoutUnits = lists
      .filter(list => !units.some(unit => unit.KONPO_LIST_ID === list.KONPO_LIST_ID))
      .map(list => ({
        ...list,
        status: '要更新'
      }));

    // 全てのリストを結合
    const allLists = [...listsWithUnits, ...unregisteredLists, ...listsWithoutUnits];

    return NextResponse.json(allLists);
  } catch (error) {
    console.error('Error fetching packaging lists:', error);
    return NextResponse.json(
      { error: '梱包リストの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const body = await request.json();
    const { konpoListId, totalWeight } = body;

    // KONPO_LISTテーブルに登録
    await db.run(
      `INSERT INTO KONPO_LIST (
        KONPO_LIST_ID,
        PROJECT_ID,
        KONPO_LIST_WEIGHT
      ) VALUES (?, ?, ?)`,
      [konpoListId, params.projectNumber, totalWeight]
    );

    return NextResponse.json({ 
      message: '梱包リストを作成しました',
      konpoListId,
      projectNumber: params.projectNumber,
      totalWeight
    });
  } catch (error) {
    console.error('Error creating konpo list:', error);
    return NextResponse.json(
      { error: '梱包リストの作成に失敗しました' },
      { status: 500 }
    );
  }
} 