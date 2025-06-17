"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import type { ProjectMember } from "@project/projectmember"
import { useRouter } from "next/navigation"

type ManageMainProps = {
  projectcode: string;
}

export function ManageMain({ projectcode }: ManageMainProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMembers();
  }, [projectcode]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/project/${projectcode}/member`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      // 在籍中のメンバーのみをフィルタリング
      const activeMembers = data.filter((member: ProjectMember) => !member.end_date);
      setMembers(activeMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleAddMemberClick = () => {
    if (!projectcode) {
      console.error('Project code is undefined');
      return;
    }
    router.push(`/project/detail/${projectcode}/manage/member/new`);
  };

  // 退出処理
  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('本当にこのメンバーを退出させますか？')) return;
    try {
      const res = await fetch(`/api/project/${projectcode}/member`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        fetchMembers();
      } else {
        alert('退出処理に失敗しました');
      }
    } catch (e) {
      alert('退出処理でエラーが発生しました');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>設備番号管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleEditClick}>
              {isEditMode ? '編集終了' : '編集'}
            </Button>
            <Button onClick={handleAddMemberClick}>メンバー追加</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>社員番号</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>電話番号</TableHead>
              <TableHead>部門</TableHead>
              <TableHead>室</TableHead>
              <TableHead>課</TableHead>
              {isEditMode && <TableHead>操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user_id}</TableCell>
                <TableCell>{member.user.name_japanese}</TableCell>
                <TableCell>{member.user.TEL}</TableCell>
                <TableCell>{member.user.bumon}</TableCell>
                <TableCell>{member.user.sitsu}</TableCell>
                <TableCell>{member.user.ka}</TableCell>
                {isEditMode && (
                  <TableCell>
                    <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(member.user_id)}>
                      退出させる
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 