'use client';

import { useState, useEffect } from 'react';

interface TableInfo {
  name: string;
  type: string;
  tbl_name: string;
  sql: string;
}

export default function DatabaseTableListPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/dtamp/api/tables');
        if (!res.ok) throw new Error('APIエラー');
        const data = await res.json();
        setTables(data);
      } catch (e: any) {
        setError(e.message || '不明なエラー');
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // 現在のページのデータを計算
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tables.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tables.length / itemsPerPage);

  // ページ切り替えハンドラー
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">データ管理システム</h1> */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">すべてのテーブル</h2>
        {loading ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">テーブル名</th>
                  <th className="py-2 px-4 border">種別</th>
                  <th className="py-2 px-4 border">アクション</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((table) => (
                  <tr key={table.name} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border font-mono">{table.name}</td>
                    <td className="py-2 px-4 border">{table.type}</td>
                    <td className="py-2 px-4 border text-blue-600 space-x-4">
                      <button className="hover:underline">表示</button>
                      <button className="hover:underline">編集</button>
                      <button className="hover:underline">カラム設定</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  前へ
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 