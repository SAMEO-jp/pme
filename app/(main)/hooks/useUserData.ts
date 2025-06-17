import { useState, useEffect } from "react"

interface Employee {
  employeeNumber: string
  name: string
  name_japanese: string
  user_id: string
}

interface UserData {
  employeeNumber: string
  name: string
}

export function useUserData() {
  const [currentUser, setCurrentUser] = useState<UserData>({ employeeNumber: "999999", name: "仮ログイン" })
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()
        if (data.success) {
          setCurrentUser(data.data)
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
      }
    }

    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees")
        const data = await response.json()
        if (data.success) {
          const formattedEmployees: Employee[] = data.data.map((emp: any) => ({
            employeeNumber: emp.employeeNumber,
            name: emp.name,
            name_japanese: emp.name_japanese || emp.name,
            user_id: emp.user_id || emp.employeeNumber
          }))
          setEmployees(formattedEmployees)
        }
      } catch (error) {
        console.error("従業員情報の取得に失敗しました:", error)
      }
    }

    fetchCurrentUser()
    fetchEmployees()
  }, [])

  // ログイン処理
  const handleLogin = async () => {
    if (!selectedUserId) return

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      })

      const data = await response.json()
      if (data.success) {
        setCurrentUser(data.data)
        setShowLoginModal(false)
        alert(`${data.data.name}としてログインしました`)
      } else {
        alert(`ログインに失敗しました: ${data.message}`)
      }
    } catch (error) {
      console.error("ログイン処理に失敗しました:", error)
      alert("ログイン処理に失敗しました")
    }
  }

  return {
    currentUser,
    setCurrentUser,
    employees,
    setEmployees,
    showLoginModal,
    setShowLoginModal,
    selectedUserId,
    setSelectedUserId,
    handleLogin
  }
} 