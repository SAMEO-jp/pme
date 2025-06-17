"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            PMEデータHUB
          </Link>
        </div>
      </div>
    </header>
  )
} 