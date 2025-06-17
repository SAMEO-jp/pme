"use client"

import { useEffect, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import type { Project } from "@/lib/project/types"
import { mockData } from "./components/z.SampleData/mockData"

// 分割したタブレイアウトコンポーネントをインポート
import { SubTabHeader } from "./components/x.TabHeader/SubTabHeader"
import { MainTabHeader } from "./components/x.TabHeader/MainTabHeader"
// 分割したメインタブコンポーネント
import { OverviewMain } from "./components/app.Overview/main"
import DrawingsPage from "@/app/project/detail/[projectcode]/drawings/page"
import { ThreeDMain } from "./components/app.3D/main"
import { MembersMain } from "./components/app.Members/main"
import { ScheduleMain } from "./components/app.Schedule/main"
import { TasksMain } from "./components/app.Tasks/main"
import { RelatedMain } from "./components/app.Related/main"
import { DesignMain } from "./components/app.Design/main"
import { ManufacturingMain } from "./components/app.Manufacturing/main"
import { ConstructionMain } from "./components/app.Construction/main"
import { DocumentsMain } from "./components/app.Documents/main"
import { GenbaMain } from "./components/app.Genba/main"
import { MeetingsMain } from "./components/app.Meetings/main"
import { ControlMain } from "./components/app.Control/main"
import { SequenceControl } from "./components/app.Control/sequence"
import { HMIControl } from "./components/app.Control/hmi"

// タブとコンポーネントのマッピング
const TAB_MAPPING: Record<string, { 
  component: React.ComponentType<any>
}> = {
  "main": { component: OverviewMain },
  "overview": { component: OverviewMain },
  "drawings": { component: DrawingsPage },
  "3d": { component: ThreeDMain },
  "members": { component: MembersMain },
  "schedule": { component: ScheduleMain },
  "minutes": { component: MeetingsMain },
  "field": { component: GenbaMain },
  "tasks": { component: TasksMain },
  "related": { component: RelatedMain },
  "design": { component: DesignMain },
  "manufacturing": { component: ManufacturingMain },
  "construction": { component: ConstructionMain },
  "documents": { component: DocumentsMain },
  "reports": { component: GenbaMain },
  "meetings": { component: MeetingsMain },
  "control": { component: ControlMain },
  "sequence": { component: SequenceControl },
  "hmi": { component: HMIControl }
};

// Next.jsのパラメータ型を定義
type Params = {
  projectcode: string;
  tab: string;
  content: string;
}

export default function ProjectDetailPage({ params }: { params: { projectcode: string; tab: string; content: string } }) {
  const router = useRouter();
  const { projectcode, tab, content } = params;
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // プロジェクトコードのみのURLにアクセスされた場合、メインタブにリダイレクト
    if (!tab || !content) {
      router.push(`/project/detail/${projectcode}/overview/main`);
      return;
    }

    async function fetchProject() {
      try {
        const response = await fetch(`/api/project/detail/${projectcode}`)
        if (!response.ok) {
          if (response.status === 404) {
            return notFound()
          }
          throw new Error("Failed to fetch project")
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectcode, tab, content, router])

  if (loading) {
    return <div className="container mx-auto py-2 text-center">読み込み中...</div>
  }

  if (!project) {
    return notFound()
  }

  // 不正なタブの場合はメインタブにリダイレクト
  if (!TAB_MAPPING[tab]) {
    router.push(`/project/detail/${projectcode}/overview/main`);
    return null;
  }
  
  // 現在のタブに対応するコンポーネントを取得
  const TabComponent = TAB_MAPPING[tab].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainTabHeader projectcode={projectcode} currentTab={tab} />
      <SubTabHeader
        projectcode={projectcode}
        currentTab={tab}
        currentContent={content}
      />
      <div className="container mx-auto py-2">
        <TabComponent project={project} mockData={mockData} />
      </div>
    </div>
  )
} 