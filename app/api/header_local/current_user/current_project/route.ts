import { NextResponse } from 'next/server'
import { fetchUserProjects } from '@/app/(main)/layouts/Header/utils/localstrage_currentProjects'

export async function GET(request: Request) {
  try {
    // URLからユーザーIDを取得
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが指定されていません' },
        { status: 400 }
      )
    }
    // プロジェクトデータを取得（userIdを文字列として渡す）
    const { projects } = await fetchUserProjects(userId)
    // レスポンスを返す
    return NextResponse.json({
      projects
    })
  } catch (error) {
    console.error('プロジェクトデータの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'プロジェクトデータの取得に失敗しました' },
      { status: 500 }
    )
  }
}
