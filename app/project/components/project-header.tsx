"use client"

import { useRouter, usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

export function ProjectHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    // 現在のパスに基づいてアクティブなタブを設定
    if (pathname.includes("/project/home")) {
      setActiveTab("home")
    } else if (pathname.includes("/project/projectlist")) {
      setActiveTab("list")
    } else if (pathname.includes("/project/person")) {
      setActiveTab("myprojects")
    } else if (pathname.includes("/project/management")) {
      setActiveTab("management")
    } else if (pathname.includes("/project/blast-furnace")) {
      setActiveTab("blast-furnace")
    } else if (pathname.includes("/project/steel-making")) {
      setActiveTab("steel-making")
    } else if (pathname.includes("/project/cdq")) {
      setActiveTab("cdq")
    } else if (pathname.includes("/project/rolling")) {
      setActiveTab("rolling")
    } else if (pathname.includes("/project/continuous-casting")) {
      setActiveTab("continuous-casting")
    }
  }, [pathname])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    switch (value) {
      case "home":
        router.push("/project/home")
        break
      case "list":
        router.push("/project/projectlist/all")
        break
      case "myprojects":
        router.push("/project/person/current")
        break
      case "blast-furnace":
        router.push("/project/blast-furnace")
        break
      case "steel-making":
        router.push("/project/steel-making")
        break
      case "cdq":
        router.push("/project/cdq")
        break
      case "rolling":
        router.push("/project/rolling")
        break
      case "continuous-casting":
        router.push("/project/continuous-casting")
        break
      case "management":
        router.push("/project/management")
        break
    }
  }

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="w-full px-6">
          <TabsList className="w-full justify-start bg-transparent border-0 flex overflow-x-auto overflow-y-hidden">
            <TabsTrigger 
              value="home" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              ホーム
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              一覧
            </TabsTrigger>
            <TabsTrigger 
              value="myprojects" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              マイPro
            </TabsTrigger>
            <TabsTrigger 
              value="blast-furnace" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              高炉
            </TabsTrigger>
            <TabsTrigger 
              value="steel-making" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              製鋼
            </TabsTrigger>
            <TabsTrigger 
              value="cdq" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              CDQ
            </TabsTrigger>
            <TabsTrigger 
              value="rolling" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              圧延
            </TabsTrigger>
            <TabsTrigger 
              value="continuous-casting" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              連鋳
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              className="text-base px-6 py-4 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:bg-gray-50 whitespace-nowrap"
            >
              Pro管理
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </Tabs>
  )
}