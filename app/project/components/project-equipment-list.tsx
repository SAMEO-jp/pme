"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Equipment {
  project_id: string
  equipment_id: string
  equipment_Name: string
  equipment_Description: string
  id_kind: string
}

interface ProjectEquipmentListProps {
  projectId: string
}

export function ProjectEquipmentList({ projectId }: ProjectEquipmentListProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    equipment_id: "",
    equipment_Name: "",
    equipment_Description: "",
    id_kind: ""
  })
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    equipment_id: "",
    equipment_Name: "",
    equipment_Description: "",
    id_kind: ""
  })
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null)

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/project-equipment-list?projectId=${projectId}`)
        const data = await response.json()
        
        if (data.success) {
          setEquipments(data.data)
        } else {
          throw new Error(data.message || "設備情報の取得に失敗しました")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "設備情報の取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchEquipments()
  }, [projectId])

  const handleAdd = async () => {
    if (!form.equipment_id || !form.equipment_Name) {
      alert("設備番号と設備名は必須です")
      return
    }
    try {
      const res = await fetch("/api/project-equipment-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          equipment_id: form.equipment_id,
          equipment_Name: form.equipment_Name,
          equipment_Description: form.equipment_Description,
          id_kind: form.id_kind
        })
      })
      const data = await res.json()
      if (data.success) {
        setOpen(false)
        setForm({ equipment_id: "", equipment_Name: "", equipment_Description: "", id_kind: "" })
        // 再取得
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/project-equipment-list?projectId=${projectId}`)
        const newData = await response.json()
        if (newData.success) {
          setEquipments(newData.data)
        } else {
          setError(newData.message || "設備情報の取得に失敗しました")
        }
        setLoading(false)
      } else {
        alert(data.message || "追加に失敗しました")
      }
    } catch (e) {
      alert("追加中にエラーが発生しました")
    }
  }

  const handleEdit = async () => {
    if (!editForm.equipment_id || !editForm.equipment_Name) {
      alert("設備番号と設備名は必須です")
      return
    }
    try {
      const res = await fetch("/api/project-equipment-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          equipment_id: editForm.equipment_id,
          equipment_Name: editForm.equipment_Name,
          equipment_Description: editForm.equipment_Description,
          id_kind: editForm.id_kind
        })
      })
      const data = await res.json()
      if (data.success) {
        setEditOpen(false)
        // 再取得
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/project-equipment-list?projectId=${projectId}`)
        const newData = await response.json()
        if (newData.success) {
          setEquipments(newData.data)
        } else {
          setError(newData.message || "設備情報の取得に失敗しました")
        }
        setLoading(false)
      } else {
        alert(data.message || "編集に失敗しました")
      }
    } catch (e) {
      alert("編集中にエラーが発生しました")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch("/api/project-equipment-list", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          equipment_id: deleteTarget.equipment_id
        })
      })
      const data = await res.json()
      if (data.success) {
        setDeleteTarget(null)
        // 再取得
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/project-equipment-list?projectId=${projectId}`)
        const newData = await response.json()
        if (newData.success) {
          setEquipments(newData.data)
        } else {
          setError(newData.message || "設備情報の取得に失敗しました")
        }
        setLoading(false)
      } else {
        alert(data.message || "削除に失敗しました")
      }
    } catch (e) {
      alert("削除中にエラーが発生しました")
    }
  }

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (equipments.length === 0) {
    return <div className="text-center py-4">設備情報が登録されていません</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>設備情報リスト</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>追加</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>設備番号</TableHead>
              <TableHead>設備名</TableHead>
              <TableHead>設備説明</TableHead>
              <TableHead>種別</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipments.map((equipment) => (
              <TableRow key={`${equipment.project_id}-${equipment.equipment_id}`}>
                <TableCell>{equipment.equipment_id}</TableCell>
                <TableCell>{equipment.equipment_Name}</TableCell>
                <TableCell>{equipment.equipment_Description}</TableCell>
                <TableCell>{equipment.id_kind}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditForm(equipment)
                    setEditOpen(true)
                  }}>編集</Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => setDeleteTarget(equipment)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設備情報の追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="設備番号"
              value={form.equipment_id}
              onChange={e => setForm({ ...form, equipment_id: e.target.value })}
            />
            <Input
              placeholder="設備名"
              value={form.equipment_Name}
              onChange={e => setForm({ ...form, equipment_Name: e.target.value })}
            />
            <Input
              placeholder="設備説明"
              value={form.equipment_Description}
              onChange={e => setForm({ ...form, equipment_Description: e.target.value })}
            />
            <Input
              placeholder="種別"
              value={form.id_kind}
              onChange={e => setForm({ ...form, id_kind: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button onClick={handleAdd}>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設備情報の編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="設備番号"
              value={editForm.equipment_id}
              disabled
            />
            <Input
              placeholder="設備名"
              value={editForm.equipment_Name}
              onChange={e => setEditForm({ ...editForm, equipment_Name: e.target.value })}
            />
            <Input
              placeholder="設備説明"
              value={editForm.equipment_Description}
              onChange={e => setEditForm({ ...editForm, equipment_Description: e.target.value })}
            />
            <Input
              placeholder="種別"
              value={editForm.id_kind}
              onChange={e => setEditForm({ ...editForm, id_kind: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>キャンセル</Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <div>本当に「{deleteTarget?.equipment_Name}」を削除しますか？</div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleDelete}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 