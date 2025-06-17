import { useState, useCallback } from 'react';
import { saveUserToLocalStorage, DEFAULT_USER } from '../utils/currentUser_LocalStorage';

interface UseLoginReturn {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // APIからユーザー情報を取得
      const response = await fetch(`/api/header_local/current_user?userId=${userId}`);
      if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'ユーザー情報の取得に失敗しました');
      }

      // localStorageに保存
      const success = await saveUserToLocalStorage(data.data);
      if (!success) {
        throw new Error('ユーザー情報の保存に失敗しました');
      }

      setIsLoggedIn(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログイン処理中にエラーが発生しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // デフォルトユーザーに戻す
    saveUserToLocalStorage(DEFAULT_USER);
    setIsLoggedIn(false);
    setError(null);
  }, []);

  return {
    isLoggedIn,
    isLoading,
    error,
    login,
    logout
  };
}; 