'use client';

import { useEffect, useState } from 'react';
import { Project, getAllProjects } from '../utils/db';
import { useRouter } from 'next/navigation';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/bom');
        if (!response.ok) {
          throw new Error('プロジェクトの取得に失敗しました');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRowClick = (projectNumber: string) => {
    router.push(`/app_bom/${projectNumber}`);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">プロジェクト番号</th>
              <th className="px-4 py-2 border">名前</th>
              <th className="px-4 py-2 border">クライアント</th>
              <th className="px-4 py-2 border">ステータス</th>
              <th className="px-4 py-2 border">開始日</th>
              <th className="px-4 py-2 border">終了日</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.projectNumber}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(project.projectNumber)}
              >
                <td className="px-4 py-2 border">{project.projectNumber}</td>
                <td className="px-4 py-2 border">{project.name}</td>
                <td className="px-4 py-2 border">{project.clientName}</td>
                <td className="px-4 py-2 border">{project.status}</td>
                <td className="px-4 py-2 border">{project.startDate}</td>
                <td className="px-4 py-2 border">{project.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 