'use client';

import styles from './page.module.css';

export default function TabM_MyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Myページ</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>プロフィール</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>ユーザー情報の表示と編集を行います。</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>活動履歴</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>ユーザーの活動履歴を表示します。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 