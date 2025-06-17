import React from "react";
import Link from "next/link";

export function FormsSection() {
  const formCategories = [
    { id: "project", name: "プロジェクト関連帳票", count: 12 },
    { id: "quality", name: "品質管理帳票", count: 8 },
    { id: "procurement", name: "調達関連帳票", count: 6 },
    { id: "contract", name: "契約関連帳票", count: 10 },
    { id: "inspection", name: "検査関連帳票", count: 9 },
    { id: "maintenance", name: "保守・メンテナンス帳票", count: 7 },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">帳票類作成一覧</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formCategories.map((category) => (
          <Link key={category.id} href={`/file-management/forms/${category.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-40 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-500 mt-1">登録帳票数: {category.count}</p>
              </div>
              <div className="text-blue-600 text-sm font-medium">
                作成・閲覧 →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">最近作成した帳票</h3>
          <Link href="/file-management/forms/recent" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            すべて表示 →
          </Link>
        </div>
        
        <div className="space-y-2">
          <div className="border-b pb-2">
            <div className="font-medium">工事発注見積依頼書</div>
            <div className="text-sm text-gray-500">作成日: 2025/05/08</div>
          </div>
          <div className="border-b pb-2">
            <div className="font-medium">月次進捗報告書</div>
            <div className="text-sm text-gray-500">作成日: 2025/05/05</div>
          </div>
          <div className="border-b pb-2">
            <div className="font-medium">品質検査チェックリスト</div>
            <div className="text-sm text-gray-500">作成日: 2025/05/01</div>
          </div>
        </div>
      </div>
    </div>
  );
} 