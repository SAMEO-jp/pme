'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Zumen } from '@utils/db';

export default function ZumenListBySouti() {
  const params = useParams();
  const router = useRouter();
  const projectNumber = params?.projectNumber as string;
  const soutiId = params?.soutiId as string;
  const [zumens, setZumens] = useState<Zumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchZumens = async () => {
      try {
        const response = await fetch(`/api/bom/${projectNumber}/zumen_list`);
        if (!response.ok) {
          throw new Error('図面データの取得に失敗しました');
        }
        const data = await response.json();
        // 重複を除去し、最新のRev番号のデータを優先
        const uniqueZumens = data.reduce((acc: Zumen[], current: Zumen) => {
          const existingIndex = acc.findIndex(item => item.Zumen_ID === current.Zumen_ID);
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            // 既存のデータと比較して、Rev番号が大きい方を保持
            const existingRev = parseInt(acc[existingIndex].rev_number) || 0;
            const currentRev = parseInt(current.rev_number) || 0;
            if (currentRev > existingRev) {
              acc[existingIndex] = current;
            }
          }
          return acc;
        }, []);

        // 装置コードでフィルタリング
        const filteredZumens = soutiId === 'all' 
          ? uniqueZumens 
          : uniqueZumens.filter((z: Zumen) => z.Souti_ID === soutiId);

        // Rev番号でソート
        const sortedZumens = filteredZumens.sort((a: Zumen, b: Zumen) => {
          const revA = parseInt(a.rev_number) || 0;
          const revB = parseInt(b.rev_number) || 0;
          return revB - revA;
        });

        setZumens(sortedZumens);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchZumens();
  }, [projectNumber, soutiId]);

  const handleZumenClick = (zumenId: string) => {
    router.push(`/app_bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedZumens = [...zumens].sort((a, b) => {
    const compareResult = a.Zumen_ID.localeCompare(b.Zumen_ID);
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {soutiId === 'all' ? '全ての図面一覧' : `装置コード ${soutiId} の図面一覧`} - {projectNumber}
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          戻る
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={toggleSortOrder}
                >
                  図面ID {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面種類</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">組立図面</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">装置ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">装置名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rev</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者A1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者B1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者C1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出図日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作図者A</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作図者B</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作図日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">縮尺</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">サイズ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedZumens.map((zumen) => (
                <tr
                  key={zumen.ROWID}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleZumenClick(zumen.Zumen_ID)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Kind}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Kumitate_Zumen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Souti_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Souti_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.rev_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Tantou_a1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Tantou_b1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Tantou_c1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Syutuzubi_Date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Sakuzu_a}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Sakuzu_b}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Sakuzu_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Scale}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 