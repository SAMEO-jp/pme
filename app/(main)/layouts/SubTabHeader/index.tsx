"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SubTabHeaderProps {
  tabs: {
    name: string
    href: string
  }[]
}

export function SubTabHeader({ tabs }: SubTabHeaderProps) {
  const pathname = usePathname()

  // メインページかどうかを判定
  const isMainPage = pathname === "/" || pathname.startsWith("/dashboard")

  // メインページ以外の場合は表示しない
  if (!isMainPage) {
    return null
  }

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-2 px-4 text-sm font-medium ${
                pathname === tab.href
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 