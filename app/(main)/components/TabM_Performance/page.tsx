'use client';

import styles from './page.module.css';

export default function TabM_Performance() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>実績管理</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>週別実績</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>週別の実績データを表示・管理します。</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>月別集計</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>月別の実績データを集計・表示します。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 