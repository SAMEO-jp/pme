import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const body = await request.json();
    const { konpoListId, konpoTanniIds } = body;

    // トランザクションを開始
    await db.run('BEGIN TRANSACTION');

    try {
      // 選択された梱包単位すべてに同じ梱包リストIDを設定
      for (const konpoTanniId of konpoTanniIds) {
        await db.run(
          `UPDATE KONPO_TANNI 
           SET KONPO_LIST_ID = ?
           WHERE KONPO_TANNI_ID = ?`,
          [konpoListId, konpoTanniId]
        );
      }

      // トランザクションをコミット
      await db.run('COMMIT');

      return NextResponse.json({ 
        message: '梱包リストを作成しました',
        konpoListId,
        updatedCount: konpoTanniIds.length
      });
    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating konpo list:', error);
    return NextResponse.json(
      { error: '梱包リストの作成に失敗しました' },
      { status: 500 }
    );
  }
} 