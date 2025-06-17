"use client"
import Link from "next/link"
import { BarChart3, Calendar, FileText, Briefcase, ShoppingCart, User, Database, RefreshCw, BookOpen, Users as UsersIcon, FileText as FileTextIcon, Info, Clock } from "lucide-react"
import styles from './page.module.css'
import { useEffect, useState } from "react"
import { Project } from "./style"

// ローカルストレージのキー
const STORAGE_KEYS = {
  USER_PROJECTS: 'currentUser_projects',
  USER_INDIRECTS: 'currentUser_indirects'
}

// 現在の年月と週を取得
const getCurrentDateInfo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  // 週番号を取得
  const firstDayOfYear = new Date(year, 0, 1)
  const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)

  return { year, month, week }
}

// プロジェクトデータの変換関数
const convertProjectData = (project: any): Project => {
  const converted = {
    projectNumber: project.projectNumber || '',
    projectName: project.name || '',
    isProject: project.isProject || '0',
    id: project.projectNumber || '',
    projectCode: project.projectNumber || '',
    name: project.name || '',
    clientName: project.clientName || '',
    role: project.classification || '',
    startDate: project.startDate || project.projectStartDate || new Date().toISOString()
  }
  return converted
}

// ローカルストレージからデータを取得
const getProjectsFromLocalStorage = (): {
  projects: Project[],
  indirects: Project[]
} => {
  if (typeof window === 'undefined') {
    return { projects: [], indirects: [] }
  }

  const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROJECTS) || '[]')
  
  // プロジェクトと間接業務を分離
  const projects = allProjects.filter((p: any) => p.isProject === '1')
  const indirects = allProjects.filter((p: any) => p.isProject === '0')

  return { projects, indirects }
}

