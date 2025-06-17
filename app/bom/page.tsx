'use client';

import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useDrawings } from './src/hooks/useDrawings';
import { Project } from '../types/project';
import Link from 'next/link';

export default function BOMPage() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { drawings, loading: drawingsLoading, error: drawingsError } = useDrawings(selectedProject?.projectNumber || null);

  if (projectsLoading) return <div className="p-4">プロジェクトを読み込み中...</div>;
  if (projectsError) return <div className="p-4 text-red-500">エラー: {projectsError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BOM管理システム</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* プロジェクト選択 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">プロジェクト選択</h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.projectNumber}
                className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedProject?.projectNumber === project.projectNumber
                    ? 'bg-blue-100'
                    : ''
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-600">
                  プロジェクト番号: {project.projectNumber}
                </div>
                <div className="text-sm text-gray-600">
                  ステータス: {project.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 図面一覧 */}
        <div className="bg-white rounded-lg shadow p-4">
          <Link 
            href={`/bom/${selectedProject?.projectNumber}`}
            className="text-xl font-semibold mb-4 block hover:text-blue-600 transition-colors"
          >
            図面一覧
          </Link>
          {selectedProject ? (
            <>
              {drawingsLoading ? (
                <div>図面を読み込み中...</div>
              ) : drawingsError ? (
                <div className="text-red-500">エラー: {drawingsError.message}</div>
              ) : drawings.length > 0 ? (
                <div className="space-y-4">
                  {drawings.map((drawing) => (
                    <div key={drawing.Zumen_ID} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{drawing.Zumen_Name}</h3>
                          <p className="text-sm text-gray-600">図面番号: {drawing.Zumen_ID}</p>
                          <p className="text-sm text-gray-600">図面種類: {drawing.Zumen_Kind}</p>
                          <p className="text-sm text-gray-600">リビジョン: {drawing.rev_number}</p>
                          <p className="text-sm text-gray-600">ステータス: {drawing.status}</p>
                          <p className="text-sm text-gray-600">装備ID: {drawing.Souti_ID}</p>
                          <p className="text-sm text-gray-600">装備名: {drawing.Souti_name}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>出図日: {drawing.Syutuzubi_Date}</p>
                          <p>作図日: {drawing.Sakuzu_date}</p>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">担当A1: {drawing.Tantou_a1}</p>
                          <p className="text-gray-600">担当A2: {drawing.Tantou_a2}</p>
                          <p className="text-gray-600">担当B1: {drawing.Tantou_b1}</p>
                          <p className="text-gray-600">担当B2: {drawing.Tantou_b2}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">担当C1: {drawing.Tantou_c1}</p>
                          <p className="text-gray-600">担当C2: {drawing.Tantou_c2}</p>
                          <p className="text-gray-600">作図者A: {drawing.Sakuzu_a}</p>
                          <p className="text-gray-600">作図者B: {drawing.Sakuzu_b}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">組図: {drawing.Kumitate_Zumen}</p>
                        <p className="text-gray-600">関連図面: {drawing.KANREN_ZUMEN}</p>
                        <p className="text-gray-600">スケール: {drawing.Scale}</p>
                        <p className="text-gray-600">サイズ: {drawing.Size}</p>
                        <p className="text-gray-600">守秘区分: {drawing.Sicret_code}</p>
                        <p className="text-gray-600">WRITEver: {drawing.WRITEver}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">図面がありません</div>
              )}
            </>
          ) : (
            <div className="text-gray-500">プロジェクトを選択してください</div>
          )}
        </div>
      </div>
    </div>
  );
} 