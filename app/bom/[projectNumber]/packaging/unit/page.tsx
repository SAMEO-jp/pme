'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KonpoUnit {
  KONPO_TANNI_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  PART_KO: number;
  ZENSU_KO: number;
  BUZAI_WEIGHT: number;
  TOTAL_WEIGHT: number;
  KONPO_LIST_ID: string | null;
}

interface UnlinkedPart {
  PART_ID: string;
  PART_NAME: string;
  MANUFACTURER: string;
  ZUMEN_ID: string;
}

interface KonpoList {
  KONPO_LIST_ID: string;
  PROJECT_ID: string;
  KONPO_LIST_WEIGHT: number;
  HASSOU_IN: string;
  HASSOU_TO: string;
  IMAGE_ID: string;
  status: string;
  units?: KonpoUnit[];
}

// 3桁区切りカンマを<sup>ｔ</sup>に置換するフォーマット関数
const formatWithT = (value: number) => {
  if (!isFinite(value)) return '-';
  const str = Number(value).toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return str.replace(/,/g, '<sup>ｔ</sup>');
};

export default function KonpoUnitPage() {
  const params = useParams();
  const router = useRouter();
  const projectNumber = params.projectNumber as string;
  const [konpoUnits, setKonpoUnits] = useState<KonpoUnit[]>([]);
  const [unlinkedParts, setUnlinkedParts] = useState<UnlinkedPart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<UnlinkedPart | null>(null);
  const [partKo, setPartKo] = useState<string>('1');
  const [zensuKo, setZensuKo] = useState<string>('1');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("units");
  const [expandedLists, setExpandedLists] = useState<string[]>([]);
  const [konpoLists, setKonpoLists] = useState<KonpoList[]>([]);

  useEffect(() => {
    fetchKonpoUnits();
    fetchUnlinkedParts();
  }, [projectNumber]);

  useEffect(() => {
    if (konpoUnits.length > 0) {
      // 梱包リストごとにグループ化
      const lists = konpoUnits.reduce((acc: { [key: string]: KonpoUnit[] }, unit) => {
        if (unit.KONPO_LIST_ID) {
          if (!acc[unit.KONPO_LIST_ID]) {
            acc[unit.KONPO_LIST_ID] = [];
          }
          acc[unit.KONPO_LIST_ID].push(unit);
        }
        return acc;
      }, {});

      // 梱包リストの配列を作成
      const konpoListsArray = Object.entries(lists).map(([listId, units]) => ({
        KONPO_LIST_ID: listId,
        units,
        totalWeight: units.reduce((sum, unit) => sum + unit.TOTAL_WEIGHT, 0)
      }));

      setKonpoLists(konpoListsArray);
    }
  }, [konpoUnits]);

  const fetchKonpoUnits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching konpo units for project:', projectNumber);
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit`);
      if (!response.ok) {
        throw new Error('梱包単位の取得に失敗しました');
      }
      const data = await response.json();
      console.log('Fetched konpo units:', data);
      setKonpoUnits(data);
    } catch (error) {
      console.error('梱包単位の取得に失敗しました:', error);
      setError(error instanceof Error ? error.message : '梱包単位の取得に失敗しました');
      toast.error('梱包単位の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnlinkedParts = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/parts/unlinked`);
      if (!response.ok) {
        throw new Error('未連携部品の取得に失敗しました');
      }
      const data = await response.json();
      setUnlinkedParts(data);
    } catch (error) {
      console.error('未連携部品の取得に失敗しました:', error);
      toast.error('未連携部品の取得に失敗しました');
    }
  };

  const handleCreateUnit = async () => {
    if (!selectedPart) {
      toast.error('部品を選択してください');
      return;
    }

    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PART_ID: selectedPart.PART_ID,
          ZUMEN_ID: selectedPart.ZUMEN_ID,
          PART_KO: parseInt(partKo),
          ZENSU_KO: parseInt(zensuKo),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '梱包単位の作成に失敗しました');
      }

      setIsCreateDialogOpen(false);
      setSelectedPart(null);
      setPartKo('1');
      setZensuKo('1');
      fetchKonpoUnits();
      fetchUnlinkedParts();
      toast.success('梱包単位を作成しました');
    } catch (error) {
      console.error('梱包単位の作成に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '梱包単位の作成に失敗しました');
    }
  };

  const handleUpdateUnit = async (unitId: string, partKo: number, zensuKo: number) => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          KONPO_TANNI_ID: unitId,
          PART_KO: partKo,
          ZENSU_KO: zensuKo,
        }),
      });

      if (!response.ok) {
        throw new Error('梱包単位の更新に失敗しました');
      }

      fetchKonpoUnits();
      toast.success('梱包単位を更新しました');
    } catch (error) {
      console.error('梱包単位の更新に失敗しました:', error);
      toast.error('梱包単位の更新に失敗しました');
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('この梱包単位を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit?id=${unitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('梱包単位の削除に失敗しました');
      }

      fetchKonpoUnits();
      fetchUnlinkedParts();
      toast.success('梱包単位を削除しました');
    } catch (error) {
      console.error('梱包単位の削除に失敗しました:', error);
      toast.error('梱包単位の削除に失敗しました');
    }
  };

  const handleBack = () => {
    router.push(`/bom/${projectNumber}/packaging`);
  };

  const handleListMake = async () => {
    if (selectedUnits.length === 0) {
      toast.error('梱包単位を選択してください');
      return;
    }

    try {
      // 選択された梱包単位IDの中で最も若い番号のものを取得
      const firstSelectedId = selectedUnits.sort()[0];
      // KT-をKL-に置換
      const konpoListId = firstSelectedId.replace('KT-', 'KL-');

      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          konpoListId,
          konpoTanniIds: selectedUnits
        }),
      });

      if (!response.ok) {
        throw new Error('梱包リストの作成に失敗しました');
      }

      toast.success('梱包リストを作成しました');
      setSelectedUnits([]); // 選択をクリア
      fetchKonpoUnits(); // 一覧を更新
    } catch (error) {
      console.error('梱包リストの作成に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '梱包リストの作成に失敗しました');
    }
  };

  const handleBulkCreate = async () => {
    if (unlinkedParts.length === 0) {
      toast.info('新規登録可能な部品はありません');
      return;
    }

    if (!confirm(`${unlinkedParts.length}個の部品を梱包単位に登録しますか？`)) {
      return;
    }

    try {
      console.log('Starting bulk create for parts:', unlinkedParts);
      const promises = unlinkedParts.map(part => {
        console.log('Creating konpo unit for part:', part);
        return fetch(`/api/bom/${projectNumber}/packaging/unit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PART_ID: part.PART_ID,
            ZUMEN_ID: part.ZUMEN_ID,
            PART_KO: 1,
            ZENSU_KO: 1,
          }),
        });
      });

      const results = await Promise.all(promises);
      console.log('Bulk create results:', results);
      const hasError = results.some(response => !response.ok);

      if (hasError) {
        throw new Error('一部の梱包単位の作成に失敗しました');
      }

      await fetchKonpoUnits();
      await fetchUnlinkedParts();
      toast.success(`${unlinkedParts.length}個の梱包単位を作成しました`);
    } catch (error) {
      console.error('梱包単位の一括作成に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '梱包単位の一括作成に失敗しました');
    }
  };

  const handleUpdateWeights = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit/part_tanni_weight`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('梱包単位の重量更新に失敗しました');
      }

      const data = await response.json();
      toast.success(`${data.updatedCount}件の梱包単位の重量を更新しました`);
      fetchKonpoUnits(); // 一覧を更新
    } catch (error) {
      console.error('梱包単位の重量更新に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '梱包単位の重量更新に失敗しました');
    }
  };

  const handleRefreshParts = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/unit/refresh_parts`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('部品情報の再更新に失敗しました');
      }
      const data = await response.json();
      toast.success(`${data.updatedCount}件の部品情報を再更新しました`);
      fetchKonpoUnits();
    } catch (error) {
      console.error('部品情報の再更新に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '部品情報の再更新に失敗しました');
    }
  };

  const handleCheckboxChange = (konpoTanniId: string) => {
    setSelectedUnits(prev => {
      if (prev.includes(konpoTanniId)) {
        return prev.filter(id => id !== konpoTanniId);
      } else {
        return [...prev, konpoTanniId];
      }
    });
  };

  const toggleListExpand = (listId: string) => {
    setExpandedLists(prev => {
      if (prev.includes(listId)) {
        return prev.filter(id => id !== listId);
      } else {
        return [...prev, listId];
      }
    });
  };

  const handleCreateKonpoList = async () => {
    try {
      // 梱包リストの作成
      const promises = konpoLists.map(async (list) => {
        const response = await fetch(`/api/bom/${projectNumber}/packaging/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            konpoListId: list.KONPO_LIST_ID,
            totalWeight: list.totalWeight
          }),
        });

        if (!response.ok) {
          throw new Error(`梱包リスト ${list.KONPO_LIST_ID} の作成に失敗しました`);
        }

        return response.json();
      });

      await Promise.all(promises);
      toast.success('梱包リストを作成しました');
    } catch (error) {
      console.error('梱包リストの作成に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '梱包リストの作成に失敗しました');
    }
  };

  const fetchKonpoLists = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/packaging/list`);
      if (!response.ok) {
        throw new Error('梱包リストの取得に失敗しました');
      }
      const data = await response.json();
      setKonpoLists(data);
    } catch (error) {
      console.error('梱包リストの取得に失敗しました:', error);
      toast.error('梱包リストの取得に失敗しました');
    }
  };

  useEffect(() => {
    if (activeTab === "lists") {
      fetchKonpoLists();
    }
  }, [activeTab, projectNumber]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CardTitle>梱包単位管理</CardTitle>
            </div>
            <div className="flex gap-2">
              {activeTab === "units" && (
                <>
                  <Button 
                    onClick={handleListMake}
                    disabled={selectedUnits.length === 0}
                  >
                    リスト作成 ({selectedUnits.length})
                  </Button>
                  <Button onClick={handleBack}>戻る</Button>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    disabled={unlinkedParts.length === 0}
                  >
                    新規梱包単位作成
                  </Button>
                  <Button
                    onClick={handleBulkCreate}
                    disabled={unlinkedParts.length === 0}
                    variant="secondary"
                  >
                    一括作成 ({unlinkedParts.length})
                  </Button>
                </>
              )}
              {activeTab === "lists" && (
                <>
                  <Button
                    onClick={handleCreateKonpoList}
                    disabled={konpoLists.length === 0}
                  >
                    梱包リスト作成 ({konpoLists.length})
                  </Button>
                  <Button onClick={handleBack}>戻る</Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="units">梱包単位</TabsTrigger>
              <TabsTrigger value="lists">梱包リスト</TabsTrigger>
            </TabsList>
            <TabsContent value="units">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>梱包単位ID</TableHead>
                    <TableHead>部数</TableHead>
                    <TableHead>全数</TableHead>
                    <TableHead className="text-right">単位重量</TableHead>
                    <TableHead className="text-right">梱包単位重量</TableHead>
                    <TableHead>梱包リストID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {konpoUnits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          梱包単位が登録されていません。
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    konpoUnits.map((unit) => (
                      <TableRow key={unit.KONPO_TANNI_ID}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUnits.includes(unit.KONPO_TANNI_ID)}
                            onCheckedChange={() => handleCheckboxChange(unit.KONPO_TANNI_ID)}
                          />
                        </TableCell>
                        <TableCell>{unit.KONPO_TANNI_ID}</TableCell>
                        <TableCell>{unit.PART_KO}</TableCell>
                        <TableCell>{unit.ZENSU_KO}</TableCell>
                        <TableCell className="text-right" dangerouslySetInnerHTML={{ __html: formatWithT(Number(unit.BUZAI_WEIGHT)) }} />
                        <TableCell className="text-right" dangerouslySetInnerHTML={{ __html: formatWithT(Number(unit.TOTAL_WEIGHT)) }} />
                        <TableCell>{unit.KONPO_LIST_ID || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="lists">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>梱包リストID</TableHead>
                    <TableHead>発送元</TableHead>
                    <TableHead>発送先</TableHead>
                    <TableHead>画像ID</TableHead>
                    <TableHead className="text-right">梱包ユニット重量</TableHead>
                    <TableHead>状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {konpoLists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500">
                          梱包リストが登録されていません。
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    konpoLists.map((list) => (
                      <TableRow key={list.KONPO_LIST_ID}>
                        <TableCell>{list.KONPO_LIST_ID}</TableCell>
                        <TableCell>{list.HASSOU_IN}</TableCell>
                        <TableCell>{list.HASSOU_TO}</TableCell>
                        <TableCell>{list.IMAGE_ID}</TableCell>
                        <TableCell className="text-right" dangerouslySetInnerHTML={{ __html: formatWithT(list.KONPO_LIST_WEIGHT) }} />
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            list.status === '登録済' ? 'bg-green-100 text-green-800' :
                            list.status === '要更新' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {list.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 新規梱包単位作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規梱包単位作成</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="part" className="text-right">
                部品
              </Label>
              <Select
                value={selectedPart?.PART_ID}
                onValueChange={(value) => {
                  const part = unlinkedParts.find(p => p.PART_ID === value);
                  setSelectedPart(part || null);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="部品を選択" />
                </SelectTrigger>
                <SelectContent>
                  {unlinkedParts.map((part) => (
                    <SelectItem key={part.PART_ID} value={part.PART_ID}>
                      {part.PART_ID} - {part.PART_NAME}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="partKo" className="text-right">
                部品個数
              </Label>
              <Input
                id="partKo"
                type="number"
                min="1"
                value={partKo}
                onChange={(e) => setPartKo(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zensuKo" className="text-right">
                全数個数
              </Label>
              <Input
                id="zensuKo"
                type="number"
                min="1"
                value={zensuKo}
                onChange={(e) => setZensuKo(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreateUnit}>
              作成
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 