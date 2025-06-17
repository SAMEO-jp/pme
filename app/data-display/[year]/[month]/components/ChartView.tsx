"use client"

import { useState, useEffect } from "react"
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipItem,
  Scale,
  Tick
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Chart.jsコンポーネントの登録
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

// 色のパレット
const COLORS = [
  '#4299E1', // blue
  '#48BB78', // green
  '#ED8936', // orange
  '#9F7AEA', // purple
  '#F56565', // red
  '#38B2AC', // teal
  '#ED64A6', // pink
  '#ECC94B', // yellow
  '#667EEA', // indigo
  '#D53F8C', // pink
  '#805AD5', // purple
  '#DD6B20', // orange
  '#3182CE', // blue
  '#38A169', // green
  '#E53E3E', // red
]

interface ProjectSummaryProps {
  year: number
  month: number
}

interface SummaryData {
  projectSummary: Array<{
    projectNumber: string
    projectName: string
    taskCount: number
    totalHours: number
    type: string
  }>
  typeSummary: Array<{
    type: string
    taskCount: number
    totalHours: number
  }>
}

interface ProjectData {
  projectNumber: string
  projectName: string
  totalHours: number
  taskCount: number
}

export default function ChartView({ year, month }: ProjectSummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/achievements/summary/${year}/${month}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        if (data.success) {
          setSummaryData(data.data)
        } else {
          throw new Error(data.message || "データの取得に失敗しました")
        }
      } catch (error: unknown) {
        console.error("データの取得中にエラーが発生しました:", error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("不明なエラーが発生しました")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, month])

  // プロジェクト別のデータをグラフ用に整形
  const prepareProjectChartData = () => {
    if (!summaryData || !summaryData.projectSummary.length) return null

    // プロジェクトコードごとにデータを集計
    const projectData: Record<string, ProjectData> = {}
    summaryData.projectSummary.forEach(item => {
      if (!projectData[item.projectNumber]) {
        projectData[item.projectNumber] = {
          projectNumber: item.projectNumber,
          projectName: item.projectName || `不明(${item.projectNumber})`,
          totalHours: 0,
          taskCount: 0
        }
      }
      projectData[item.projectNumber].totalHours += item.totalHours
      projectData[item.projectNumber].taskCount += item.taskCount
    })

    const projectArray = Object.values(projectData)
    projectArray.sort((a: ProjectData, b: ProjectData) => b.totalHours - a.totalHours)

    // 上位5件のみ表示し、それ以外は「その他」としてまとめる
    let finalData = projectArray.slice(0, 5)
    const otherProjects = projectArray.slice(5)
    
    if (otherProjects.length > 0) {
      const otherData: ProjectData = {
        projectNumber: "others",
        projectName: "その他",
        totalHours: otherProjects.reduce((sum: number, item: ProjectData) => sum + item.totalHours, 0),
        taskCount: otherProjects.reduce((sum: number, item: ProjectData) => sum + item.taskCount, 0)
      }
      finalData.push(otherData)
    }

    return {
      labels: finalData.map((item: ProjectData) => item.projectName),
      datasets: [
        {
          data: finalData.map((item: ProjectData) => item.totalHours),
          backgroundColor: COLORS.slice(0, finalData.length),
          borderColor: Array(finalData.length).fill('#fff'),
          borderWidth: 1,
        },
      ],
    }
  }

  // 業務タイプ別のデータを整形
  const prepareTypeChartData = () => {
    if (!summaryData || !summaryData.typeSummary.length) return null

    return {
      labels: summaryData.typeSummary.map(item => item.type),
      datasets: [
        {
          label: '業務時間（時間）',
          data: summaryData.typeSummary.map(item => item.totalHours),
          backgroundColor: COLORS.slice(0, summaryData.typeSummary.length),
        },
      ],
    }
  }

  const projectChartData = prepareProjectChartData()
  const typeChartData = prepareTypeChartData()

  // グラフのオプション
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'pie'>) {
            const label = tooltipItem.label || ''
            const value = tooltipItem.raw as number || 0
            const hours = Math.floor(value)
            const minutes = Math.round((value - hours) * 60)
            return `${label}: ${hours}時間${minutes > 0 ? ` ${minutes}分` : ''}`
          }
        }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            const value = tooltipItem.raw as number || 0
            const hours = Math.floor(value)
            const minutes = Math.round((value - hours) * 60)
            return `${hours}時間${minutes > 0 ? ` ${minutes}分` : ''}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale<any>, tickValue: string | number) {
            return tickValue + '時間'
          }
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました: {error}
      </div>
    )
  }

  if (!summaryData || (!summaryData.projectSummary.length && !summaryData.typeSummary.length)) {
    return (
      <div className="text-center py-8 text-gray-500">
        {year}年{month}月のプロジェクトデータはありません
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">プロジェクト別業務時間</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            {projectChartData && <Pie data={projectChartData} options={pieOptions} />}
          </div>
          <div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">プロジェクト</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">業務時間</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">タスク数</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {projectChartData && projectChartData.labels.map((label, index) => {
                  const projectData = Object.values(summaryData.projectSummary.reduce((acc: Record<string, ProjectData>, curr) => {
                    if (!acc[curr.projectNumber]) {
                      acc[curr.projectNumber] = {
                        projectNumber: curr.projectNumber,
                        projectName: curr.projectName || `不明(${curr.projectNumber})`,
                        totalHours: 0,
                        taskCount: 0
                      }
                    }
                    acc[curr.projectNumber].totalHours += curr.totalHours
                    acc[curr.projectNumber].taskCount += curr.taskCount
                    return acc
                  }, {})).sort((a: ProjectData, b: ProjectData) => b.totalHours - a.totalHours)
                  
                  const project = index < 5 
                    ? projectData[index]
                    : {
                        projectName: "その他",
                        totalHours: projectData.slice(5).reduce((sum: number, item: ProjectData) => sum + item.totalHours, 0),
                        taskCount: projectData.slice(5).reduce((sum: number, item: ProjectData) => sum + item.taskCount, 0)
                      }

                  const hours = Math.floor(project.totalHours)
                  const minutes = Math.round((project.totalHours - hours) * 60)
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="inline-block h-3 w-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          {project.projectName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {hours}時間{minutes > 0 ? ` ${minutes}分` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {project.taskCount}件
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">業務タイプ別集計</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            {typeChartData && <Bar data={typeChartData} options={barOptions} />}
          </div>
          <div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">業務タイプ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">業務時間</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">タスク数</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {summaryData.typeSummary.map((type, index) => {
                  const hours = Math.floor(type.totalHours)
                  const minutes = Math.round((type.totalHours - hours) * 60)
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="inline-block h-3 w-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          {type.type}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {hours}時間{minutes > 0 ? ` ${minutes}分` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {type.taskCount}件
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 