'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function KonpoManagement() {
  const params = useParams();
  const router = useRouter();
  const projectNumber = params?.projectNumber as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlinkedCount, setUnlinkedCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnlinkedCount = async () => {
      try {
        const response = await fetch(`/api/bom/${projectNumber}/konpo_list/unlinked/count`);
        if (!response.ok) {
          throw new Error('未連携部品数の取得に失敗しました');
        }
        const data = await response.json();
        setUnlinkedCount(data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUnlinkedCount();
  }, [projectNumber]);

  const handleBulkCreate = async () => {
    try {
      const response = await fetch(`/api/bom/${projectNumber}/konpo_list/bulk`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('一括作成に失敗しました');
      }
      // 作成後に未連携部品数を再取得
      const countResponse = await fetch(`/api/bom/${projectNumber}/konpo_list/unlinked/count`);
      if (!countResponse.ok) {
        throw new Error('未連携部品数の取得に失敗しました');
      }
      const countData = await countResponse.json();
      setUnlinkedCount(countData.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">梱包単位を整理する - {projectNumber}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          戻る
        </button>
      </div>

      {/* メニュー部分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 梱包単位の一括作成 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">梱包単位の一括作成</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              未連携の部品から梱包単位を一括で作成します。
              現在の未連携部品数: <span className="font-bold">{unlinkedCount}件</span>
            </p>
            <button
              onClick={handleBulkCreate}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
            >
              未連携部品から梱包単位を作成
            </button>
          </div>
        </div>

        {/* 梱包単位の管理 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">梱包単位の管理</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              梱包単位の一覧表示、編集、削除などの管理機能を提供します。
            </p>
            <button
              onClick={() => router.push(`/app_bom/${projectNumber}/konpo_list/konpo_tanni`)}
              className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors"
            >
              梱包単位一覧を表示
            </button>
          </div>
        </div>

        {/* 梱包リストの出力 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">梱包リストの出力</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              梱包リストをPDFやExcel形式で出力します。
            </p>
            <button
              onClick={() => router.push(`/app_bom/${projectNumber}/konpo_list/export`)}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 transition-colors"
            >
              梱包リストを出力
            </button>
          </div>
        </div>

        {/* 梱包単位の設定 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">梱包単位の設定</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              梱包単位のデフォルト設定や、梱包ルールの管理を行います。
            </p>
            <button
              onClick={() => router.push(`/app_bom/${projectNumber}/konpo_list/settings`)}
              className="w-full bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition-colors"
            >
              設定を開く
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 