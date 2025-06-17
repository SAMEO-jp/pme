import { AllUser } from './currentUser_LocalStorage';

// ローカルストレージのキー
const STORAGE_KEY = 'currentUser';

// ユーザー情報をローカルストレージに保存
export const saveUserToLocalStorage = (userData: AllUser): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
    return false;
  }
};

// ローカルストレージからユーザー情報を取得
export const getUserFromLocalStorage = (): AllUser | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const userData = localStorage.getItem(STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data from localStorage:', error);
    return null;
  }
};

// ローカルストレージからユーザー情報を削除
export const removeUserFromLocalStorage = (): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing user data from localStorage:', error);
    return false;
  }
}; 