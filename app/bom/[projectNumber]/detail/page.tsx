'use client';

import { useParams } from 'next/navigation';
import { useDrawings } from '../../hooks/useDrawings';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DrawingDetail, Drawing, Part } from '../../types/drawing';
import { fetchDrawingDetails, fetchBuzaiDetails } from '../../libs/api/drawings';
import { BuzaiDetail } from '../../types/drawing';

export default function BOMDetailDrawingPage() {
  const params = useParams();
  const projectNumber = params.projectNumber as string;
  const { drawings, loading, error } = useDrawings(projectNumber);
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingDetail | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [buzaiDetails, setBuzaiDetails] = useState<BuzaiDetail[]>([]);
  const [buzaiLoading, setBuzaiLoading] = useState(false);
  const [buzaiError, setBuzaiError] = useState<string | null>(null);

  if (loading) return <div className="p-4">図面を読み込み中...</div>;
  if (error) return <div className="p-4 text-red-500">エラー: {error.message}</div>;

  // 詳細図のみをフィルタリングし、重複を除去
  const uniqueDetailDrawings = Array.from(
    new Map(
      drawings
        .filter(drawing => 
          drawing.Zumen_Kind === '詳細図' || drawing.Zumen_Kind === '詳細'
        )
        .map(drawing => [drawing.Zumen_ID, drawing])
    ).values()
  );

  const handleDrawingClick = async (drawingId: string) => {
    setSelectedDrawingId(drawingId);
    try {
      const data = await fetchDrawingDetails(projectNumber, drawingId);
      if (data.drawing && data.parts) {
        setSelectedDrawing(data);
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching drawing details:', error);
    }
  };

  // 部品選択時に材料明細を取得
  const handlePartClick = async (part: Part) => {
    setSelectedPart(part);
    setBuzaiDetails([]);
    setBuzaiError(null);
    if (!selectedDrawing?.drawing) return;
    setBuzaiLoading(true);
    try {
      const details = await fetchBuzaiDetails(projectNumber, selectedDrawing.drawing.Zumen_ID, part.PART_ID);
      setBuzaiDetails(details);
    } catch (e: any) {
      setBuzaiError(e.message);
    } finally {
      setBuzaiLoading(false);
    }
  };

  // 数値を安全にフォーマットする関数
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return Number(value).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">詳細図一覧 - プロジェクト番号: {projectNumber}</h1>
        <div className="flex gap-2">
          <Link 
            href={`/bom/${projectNumber}/assembly`}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            組立図
          </Link>
          <Link 
            href={`/bom/${projectNumber}/packaging`}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            梱包
          </Link>
          <Link 
            href={`/bom/${projectNumber}/manufacturing`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            製造
          </Link>
          <Link 
            href={`/bom/${projectNumber}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            戻る
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 図面一覧 */}
        <div className="bg-white rounded-lg shadow p-4 col-span-1">
          <h2 className="text-xl font-semibold mb-4">図面一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">図面番号</th>
                  <th className="px-4 py-2 text-left">図面名</th>
                  <th className="px-4 py-2 text-left">リビジョン</th>
                  <th className="px-4 py-2 text-left">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {uniqueDetailDrawings.map((drawing) => (
                  <tr 
                    key={drawing.Zumen_ID} 
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      selectedDrawingId === drawing.Zumen_ID ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleDrawingClick(drawing.Zumen_ID)}
                  >
                    <td className="px-4 py-2">{drawing.Zumen_ID}</td>
                    <td className="px-4 py-2">{drawing.Zumen_Name}</td>
                    <td className="px-4 py-2">{drawing.rev_number}</td>
                    <td className="px-4 py-2">{drawing.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 選択された図面の詳細（部品リスト） */}
        {selectedDrawing?.drawing ? (
          <div className="bg-white rounded-lg shadow p-4 col-span-1">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDrawing.drawing.Zumen_Name} の詳細
            </h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    図面番号: {selectedDrawing.drawing.Zumen_ID}
                  </p>
                  <p className="text-sm text-gray-600">
                    リビジョン: {selectedDrawing.drawing.rev_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    部品数: {selectedDrawing.parts.length} 種類
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部品番号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部品名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メーカー
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部品重量（合計, kg）
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedDrawing.parts.map((part) => (
                    <tr key={part.PART_ID} className={`hover:bg-blue-100 cursor-pointer ${selectedPart?.PART_ID === part.PART_ID ? 'bg-blue-50' : ''}`}
                        onClick={() => handlePartClick(part)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {part.PART_ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {part.part_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {part.manufacturer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {isFinite(Number(part.total_weight)) ? Number(part.total_weight).toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center h-full col-span-1">
            <p className="text-gray-500">図面を選択してください</p>
          </div>
        )}

        {/* 部品詳細パネル */}
        <div className="bg-white rounded-lg shadow p-4 col-span-1 flex flex-col min-h-[200px]">
          {selectedPart ? (
            <>
              <h3 className="text-lg font-semibold mb-2">部品詳細</h3>
              <div className="mb-2"><span className="font-bold">部品番号：</span>{selectedPart.PART_ID}</div>
              <div className="mb-2"><span className="font-bold">部品名：</span>{selectedPart.part_name}</div>
              <div className="mb-2"><span className="font-bold">メーカー：</span>{selectedPart.manufacturer}</div>
              <div className="mb-2"><span className="font-bold">部品重量（合計, kg）：</span>{isFinite(Number(selectedPart.total_weight)) ? Number(selectedPart.total_weight).toFixed(2) : '-'}</div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">材料明細</h4>
                {buzaiLoading ? (
                  <div className="text-gray-400">読み込み中...</div>
                ) : buzaiError ? (
                  <div className="text-red-500">{buzaiError}</div>
                ) : buzaiDetails.length === 0 ? (
                  <div className="text-gray-400">材料明細がありません</div>
                ) : (
                  <table className="min-w-full text-xs border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 border">BUZAI_ID</th>
                        <th className="px-2 py-1 border">材料名</th>
                        <th className="px-2 py-1 border">単位重量(kg)</th>
                        <th className="px-2 py-1 border">数量</th>
                        <th className="px-2 py-1 border">合計重量(kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buzaiDetails.map((buzai) => (
                        <tr key={buzai.Buzai_ID}>
                          <td className="px-2 py-1 border font-mono">{buzai.Buzai_ID}</td>
                          <td className="px-2 py-1 border">{buzai.ZAISITU_name}</td>
                          <td className="px-2 py-1 border text-right">{buzai.unit_weight}</td>
                          <td className="px-2 py-1 border text-right">{buzai.quantity}</td>
                          <td className="px-2 py-1 border text-right">{buzai.total_weight.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center my-auto">部品を選択してください</div>
          )}
        </div>
      </div>
    </div>
  );
} 