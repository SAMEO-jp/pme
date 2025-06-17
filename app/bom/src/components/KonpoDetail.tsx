import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KonpoUnit {
  KONPO_UNIT_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  PARCENTAGE: string;
  KONPO_LIST_ID: string;
  zumen: {
    Zumen_name: string;
    Zumen_number: string;
  };
  part: {
    part_name: string;
    manufacturer: string;
  };
}

interface KonpoList {
  KONPO_LIST_ID: string;
  project_ID: string;
  weight: string;
  HASSOU_IN: string;
  HASSOU_TO: string;
  IMAGE_ID?: string;
  konpo_units: KonpoUnit[];
  project: {
    project_name: string;
    project_number: string;
  };
}

interface KonpoDetailProps {
  projectNumber: string;
  konpoId: string;
  onClose: () => void;
}

export default function KonpoDetail({ projectNumber, konpoId, onClose }: KonpoDetailProps) {
  const [konpo, setKonpo] = useState<KonpoList | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    ZUMEN_ID: '',
    PART_ID: '',
    PARCENTAGE: '',
  });

  useEffect(() => {
    fetchKonpoDetail();
  }, [konpoId]);

  const fetchKonpoDetail = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/${konpoId}`);
      const data = await response.json();
      setKonpo(data);
    } catch (error) {
      console.error('梱包リストの詳細取得に失敗しました:', error);
    }
  };

  const handleAddUnit = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/${konpoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...konpo,
          konpo_units: [
            ...(konpo?.konpo_units || []),
            {
              ZUMEN_ID: newUnit.ZUMEN_ID,
              PART_ID: newUnit.PART_ID,
              PARCENTAGE: newUnit.PARCENTAGE,
            },
          ],
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setNewUnit({
          ZUMEN_ID: '',
          PART_ID: '',
          PARCENTAGE: '',
        });
        fetchKonpoDetail();
      }
    } catch (error) {
      console.error('梱包単位の追加に失敗しました:', error);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('この梱包単位を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/${konpoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...konpo,
          konpo_units: konpo?.konpo_units.filter(unit => unit.KONPO_UNIT_ID !== unitId) || [],
        }),
      });

      if (response.ok) {
        fetchKonpoDetail();
      }
    } catch (error) {
      console.error('梱包単位の削除に失敗しました:', error);
    }
  };

  if (!konpo) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            梱包リスト詳細
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mr-2">梱包単位追加</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>梱包単位の追加</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ZUMEN_ID" className="text-right">
                        図面ID
                      </Label>
                      <Input
                        id="ZUMEN_ID"
                        value={newUnit.ZUMEN_ID}
                        onChange={(e) => setNewUnit({ ...newUnit, ZUMEN_ID: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="PART_ID" className="text-right">
                        部品ID
                      </Label>
                      <Input
                        id="PART_ID"
                        value={newUnit.PART_ID}
                        onChange={(e) => setNewUnit({ ...newUnit, PART_ID: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="PARCENTAGE" className="text-right">
                        割合
                      </Label>
                      <Input
                        id="PARCENTAGE"
                        value={newUnit.PARCENTAGE}
                        onChange={(e) => setNewUnit({ ...newUnit, PARCENTAGE: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddUnit}>追加</Button>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={onClose}>
                閉じる
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">基本情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>プロジェクト:</strong> {konpo.project.project_name}</p>
                <p><strong>重量:</strong> {konpo.weight} kg</p>
              </div>
              <div>
                <p><strong>発送元:</strong> {konpo.HASSOU_IN}</p>
                <p><strong>発送先:</strong> {konpo.HASSOU_TO}</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">梱包単位一覧</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>図面番号</TableHead>
                <TableHead>図面名</TableHead>
                <TableHead>部品名</TableHead>
                <TableHead>メーカー</TableHead>
                <TableHead>割合</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {konpo.konpo_units.map((unit) => (
                <TableRow key={unit.KONPO_UNIT_ID}>
                  <TableCell>{unit.zumen.Zumen_number}</TableCell>
                  <TableCell>{unit.zumen.Zumen_name}</TableCell>
                  <TableCell>{unit.part.part_name}</TableCell>
                  <TableCell>{unit.part.manufacturer}</TableCell>
                  <TableCell>{unit.PARCENTAGE}%</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUnit(unit.KONPO_UNIT_ID)}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 