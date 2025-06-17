'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Zumen, getZumenByProjectId } from '../../src/utils/db';

export default function ZumenList() {
  const params = useParams();
  const router = useRouter();
  const projectNumber = params?.projectNumber as string;
  const [zumens, setZumens] = useState<Zumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soutiCodes, setSoutiCodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchZumens = async () => {
      try {
        const response = await fetch(`/api/bom/${projectNumber}/zumen_list`);
        if (!response.ok) {
          throw new Error('図面データの取得に失敗しました');
        }
        const data = await response.json();
        setZumens(data);
        
        // 装置コードの一覧を取得（重複を除去）
        const uniqueSoutiCodes = Array.from(new Set(data.map((z: Zumen) => z.Souti_ID))).filter((id): id is string => id !== null && id !== undefined);
        setSoutiCodes(uniqueSoutiCodes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchZumens();
  }, [projectNumber]);

  const handleSoutiClick = (soutiId: string) => {
    router.push(`/app_bom/${projectNumber}/zumen_list/${soutiId}`);
  };

  const handleAllClick = () => {
    router.push(`/app_bom/${projectNumber}/zumen_list/all`);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">図面一覧 - {projectNumber}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          戻る
        </button>
      </div>

      {/* メニュー部分 */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">全ての図面を表示する</h2>
          <button
            onClick={handleAllClick}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            ALL
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">装置コード毎に表示する</h2>
          <div className="grid grid-cols-4 gap-4">
            {soutiCodes.map((soutiId) => (
              <button
                key={soutiId}
                onClick={() => handleSoutiClick(soutiId)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-left"
              >
                {soutiId}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 