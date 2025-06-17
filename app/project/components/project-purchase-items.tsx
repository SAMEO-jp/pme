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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface PurchaseItem {
  project_id: string
  equipmentNumber: string
  sequenceNumber: string
  itemName: string
  quantity: number
  unit: string
  specifications: string
  status: string
  notes: string
}

interface ProjectPurchaseItemsProps {
  projectId: string
}

interface EquipmentOption {
  equipmentNumber: string
  equipmentName: string
}

export function ProjectPurchaseItems({ projectId }: ProjectPurchaseItemsProps) {
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    equipmentNumber: "",
    sequenceNumber: "",
    itemName: "",
    quantity: 1,
    unit: "",
    specifications: "",
    status: "",
    notes: ""
  })
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    keyID: "",
    equipmentNumber: "",
    sequenceNumber: "",
    itemName: "",
    quantity: 1,
    unit: "",
    specifications: "",
    status: "",
    notes: ""
  })
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [purchaseItemOptions, setPurchaseItemOptions] = useState<PurchaseItem[]>([])
  const [selectedPurchaseItem, setSelectedPurchaseItem] = useState<string>("")
  const [selectedPurchaseItemName, setSelectedPurchaseItemName] = useState<string>("")
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>([])
  const [selectedEquipmentNumber, setSelectedEquipmentNumber] = useState<string>("")
  const [selectedEquipmentName, setSelectedEquipmentName] = useState<string>("")

  useEffect(() => {
    const fetchPurchaseItems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // プロジェクトの設備番号を取得
        const equipmentResponse = await fetch(`/api/project-equipment?projectCode=${projectId}`)
        const equipmentData = await equipmentResponse.json()
        
        if (!equipmentData.success) {
          throw new Error("設備番号の取得に失敗しました")
        }

        // 設備番号取得ロジックは残す
        const equipmentNumbers = equipmentData.data
        // 購入品取得ロジックは一旦削除
        setPurchaseItems([])
      } catch (err) {
        setError(err instanceof Error ? err.message : "購入品の取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseItems()
  }, [projectId])

  useEffect(() => {
    const fetchAllPurchaseItems = async () => {
      try {
        const res = await fetch(`/api/project-purchase-items?projectCode=${projectId}`)
        const data = await res.json()
        if (data.success) {
          setPurchaseItemOptions(data.data)
        } else {
          setPurchaseItemOptions([])
        }
      } catch (e) {
        setPurchaseItemOptions([])
      }
    }
    fetchAllPurchaseItems()
  }, [projectId])

  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const res = await fetch(`/api/project-equipment?projectCode=${projectId}`)
        const data = await res.json()
        if (data.success) {
          setEquipmentOptions(data.data)
        } else {
          setEquipmentOptions([])
        }
      } catch (e) {
        setEquipmentOptions([])
      }
    }
    fetchEquipmentOptions()
  }, [projectId])

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (purchaseItems.length === 0) {
    return <div className="text-center py-4">購入品が登録されていません</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>購入品リスト</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>追加</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block font-medium mb-1">購入品番号（設備番号 - 品名）</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={selectedPurchaseItem}
            onChange={e => {
              const val = e.target.value
              setSelectedPurchaseItem(val)
              if (val === "") {
                setSelectedPurchaseItemName("未選択")
              } else {
                const found = purchaseItemOptions.find(opt => opt.equipmentNumber === val)
                setSelectedPurchaseItemName(found ? found.itemName : "")
              }
            }}
          >
            <option value="">-----!　未選択</option>
            {purchaseItemOptions.map(opt => (
              <option key={opt.equipmentNumber + opt.sequenceNumber} value={opt.equipmentNumber}>
                {opt.equipmentNumber} - {opt.itemName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">品名</label>
          <Input value={selectedPurchaseItemName || "未選択"} readOnly className="w-full" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">設備番号（設備名称）</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={selectedEquipmentNumber}
            onChange={e => {
              const val = e.target.value
              setSelectedEquipmentNumber(val)
              if (val === "") {
                setSelectedEquipmentName("未選択")
              } else {
                const found = equipmentOptions.find(opt => opt.equipmentNumber === val)
                setSelectedEquipmentName(found ? found.equipmentName : "")
              }
            }}
          >
            <option value="">-----!　未選択</option>
            {equipmentOptions.map(opt => (
              <option key={opt.equipmentNumber} value={opt.equipmentNumber}>
                {opt.equipmentNumber} - {opt.equipmentName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">設備名称</label>
          <Input value={selectedEquipmentName || "未選択"} readOnly className="w-full" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>設備番号</TableHead>
              <TableHead>連番</TableHead>
              <TableHead>品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>仕様</TableHead>
              <TableHead>状態</TableHead>
              <TableHead>備考</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseItems.map((item, index) => (
              <TableRow key={`${item.equipmentNumber}-${item.sequenceNumber}-${index}`}>
                <TableCell>{item.equipmentNumber}</TableCell>
                <TableCell>{item.sequenceNumber}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.specifications}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "完了" ? "default" : "secondary"}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.notes}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditForm({ ...item, keyID: "" })
                    setEditOpen(true)
                  }}>編集</Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => setDeleteTarget(item)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>購入品の追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="設備番号" value={form.equipmentNumber} onChange={e => setForm({ ...form, equipmentNumber: e.target.value })} />
            <Input placeholder="連番" value={form.sequenceNumber} onChange={e => setForm({ ...form, sequenceNumber: e.target.value })} />
            <Input placeholder="品名" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} />
            <Input placeholder="数量" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
            <Input placeholder="単位" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            <Input placeholder="仕様" value={form.specifications} onChange={e => setForm({ ...form, specifications: e.target.value })} />
            <Input placeholder="状態" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
            <Input placeholder="備考" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>購入品の編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="設備番号" value={editForm.equipmentNumber} disabled />
            <Input placeholder="連番" value={editForm.sequenceNumber} onChange={e => setEditForm({ ...editForm, sequenceNumber: e.target.value })} />
            <Input placeholder="品名" value={editForm.itemName} onChange={e => setEditForm({ ...editForm, itemName: e.target.value })} />
            <Input placeholder="数量" type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: Number(e.target.value) })} />
            <Input placeholder="単位" value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })} />
            <Input placeholder="仕様" value={editForm.specifications} onChange={e => setEditForm({ ...editForm, specifications: e.target.value })} />
            <Input placeholder="状態" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} />
            <Input placeholder="備考" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>キャンセル</Button>
            <Button>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <div>本当に「{deleteTarget?.itemName}」を削除しますか？</div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
            <Button variant="destructive">削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 