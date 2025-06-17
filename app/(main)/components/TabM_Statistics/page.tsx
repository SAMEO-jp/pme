'use client';

import styles from './page.module.css';

export default function TabM_Statistics() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>統計</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>データ分析</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>各種データの統計分析とグラフ表示を行います。</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>レポート</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>定期的なレポートの生成と表示を行います。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 