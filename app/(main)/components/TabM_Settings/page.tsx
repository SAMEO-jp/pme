'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function TabM_Settings() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="検索..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>主要機能</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>カレンダー管理</h3>
              <ul className={styles.featureList}>
                <li>予定の追加・編集・削除</li>
                <li>繰り返し予定の設定</li>
                <li>カテゴリー別の管理</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>タスク管理</h3>
              <ul className={styles.featureList}>
                <li>ToDoリストの作成</li>
                <li>優先順位の設定</li>
                <li>進捗状況の追跡</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>チーム連携</h3>
              <ul className={styles.featureList}>
                <li>メンバー間の予定共有</li>
                <li>グループカレンダー</li>
                <li>通知システム</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>最近のアクティビティ</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>2024/05/08 10:30</span>
              <span className={styles.activityText}>新しい予定「週次ミーティング」が追加されました</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>2024/05/08 09:15</span>
              <span className={styles.activityText}>タスク「レポート作成」が完了しました</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityTime}>2024/05/07 16:45</span>
              <span className={styles.activityText}>チームメンバー「山田太郎」が予定を更新しました</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 