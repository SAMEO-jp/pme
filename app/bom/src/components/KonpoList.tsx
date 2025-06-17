'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface KonpoListProps {
  projectNumber: string;
  onSelectKonpo: (id: string) => void;
}

export default function KonpoList({ projectNumber, onSelectKonpo }: KonpoListProps) {
  const router = useRouter();
  const [konpoLists, setKonpoLists] = useState<KonpoList[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKonpo, setNewKonpo] = useState({
    project_ID: '',
    weight: '',
    HASSOU_IN: '',
    HASSOU_TO: '',
    IMAGE_ID: '',
  });

  useEffect(() => {
    fetchKonpoLists();
  }, [projectNumber]);

  const fetchKonpoLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/bom/${projectNumber}/packaging`);
      if (!response.ok) {
        throw new Error('梱包リストの取得に失敗しました');
      }
      const data = await response.json();
      setKonpoLists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('梱包リストの取得に失敗しました:', error);
      setError('梱包リストの取得に失敗しました');
      setKonpoLists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKonpo = async () => {
    try {
      // 現在の日時を取得して梱包IDを生成
      const now = new Date();
      const KONPO_LIST_ID = `KP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

      const response = await fetch(`/api/bom/${projectNumber}/packaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          KONPO_LIST_ID,
          project_ID: projectNumber,
          weight: newKonpo.weight || '0',
          HASSOU_IN: newKonpo.HASSOU_IN || '未設定',
          HASSOU_TO: newKonpo.HASSOU_TO || '未設定',
          IMAGE_ID: newKonpo.IMAGE_ID || '',
          konpo_units: [],
        }),
      });

      if (!response.ok) {
        throw new Error('梱包リストの作成に失敗しました');
      }

      setIsDialogOpen(false);
      setNewKonpo({
        project_ID: '',
        weight: '',
        HASSOU_IN: '',
        HASSOU_TO: '',
        IMAGE_ID: '',
      });
      fetchKonpoLists();
    } catch (error) {
      console.error('梱包リストの作成に失敗しました:', error);
      setError('梱包リストの作成に失敗しました');
    }
  };

  const handleDeleteKonpo = async (konpoId: string) => {
    if (!confirm('この梱包リストを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/${konpoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('梱包リストの削除に失敗しました');
      }

      fetchKonpoLists();
    } catch (error) {
      console.error('梱包リストの削除に失敗しました:', error);
      setError('梱包リストの削除に失敗しました');
    }
  };

  const handleNavigateToUnit = () => {
    router.push(`/bom/${projectNumber}/packaging/unit`);
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            梱包リスト
            <div className="flex gap-2">
              <Button onClick={handleNavigateToUnit}>
                梱包UNIT
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>新規作成</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新規梱包リスト作成</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project_ID" className="text-right">
                        プロジェクトID
                      </Label>
                      <Input
                        id="project_ID"
                        value={newKonpo.project_ID}
                        onChange={(e) => setNewKonpo({ ...newKonpo, project_ID: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="weight" className="text-right">
                        重量
                      </Label>
                      <Input
                        id="weight"
                        value={newKonpo.weight}
                        onChange={(e) => setNewKonpo({ ...newKonpo, weight: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="HASSOU_IN" className="text-right">
                        発送元
                      </Label>
                      <Input
                        id="HASSOU_IN"
                        value={newKonpo.HASSOU_IN}
                        onChange={(e) => setNewKonpo({ ...newKonpo, HASSOU_IN: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="HASSOU_TO" className="text-right">
                        発送先
                      </Label>
                      <Input
                        id="HASSOU_TO"
                        value={newKonpo.HASSOU_TO}
                        onChange={(e) => setNewKonpo({ ...newKonpo, HASSOU_TO: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="IMAGE_ID" className="text-right">
                        画像ID
                      </Label>
                      <Input
                        id="IMAGE_ID"
                        value={newKonpo.IMAGE_ID}
                        onChange={(e) => setNewKonpo({ ...newKonpo, IMAGE_ID: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateKonpo}>作成</Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>梱包ID</TableHead>
                <TableHead>プロジェクト</TableHead>
                <TableHead>重量</TableHead>
                <TableHead>発送元</TableHead>
                <TableHead>発送先</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {konpoLists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    梱包リストがありません
                  </TableCell>
                </TableRow>
              ) : (
                konpoLists.map((konpo) => (
                  <TableRow key={konpo.KONPO_LIST_ID}>
                    <TableCell>{konpo.KONPO_LIST_ID}</TableCell>
                    <TableCell>{konpo.project?.project_name || '未設定'}</TableCell>
                    <TableCell>{konpo.weight} kg</TableCell>
                    <TableCell>{konpo.HASSOU_IN}</TableCell>
                    <TableCell>{konpo.HASSOU_TO}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => onSelectKonpo(konpo.KONPO_LIST_ID)}
                      >
                        詳細
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKonpo(konpo.KONPO_LIST_ID)}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 