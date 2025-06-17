'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Zumen } from '@utils/db';

type Tab = 'main' | 'related';

interface Part {
  ROWID: number;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string;
  REMARKS: string;
}

interface RelatedZumen {
  Zumen_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  KANREN_ZUMEN: string;
}

interface Buzai {
  ROWID: number;
  BUZAI_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}

export default function ZumenDetail({
  params,
  searchParams,
}: {
  params: { projectNumber: string; soutiId: string; zumenid: string };
  searchParams: { type?: string };
}) {
  const { projectNumber, soutiId, zumenid: zumenId } = params;
  const zumenType = searchParams.type || '詳細図';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [parts, setParts] = useState<Part[]>([]);
  const [relatedZumens, setRelatedZumens] = useState<RelatedZumen[]>([]);
  const [referencingZumens, setReferencingZumens] = useState<RelatedZumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPartId, setExpandedPartId] = useState<number | null>(null);
  const [buzaiData, setBuzaiData] = useState<Record<number, Buzai[]>>({});
  const [buzaiLoading, setBuzaiLoading] = useState<Record<number, boolean>>({});
  const [buzaiError, setBuzaiError] = useState<Record<number, string | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!projectNumber || !soutiId || !zumenId) {
          throw new Error('必要なパラメータが不足しています');
        }
        if (activeTab === 'main') {
          // 部品データの取得
          const response = await fetch(`/api/bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}/parts`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '部品データの取得に失敗しました');
          }
          const data = await response.json();
          if (!data || data.length === 0) {
            setParts([]);
          } else {
            setParts(data);
          }
        } else {
          // 関連図面データの取得
          const response = await fetch(`/api/bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}/related`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '関連図面データの取得に失敗しました');
          }
          const data = await response.json();
          if (!data || data.length === 0) {
            setRelatedZumens([]);
          } else {
            setRelatedZumens(data);
          }
        }

        // 組立図の場合、この図面を参照している図面を取得
        if (zumenType === '組図') {
          const referencingResponse = await fetch(`/api/bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}/referencing`);
          if (referencingResponse.ok) {
            const referencingData = await referencingResponse.json();
            setReferencingZumens(referencingData);
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectNumber, soutiId, zumenId, activeTab, zumenType]);

  const handleZumenClick = (zumenId: string) => {
    router.push(`/app_bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}`);
  };

  const handlePartRowClick = async (part: Part) => {
    if (expandedPartId === part.ROWID) {
      setExpandedPartId(null);
      return;
    }
    setExpandedPartId(part.ROWID);
    if (!buzaiData[part.ROWID]) {
      setBuzaiLoading((prev) => ({ ...prev, [part.ROWID]: true }));
      setBuzaiError((prev) => ({ ...prev, [part.ROWID]: null }));
      try {
        const response = await fetch(`/api/bom/${projectNumber}/zumen_list/${soutiId}/${zumenId}/buzai/${part.PART_ID}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '部材データの取得に失敗しました');
        }
        const data = await response.json();
        setBuzaiData((prev) => ({ ...prev, [part.ROWID]: data }));
      } catch (err) {
        setBuzaiError((prev) => ({ ...prev, [part.ROWID]: err instanceof Error ? err.message : 'エラーが発生しました' }));
      } finally {
        setBuzaiLoading((prev) => ({ ...prev, [part.ROWID]: false }));
      }
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          図面詳細 - {zumenId} <span className="text-sm font-normal text-gray-600">({zumenType})</span>
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          戻る
        </button>
      </div>

      {/* タブメニュー */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('main')}
            className={`${
              activeTab === 'main'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            メイン
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`${
              activeTab === 'related'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            関連
          </button>
        </nav>
      </div>

      {/* メインコンテンツ */}
      {activeTab === 'main' ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部品ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部品名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予備数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手配区分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手配ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メーカー</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">単重</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parts.map((part) => (
                  <React.Fragment key={part.ROWID}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          type="button"
                          onClick={() => handlePartRowClick(part)}
                          className="focus:outline-none"
                          aria-label="部材展開"
                        >
                          {expandedPartId === part.ROWID ? '▼' : '▶'}
                        </button>
                        {part.PART_ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.PART_NAME}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.QUANTITY}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.SPARE_QUANTITY}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.TEHAI_DIVISION}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.TEHAI_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.MANUFACTURER}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.PART_TANNI_WEIGHT}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.REMARKS}</td>
                    </tr>
                    {expandedPartId === part.ROWID && (
                      <tr>
                        <td colSpan={9} className="bg-gray-50 px-6 py-4">
                          {buzaiLoading[part.ROWID] ? (
                            <div>部材データ読み込み中...</div>
                          ) : buzaiError[part.ROWID] ? (
                            <div className="text-red-500">{buzaiError[part.ROWID]}</div>
                          ) : buzaiData[part.ROWID] && buzaiData[part.ROWID].length > 0 ? (
                            <>
                              {/* 合計重量表示 */}
                              <div className="mb-2 font-bold text-blue-700 text-right">
                                合計重量: {
                                  (() => {
                                    const total = buzaiData[part.ROWID]
                                      .reduce((sum, b) => {
                                        const q = parseFloat(b.BUZAI_QUANTITY) || 0;
                                        const w = parseFloat(b.BUZAI_WEIGHT) || 0;
                                        return sum + (q * w);
                                      }, 0);
                                    let formatted = '';
                                    if (total >= 1000) {
                                      // 4桁以上: カンマの直前にtonを上付きで挿入
                                      const intStr = Math.floor(total).toLocaleString();
                                      const commaIdx = intStr.indexOf(',');
                                      if (commaIdx !== -1) {
                                        formatted = `${intStr.slice(0, commaIdx)}<sup>t</sup>${intStr.slice(commaIdx)}`;
                                      } else {
                                        formatted = intStr;
                                      }
                                    } else if (total >= 10) {
                                      // 3桁: 小数点なし
                                      formatted = Math.floor(total).toLocaleString();
                                    } else {
                                      // 2桁未満: 小数点2桁
                                      formatted = total.toLocaleString(undefined, { maximumFractionDigits: 2 });
                                    }
                                    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
                                  })()
                                } kg
                              </div>
                              <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部材ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部材名称</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">単重量</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">材質</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {buzaiData[part.ROWID].map((buzai) => (
                                    <tr key={buzai.ROWID}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{buzai.BUZAI_ID}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{buzai.BUZAI_NAME}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{buzai.BUZAI_QUANTITY}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{buzai.BUZAI_WEIGHT}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{buzai.ZAISITU_NAME}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </>
                          ) : (
                            <div>部材データはありません</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面種類</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">関連区分</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 重複を排除した関連図面の表示 */}
                {Array.from(new Map(relatedZumens.map(zumen => [zumen.Zumen_ID, zumen])).values()).map((zumen) => {
                  const isKumitate = zumen.Kumitate_Zumen?.includes(zumenId);
                  return (
                    <tr
                      key={zumen.Zumen_ID}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleZumenClick(zumen.Zumen_ID)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Kind}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {isKumitate ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            組立図面
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            関連図面
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* 組立図の場合、この図面を参照している図面を表示 */}
                {zumenType === '組図' && referencingZumens.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={4} className="px-6 py-3 bg-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">この図面を組立図として参照している図面</h3>
                      </td>
                    </tr>
                    {Array.from(new Map(referencingZumens.map(zumen => [zumen.Zumen_ID, zumen])).values()).map((zumen) => (
                      <tr
                        key={zumen.Zumen_ID}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleZumenClick(zumen.Zumen_ID)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zumen.Zumen_Kind}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            詳細図
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}