export default function Dashboard() {
  const { year, month, week } = getCurrentDateInfo()

  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [userIndirects, setUserIndirects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // プロジェクト情報の取得
  const fetchUserProjects = async () => {
    try {
      setLoadingProjects(true)
      setProjectError(null)
      
      // ローカルストレージからプロジェクト情報を取得
      const { projects, indirects } = getProjectsFromLocalStorage()
      
      if (!projects || !indirects) {
        setUserProjects([])
        setUserIndirects([])
        return
      }
      
      // データを変換
      const convertedProjects = projects.map(convertProjectData)
      const convertedIndirects = indirects.map(convertProjectData)
      
      setUserProjects(convertedProjects)
      setUserIndirects(convertedIndirects)
    } catch (err: any) {
      setProjectError(err.message || 'プロジェクト情報の取得に失敗しました')
      setUserProjects([])
      setUserIndirects([])
    } finally {
      setLoadingProjects(false)
    }
  }

  // ユーザー情報が取得できたらプロジェクト情報を取得
  useEffect(() => {
    let isMounted = true

    const fetchProjects = async () => {
      if (!isMounted) return

      try {
        setLoadingUser(true)
        setLoadingProjects(true)
        
        const userRes = await fetch("/api/user")
        const userData = await userRes.json()
        
        if (!isMounted) return
        
        if (!userData.success) throw new Error("ユーザー情報取得失敗")
        
        const uid = userData.data.user_id || userData.data.employeeNumber
        if (!uid) throw new Error("ユーザーIDが取得できません")
        
        setUserId(uid)
        
        if (!isMounted) return
        await fetchUserProjects()
      } catch (e) {
        if (!isMounted) return
        setUserProjects([])
        setUserIndirects([])
        setProjectError(e instanceof Error ? e.message : "ユーザー情報の取得に失敗しました")
      } finally {
        if (!isMounted) return
        setLoadingUser(false)
        setLoadingProjects(false)
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
    }
  }, [])

  // プロジェクト情報の再読み込み
  const reloadProjects = async () => {
    await fetchUserProjects()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className={styles.dashboardRow}>
          {/* 左カラム：主要機能 */}
          <div className={styles.leftColumn}>
            <div className={styles.cardGridLarge}>
              <Link href={`/week-shiwake/${year}/${week}`} className={`${styles.card} group`}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-indigo-100 group-hover:bg-indigo-200`}>
                    <Calendar className="h-8 w-8 text-indigo-600" />
                  </div>
                  <span className={styles.cardTitle}>日報入力</span>
                  <span className={styles.cardDescription}>週表示で実績を入力</span>
                </div>
              </Link>
              <Link href={`/data-display/${year}/${month}`} className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-emerald-100 group-hover:bg-emerald-200`}>
                    <BarChart3 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <span className={styles.cardTitle}>実績表示</span>
                  <span className={styles.cardDescription}>月別データで確認</span>
                </div>
              </Link>
              <Link href="#" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-green-100 group-hover:bg-green-200`}>
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <span className={styles.cardTitle}>YJK</span>
                  <span className={styles.cardDescription}>予実管理システム</span>
                </div>
              </Link>
              <Link href="/project/home" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-pink-100 group-hover:bg-pink-200`}>
                    <FileText className="h-8 w-8 text-pink-600" />
                  </div>
                  <span className={styles.cardTitle}>プロジェクト</span>
                  <span className={styles.cardDescription}>プロジェクト管理</span>
                </div>
              </Link>
              <Link href="/indirect-work" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-amber-100 group-hover:bg-amber-200`}>
                    <Briefcase className="h-8 w-8 text-amber-600" />
                  </div>
                  <span className={styles.cardTitle}>間接業務</span>
                  <span className={styles.cardDescription}>間接業務の管理</span>
                </div>
              </Link>
              <Link href="#" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-rose-100 group-hover:bg-rose-200`}>
                    <ShoppingCart className="h-8 w-8 text-rose-600" />
                  </div>
                  <span className={styles.cardTitle}>購入品管理</span>
                  <span className={styles.cardDescription}>購入品情報管理</span>
                </div>
              </Link>
              <Link href="/prant" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-blue-100 group-hover:bg-blue-200`}>
                    <FileTextIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className={styles.cardTitle}>商品技術</span>
                  <span className={styles.cardDescription}>設計資料管理</span>
                </div>
              </Link>
              <Link href="#" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-cyan-100 group-hover:bg-cyan-200`}>
                    <UsersIcon className="h-8 w-8 text-cyan-600" />
                  </div>
                  <span className={styles.cardTitle}>部署横断技術資料</span>
                  <span className={styles.cardDescription}>全社横断の技術資料管理</span>
                </div>
              </Link>
              <Link href="/bom" className={styles.card}>
                <div className={styles.flexCenter}>
                  <div className={`${styles.cardIcon} bg-gray-100 group-hover:bg-gray-200`}>
                    <BookOpen className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className={styles.cardTitle}>BOM</span>
                  <span className={styles.cardDescription}>Bill of material</span>
                </div>
              </Link>
              <div className={`${styles.infoBox} ${styles.infoBoxShared}`}>
                <div className={styles.infoBoxTitleRow}>
                  <span style={{display:'flex',alignItems:'center',gap:'0.5em'}}>
                    <span className={styles.iconCircle}><Info className="h-6 w-6 text-blue-500" /></span>
                    <span>共有情報</span>
                  </span>
                  <button
                    type="button"
                    aria-label="リロード"
                    style={{background:'none',border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center'}}
                    tabIndex={-1}
                  >
                    <RefreshCw size={20} style={{color:'#a3a3a3'}} />
                  </button>
                </div>
                <ul className={styles.infoBoxList}>
                  <li><span style={{color:'#2563eb',fontWeight:600}}>〇〇製鉄所▲▲設備</span>　トラブル</li>
                  <li><span style={{color:'#dc2626',fontWeight:600}}>【災害情報】</span>mm月dd日　〇〇被災について</li>
                </ul>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxWorkTime}`}>
                <div className={styles.infoBoxTitleRow}>
                  <span style={{display:'flex',alignItems:'center',gap:'0.5em'}}>
                    <span className={styles.iconCircle}><Clock className="h-6 w-6 text-yellow-500" /></span>
                    <span>今月の業務時間</span>
                  </span>
                  <button
                    type="button"
                    aria-label="リロード"
                    style={{background:'none',border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center'}}
                    tabIndex={-1}
                  >
                    <RefreshCw size={20} style={{color:'#a3a3a3'}} />
                  </button>
                </div>
                <div className={styles.infoBoxContent}>
                  <div style={{display:'flex',alignItems:'center',gap:'1.2em',marginBottom:'0.7em'}}>
                    <span className={styles.workTimeNum}>〇〇</span>時間
                    <span style={{fontSize:'1.1rem',color:'#888'}}>1日平均 <span className={styles.workTimeNum} style={{fontSize:'1.3rem'}}>〇.〇</span>時間</span>
                  </div>
                  <div className={styles.workTimeWarn}>
                    あなたは、今月このまま働くと〇〇時間overとなります。
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 右カラム：情報ボックス */}
          <div className={styles.rightColumn}>
            {/* マイプロジェクトカード */}
            <div className={`${styles.infoBox} ${styles.infoBoxProject}`}>
              <div className={styles.infoBoxTitleRow}>
                <span style={{display:'flex',alignItems:'center',gap:'0.5em'}}>
                  <span className={styles.iconCircle}><FileTextIcon className="h-6 w-6 text-green-600" /></span>
                  <span>マイプロジェクト</span>
                </span>
                <button
                  type="button"
                  aria-label="リロード"
                  onClick={reloadProjects}
                  disabled={loadingProjects}
                  style={{background:'none',border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center'}}
                >
                  <RefreshCw className={loadingProjects ? "animate-spin" : ""} size={20} />
                </button>
              </div>
              {projectError && (
                <div className={styles.projectError}>{projectError}</div>
              )}
              {loadingProjects ? (
                <div className={styles.loadingProjects}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className={styles.projectList}>
                  {/* プロジェクト一覧 */}
                  <div>
                    <h3 className={styles.projectTitle}>プロジェクト</h3>
                    {userProjects.length === 0 ? (
                      <p className={styles.noProjects}>参加中のプロジェクトはありません</p>
                    ) : (
                      <div className={styles.projectGrid}>
                        {userProjects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/project/detail/${project.projectCode}/main/main`}
                            className={styles.projectCard}
                          >
                            <div className={styles.projectHeader}>
                              <h4 className={styles.projectName}>{project.name}</h4>
                              <span className={styles.projectCode}>{project.projectCode}</span>
                            </div>
                            <p className={styles.projectClient}>クライアント: {project.clientName}</p>
                            <div className={styles.projectDetails}>
                              <span className={styles.projectRole}>{project.role}</span>
                              {project.startDate && (
                                <p className={styles.projectStartDate}>開始: {new Date(project.startDate).toLocaleDateString()}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 間接業務一覧 */}
                  <div>
                    <h3 className={styles.projectTitle}>間接業務</h3>
                    {userIndirects.length === 0 ? (
                      <p className={styles.noProjects}>参加中の間接業務はありません</p>
                    ) : (
                      <div className={styles.projectGrid}>
                        {userIndirects.map((indirect) => (
                          <Link
                            key={indirect.id}
                            href={`/project/detail/${indirect.projectCode}/main/main`}
                            className={styles.projectCard}
                          >
                            <div className={styles.projectHeader}>
                              <h4 className={styles.projectName}>{indirect.name}</h4>
                              <span className={styles.projectCode}>{indirect.projectCode}</span>
                            </div>
                            <p className={styles.projectClient}>クライアント: {indirect.clientName}</p>
                            <div className={styles.projectDetails}>
                              <span className={styles.projectRole}>{indirect.role}</span>
                              {indirect.startDate && (
                                <p className={styles.projectStartDate}>開始: {new Date(indirect.startDate).toLocaleDateString()}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

