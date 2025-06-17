import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { saveDateInfoToLocalStorage } from '../utils/dateInfoUtils';

export const useDateInfoUpdate = () => {
  const pathname = usePathname();

  useEffect(() => {
    // ページ遷移時に日時情報を更新
    saveDateInfoToLocalStorage();
  }, [pathname]); // pathnameが変更されるたびに実行
}; 