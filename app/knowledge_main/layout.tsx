import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ナレッジ管理システム',
  description: 'ナレッジ管理システム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
