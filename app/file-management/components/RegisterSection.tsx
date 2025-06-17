import React from "react";
import Link from "next/link";

export function RegisterSection() {
  const items = [
    { label: "プロジェクト資料登録", path: "/file-management/register/project" },
    { label: "技術資料登録", path: "/file-management/register/tech" },
    { label: "購入品資料共有情報", path: "/file-management/register/purchase" },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">資料登録</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link key={item.label} href={item.path} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex items-center justify-center text-lg font-medium text-gray-800 h-32 cursor-pointer text-center">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 