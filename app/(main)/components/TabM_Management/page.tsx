'use client';

import styles from './page.module.css';

export default function TabM_Management() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>管理</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>管理機能</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>各種管理機能を提供します。</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>設定</h2>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p>システムの設定と管理を行います。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 