import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 実績一覧の取得
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany();
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

// 新規実績の作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const achievement = await prisma.achievement.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
} 