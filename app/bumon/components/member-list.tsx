"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/bumon/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, LogOut, MoveRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { MemberHistory } from "@/lib/bumon/types"
import { AddMemberForm } from "./add-member-form"
import { LeaveMemberDialog } from "./leave-member-dialog"
import { TransferMemberDialog } from "./transfer-member-dialog"

interface MemberListProps {
  bumon_id: string
}

export function MemberList({ bumon_id }: MemberListProps) {
  const [members, setMembers] = useState<MemberHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<MemberHistory | null>(null)

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bumon/member-history?departmentCode=${bumon_id}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error("メンバー情報の取得に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "メンバー情報の取得中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [bumon_id])

  const handleDelete = async (id: number) => {
    if (!confirm("このメンバー履歴を削除してもよろしいですか？")) {
      return
    }

    try {
      const response = await fetch(`/api/bumon/member-history/${id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // 成功したらメンバーリストから削除
      setMembers(members.filter((member) => member.id !== id))

      toast({
        title: "メンバー履歴が削除されました",
        description: "メンバー履歴の削除が完了しました。",
      })
    } catch (error) {
      console.error("メンバー履歴の削除に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "メンバー履歴の削除中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  const handleLeaveClick = (member: MemberHistory) => {
    setSelectedMember(member)
    setLeaveDialogOpen(true)
  }

  const handleTransferClick = (member: MemberHistory) => {
    setSelectedMember(member)
    setTransferDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">メンバーデータを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">メンバー一覧</h3>
        <Button size="sm" onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規メンバー追加
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>役職</TableHead>
              <TableHead>配属日</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  メンバーデータがありません
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.memberName}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {member.status === "在籍中" && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleTransferClick(member)}>
                            <MoveRight className="h-4 w-4" />
                            <span className="sr-only">移動</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleLeaveClick(member)}>
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">退職</span>
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* メンバー追加ダイアログ */}
      <AddMemberForm
        bumon_id={bumon_id}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchMembers}
      />

      {/* メンバー退職ダイアログ */}
      <LeaveMemberDialog
        member={selectedMember}
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        onSuccess={fetchMembers}
      />

      {/* メンバー移動ダイアログ */}
      <TransferMemberDialog
        member={selectedMember}
        currentDepartmentCode={bumon_id}
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        onSuccess={fetchMembers}
      />
    </div>
  )
}
