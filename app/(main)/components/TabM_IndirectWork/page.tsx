'use client';

import styles from './page.module.css';
import { MainTabHeader } from "../../components/x.TabHeader/MainTabHeader";

export default function TabM_IndirectWork() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainTabHeader currentTab="main/main_indirect_work" />
      <div className="container mx-auto py-6">
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>間接業務</h2>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <p>間接業務の管理機能を提供します。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 