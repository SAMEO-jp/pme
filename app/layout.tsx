import type React from "react"
import "./globals.css"
import { LayoutProvider } from "./(main)/contexts/LayoutContext"
import RootLayout from "./(main)/RootLayout"

export const metadata = {
  title: "PME",
  description: "PME System",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <LayoutProvider>
          <RootLayout>{children}</RootLayout>
        </LayoutProvider>
      </body>
    </html>
  )
} 