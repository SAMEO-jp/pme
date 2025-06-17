import React from "react";
import Link from "next/link";

export function TechViewSection() {
  const techCategories = [
    { id: "WBS", name: "WBS・設備技術", icon: "📊" },
    { id: "ELEM", name: "要素技術", icon: "⚙️" },
  ];
  
  // 疑似データ
  const recentTechDocs = [
    { id: "TECH001", name: "電動機制御システム設計ガイドライン", category: "要素技術" },
    { id: "TECH002", name: "配管設計基準書", category: "WBS・設備技術" },
    { id: "TECH003", name: "工場自動化システム導入手順書", category: "要素技術" },
    { id: "TECH004", name: "計装システム構成図", category: "WBS・設備技術" },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">技術資料閲覧</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {techCategories.map((category) => (
          <Link key={category.id} href={`/file-management/tech-view/${category.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex items-center text-lg font-medium text-gray-800 h-32 cursor-pointer">
              <div className="text-3xl mr-4">{category.icon}</div>
              <div>
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-gray-500 mt-1">関連技術資料を閲覧</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-3">最近閲覧された技術資料</h3>
        <div className="grid grid-cols-1 gap-2">
          {recentTechDocs.map((doc) => (
            <Link key={doc.id} href={`/file-management/tech-view/document/${doc.id}`} className="block">
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium">{doc.name}</div>
                <div className="text-sm text-gray-500">カテゴリ: {doc.category}</div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-right">
          <Link href="/file-management/tech-view/search" className="text-blue-600 hover:text-blue-800 font-medium">
            技術資料を検索 →
          </Link>
        </div>
      </div>
    </div>
  );
} 