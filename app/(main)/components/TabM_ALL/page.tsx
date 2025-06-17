"use client"

import Link from "next/link"
import { BarChart3, Calendar, Clock, Database, FileText, PieChart, Plus, TrendingUp, Users, User, FileBox, Cog, ArrowRight, ShoppingCart, Map, MoreHorizontal } from "lucide-react"
import styles from './page.module.css'
import { MainTabHeader } from "../../components/x.TabHeader/MainTabHeader"

// 現在の年月と週を取得
const getCurrentDateInfo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const firstDayOfYear = new Date(year, 0, 1)
  const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return { year, month, week }
}

export default function TabM_ALL() {
  const { year, month, week } = getCurrentDateInfo()
  return (
    <div className="min-h-screen bg-gray-50">
      <MainTabHeader currentTab="main/all" />
      <div className="container mx-auto py-6">
        <div className={styles.dashboard}>
          <div className={styles.container}>
            {/* クイックアクセスカード */}
            <div className={styles.section}>          
              <h2 className={styles.sectionTitle}>主要機能</h2>
              <div className={styles.cardGrid}>
                <Link href={`/week-shiwake/${year}/${week}`} className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/40`}>
                      <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className={styles.cardTitle}>実績入力</span>
                    <span className={styles.cardDescription}>週表示で実績を入力</span>
                  </div>
                </Link>
                <Link href={`/data-display/${year}/${month}`} className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40`}>
                      <BarChart3 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className={styles.cardTitle}>実績表示</span>
                    <span className={styles.cardDescription}>月別データで確認</span>
                  </div>
                </Link>
                <Link href="/project/home" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/40`}>
                      <FileText className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span className={styles.cardTitle}>プロジェクト</span>
                    <span className={styles.cardDescription}>プロジェクト管理</span>
                  </div>
                </Link>
                <Link href="/bumon" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40`}>
                      <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className={styles.cardTitle}>組織</span>
                    <span className={styles.cardDescription}>部門情報管理</span>
                  </div>
                </Link>
                <Link href="/employee-list" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40`}>
                      <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className={styles.cardTitle}>従業員リスト</span>
                    <span className={styles.cardDescription}>従業員情報管理</span>
                  </div>
                </Link>
                <Link href="/prant" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40`}>
                      <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={styles.cardTitle}>設備</span>
                    <span className={styles.cardDescription}>設備体系</span>
                  </div>
                </Link>
                <Link href="/knowledge_main" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/40`}>
                      <FileBox className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className={styles.cardTitle}>ドキュメント</span>
                    <span className={styles.cardDescription}>資料管理</span>
                  </div>
                </Link>
                <Link href="/bom-management" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40`}>
                      <Cog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className={styles.cardTitle}>BOM管理</span>
                    <span className={styles.cardDescription}>部品構成管理</span>
                  </div>
                </Link>
                <Link href="/file-management" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-cyan-100 dark:bg-cyan-900/30 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/40`}>
                      <FileText className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className={styles.cardTitle}>ファイル管理</span>
                    <span className={styles.cardDescription}>ファイルシステム管理</span>
                  </div>
                </Link>
                <Link href="/purchase-management" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-rose-100 dark:bg-rose-900/30 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/40`}>
                      <ShoppingCart className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className={styles.cardTitle}>購入品管理</span>
                    <span className={styles.cardDescription}>購入品情報管理</span>
                  </div>
                </Link>
                <Link href="/tech-map" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/40`}>
                      <Map className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className={styles.cardTitle}>技術MAP</span>
                    <span className={styles.cardDescription}>技術情報管理</span>
                  </div>
                </Link>
                <Link href="/others" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-slate-100 dark:bg-slate-900/30 group-hover:bg-slate-200 dark:group-hover:bg-slate-900/40`}>
                      <MoreHorizontal className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className={styles.cardTitle}>その他</span>
                    <span className={styles.cardDescription}>その他の機能</span>
                  </div>
                </Link>
              </div>
            </div>
            {/* プロジェクト情報 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>プロジェクト情報</h2>
              <div className={styles.cardGrid}>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/40`}>
                      <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <span className={styles.cardTitle}>プロジェクト状況</span>
                  </div>
                  <div className={styles.cardDescription}>
                    <p>データがまだありません</p>
                    <p>プロジェクトを追加すると、ここに表示されます</p>
                  </div>
                  <Link href="/projects" className={styles.cardLink}>
                    プロジェクトを管理する <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40`}>
                      <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className={styles.cardTitle}>チームメンバー</span>
                  </div>
                  <div className={styles.cardDescription}>
                    <p>データがまだありません</p>
                    <p>チームメンバーの情報がここに表示されます</p>
                  </div>
                  <Link href="/settings/user" className={styles.cardLink}>
                    ユーザー設定を管理する <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            {/* 統計情報 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>統計情報</h2>
              <div className={styles.cardGrid}>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40`}>
                      <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={styles.cardTitle}>今月の実績概要</span>
                  </div>
                  <div className={styles.cardDescription}>
                    <div className={`${styles.cardIcon} bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40`}>
                      <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p>データがまだありません</p>
                    <Link href={`/week-shiwake/${year}/${week}`} className={styles.cardLink}>
                      実績を入力する <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/40`}>
                      <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <span className={styles.cardTitle}>最近の活動</span>
                  </div>
                  <div className={styles.cardDescription}>
                    <p>データがまだありません</p>
                    <p>実績を入力すると、ここに表示されます</p>
                  </div>
                  <Link href={`/week-shiwake/${year}/${week}`} className={styles.cardLink}>
                    実績を入力する <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            {/* システム管理 */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>システム管理</h2>
              <div className={styles.cardGrid}>
                <Link href="/z_datamanagement/main/all/index" className={styles.card}>
                  <div className={styles.flexCenter}>
                    <div className={`${styles.cardIcon} bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/40`}>
                      <Database className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className={styles.cardTitle}>データベース管理</span>
                    <p className={styles.cardDescription}>データベースの設定と管理を行います</p>
                  </div>
                  <ArrowRight className="ml-auto w-6 h-6 text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* フッター */}
        <footer className="mt-12 py-6 text-center border-t border-gray-200">
          <p className="text-gray-400 text-sm">© 2025 PMEデータHUB</p>
        </footer>
      </div>
    </div>
  )
} 