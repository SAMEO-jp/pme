import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 個別の実績の取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievement' }, { status: 500 });
  }
}

// 実績の更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const achievement = await prisma.achievement.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

// 実績の削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.achievement.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
} 