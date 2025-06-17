import fs from 'fs';
import path from 'path';
import { saveDateInfoToLocalStorage } from './dateInfoUtils';

export interface AllUser {
  user_id: string;
  name_japanese: string;
  TEL: string;
  mail: string;
  name_english: string;
  name_yomi: string;
  company: string;
  bumon: string;
  in_year: string;
  Kengen: string;
  TEL_naisen: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

// デフォルトユーザー情報
export const DEFAULT_USER: AllUser = {
  user_id: '999999',
  name_japanese: '仮 ユーザー',
  TEL: '070-9999-9999',
  mail: 'test@test.com',
  name_english: 'Kari User',
  name_yomi: 'かり ゆーざー',
  company: '日本製鉄',
  bumon: 'プラント設計部',
  in_year: '2025',
  Kengen: '1',
  TEL_naisen: '999999',
  sitsu: '連鋳・圧延プラント設計室',
  ka: '連鋳・圧延プラント設計第一課',
  syokui: '1'
};

export const saveUserToLocalStorage = (userData: AllUser) => {
  try {
    // ユーザーデータをJSON文字列に変換
    const userDataString = JSON.stringify(userData);
    
    // localStorageに保存
    localStorage.setItem('currentUser', userDataString);
    saveDateInfoToLocalStorage(); // 日時情報も更新
    
    console.log('User data saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
    return false;
  }
};

export const getUserFromLocalStorage = (): AllUser => {
  try {
    const userDataString = localStorage.getItem('currentUser');
    if (!userDataString) {
      // ユーザーデータが存在しない場合はデフォルトユーザーを保存して返す
      saveUserToLocalStorage(DEFAULT_USER);
      return DEFAULT_USER;
    }
    
    return JSON.parse(userDataString) as AllUser;
  } catch (error) {
    console.error('Error retrieving user data from localStorage:', error);
    // エラー時はデフォルトユーザーを返す
    return DEFAULT_USER;
  }
};

// ログインモーダル用のユーザー情報更新関数
export const updateCurrentUser = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/header_local/current_user?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update user data');
    }
    
    // 取得したユーザー情報をlocalStorageに保存
    return saveUserToLocalStorage(data.data);
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};