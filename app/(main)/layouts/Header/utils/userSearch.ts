// ユーザー情報の型定義
export interface User {
  user_id: string
  name_japanese: string
  name_yomi: string
  company: string
  bumon: string
  sitsu: string
  ka: string
}

// ユーザー検索結果の型定義
export interface SearchResult {
  users: User[]
  error?: string
}

// ユーザーIDによる検索
export const searchUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/header/auth?userId=${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }

    return data.user
  } catch (error) {
    console.error('Error searching user by ID:', error)
    return null
  }
}

// 名前による検索
export const searchUsersByName = async (query: string): Promise<SearchResult> => {
  try {
    const response = await fetch(`/api/header/auth?query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }

    return { users: data.users }
  } catch (error) {
    console.error('Error searching users by name:', error)
    return { users: [], error: 'ユーザー検索中にエラーが発生しました' }
  }
}

// ユーザー情報の表示用フォーマット
export const formatUserInfo = (user: User): string => {
  return `${user.name_japanese} (${user.company} ${user.bumon} ${user.sitsu} ${user.ka})`
} 