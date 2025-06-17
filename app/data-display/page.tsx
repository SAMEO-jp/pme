import { redirect } from "next/navigation"

export default function DataDisplayRedirect() {
  // 現在の年月を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // 現在の年月のページにリダイレクト
  redirect(`/data-display/${currentYear}/${currentMonth}`)
}
