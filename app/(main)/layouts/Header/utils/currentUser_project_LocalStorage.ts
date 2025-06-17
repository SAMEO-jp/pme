import { Project } from './localstrage_currentProjects'

// デフォルトのプロジェクトデータ
const DEFAULT_PROJECTS = {
  projects: []
}

// ローカルストレージのキー
const STORAGE_KEYS = {
  USER_PROJECTS: 'currentUser_projects'
}

// プロジェクトデータをローカルストレージに保存
export const saveProjectsToLocalStorage = (projects: Project[]): boolean => {
  try {
    // データをJSON文字列に変換
    const projectsString = JSON.stringify(projects)
    
    // localStorageに保存
    localStorage.setItem(STORAGE_KEYS.USER_PROJECTS, projectsString)
    
    console.log('Project data saved to localStorage successfully')
    return true
  } catch (error) {
    console.error('Error saving project data to localStorage:', error)
    return false
  }
}

// ローカルストレージからプロジェクトデータを取得
export const getProjectsFromLocalStorage = (): { projects: Project[] } => {
  try {
    const projectsString = localStorage.getItem(STORAGE_KEYS.USER_PROJECTS)
    
    if (!projectsString) {
      // データが存在しない場合はデフォルト値を保存して返す
      saveProjectsToLocalStorage(DEFAULT_PROJECTS.projects)
      return DEFAULT_PROJECTS
    }
    
    return {
      projects: JSON.parse(projectsString)
    }
  } catch (error) {
    console.error('Error retrieving project data from localStorage:', error)
    // エラー時はデフォルト値を返す
    return DEFAULT_PROJECTS
  }
}

// プロジェクトデータを更新
export const updateCurrentProjects = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/header_local/current_user/current_project?userId=${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project data')
    }
    
    const data = await response.json()
    if (!data.projects) {
      throw new Error('Invalid project data received')
    }
    
    // 取得したプロジェクト情報をlocalStorageに保存
    return saveProjectsToLocalStorage(data.projects)
  } catch (error) {
    console.error('Error updating project data:', error)
    return false
  }
}

// ローカルストレージのプロジェクトデータをクリア
export const clearProjectsFromLocalStorage = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROJECTS)
    return true
  } catch (error) {
    console.error('Error clearing project data from localStorage:', error)
    return false
  }
}
