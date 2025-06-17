'use client';

import styles from './page.module.css';

export default function TabM_Design() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>設計協力</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>設計支援</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>設計作業の支援機能を提供します。</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>協力ツール</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>設計協力に必要な各種ツールを提供します。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 