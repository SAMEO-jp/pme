'use client';

import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types/project';

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロジェクト選択</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* プロジェクト一覧 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">プロジェクト一覧</h2>
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

        {/* プロジェクト詳細 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">プロジェクト詳細</h2>
          {selectedProject ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">基本情報</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">プロジェクト名:</span> {selectedProject.name}</p>
                  <p><span className="font-medium">プロジェクト番号:</span> {selectedProject.projectNumber}</p>
                  <p><span className="font-medium">クライアント:</span> {selectedProject.clientName}</p>
                  <p><span className="font-medium">分類:</span> {selectedProject.classification}</p>
                  <p><span className="font-medium">ステータス:</span> {selectedProject.status}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">スケジュール</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">開始日:</span> {selectedProject.startDate}</p>
                  <p><span className="font-medium">終了日:</span> {selectedProject.endDate}</p>
                  <p><span className="font-medium">図面完成予定日:</span> {selectedProject.drawingCompletionDate}</p>
                  <p><span className="font-medium">据付予定日:</span> {selectedProject.installationDate}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">設備情報</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">設備カテゴリ:</span> {selectedProject.equipmentCategory}</p>
                  <p><span className="font-medium">設備番号:</span> {selectedProject.equipmentNumbers}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">その他</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">予算グレード:</span> {selectedProject.budgetGrade}</p>
                  <p><span className="font-medium">説明:</span> {selectedProject.description}</p>
                  <p><span className="font-medium">備考:</span> {selectedProject.notes}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">プロジェクトを選択してください</div>
          )}
        </div>
      </div>
    </div>
  );
} 