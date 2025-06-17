import React from "react";
import Link from "next/link";

export function ProjectViewSection() {
  // プロジェクト資料閲覧用の疑似データ
  const recentProjects = [
    { id: "PRJ001", name: "大阪工場建設プロジェクト" },
    { id: "PRJ002", name: "東京支社リノベーション" },
    { id: "PRJ003", name: "名古屋倉庫拡張計画" },
    { id: "PRJ004", name: "広島工場設備更新" },
    { id: "PRJ005", name: "札幌営業所新設計画" },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">プロジェクト資料閲覧</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">最近のプロジェクト</h3>
        <div className="grid grid-cols-1 gap-2">
          {recentProjects.map((project) => (
            <Link key={project.id} href={`/file-management/project-view/${project.id}`} className="block">
              <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-500">プロジェクトID: {project.id}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4">
        <Link href="/file-management/project-view/search" className="flex-1">
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex items-center justify-center text-lg font-medium text-gray-800 h-32 cursor-pointer text-center">
            プロジェクト検索
          </div>
        </Link>
        <Link href="/file-management/project-view/recent" className="flex-1">
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex items-center justify-center text-lg font-medium text-gray-800 h-32 cursor-pointer text-center">
            最近の資料
          </div>
        </Link>
      </div>
    </div>
  );
} 