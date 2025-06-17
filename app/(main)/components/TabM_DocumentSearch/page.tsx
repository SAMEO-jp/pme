'use client';

import { useState } from 'react';
import { Search, FileText, Folder, Tag } from 'lucide-react';
import styles from './page.module.css';
import { MainTabHeader } from "../../components/x.TabHeader/MainTabHeader";

export default function TabM_DocumentSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainTabHeader currentTab="main/main_document_search" />
      <div className="container mx-auto py-6">
        <div className={styles.container}>
          {/* 検索バー */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="資料を検索..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className={styles.content}>
            {/* カテゴリーセクション */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>カテゴリー</h2>
              <div className={styles.cardGrid}>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-blue-100 dark:bg-blue-900/30`}>
                      <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={styles.cardTitle}>技術文書</span>
                    <span className={styles.cardDescription}>設計書・仕様書など</span>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-green-100 dark:bg-green-900/30`}>
                      <Folder className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <span className={styles.cardTitle}>プロジェクト資料</span>
                    <span className={styles.cardDescription}>プロジェクト関連文書</span>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-purple-100 dark:bg-purple-900/30`}>
                      <Tag className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className={styles.cardTitle}>タグ検索</span>
                    <span className={styles.cardDescription}>タグによる資料検索</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近の資料セクション */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>最近の資料</h2>
              <div className={styles.recentDocuments}>
                {/* ここに最近の資料リストを表示 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 