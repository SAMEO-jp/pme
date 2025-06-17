'use client';

import { useEffect, useState } from 'react';
import { Project } from '../src/utils/db';
import { useRouter } from 'next/navigation';
import Menu from './src/components/Menu';

interface ProjectDetailProps {
  params: {
    projectNumber: string;
  };
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/bom/${params.projectNumber}`);
        if (!response.ok) {
          throw new Error('プロジェクトの取得に失敗しました');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.projectNumber]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!project) return <div>プロジェクトが見つかりません</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            戻る
          </button>
        </div>
        <p className="text-gray-600 mt-2">プロジェクト番号: {project.projectNumber}</p>
      </div>
      <Menu />
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">基本情報</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-gray-600 font-medium">クライアント</dt>
                <dd className="mt-1">{project.clientName}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">ステータス</dt>
                <dd className="mt-1">{project.status}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">分類</dt>
                <dd className="mt-1">{project.classification}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">予算グレード</dt>
                <dd className="mt-1">{project.budgetGrade}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">日程情報</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-gray-600 font-medium">開始日</dt>
                <dd className="mt-1">{project.startDate}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">終了日</dt>
                <dd className="mt-1">{project.endDate}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">プロジェクト開始日</dt>
                <dd className="mt-1">{project.projectStartDate}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">プロジェクト終了日</dt>
                <dd className="mt-1">{project.projectEndDate}</dd>
              </div>
              <div>
                <dt className="text-gray-600 font-medium">設置日</dt>
                <dd className="mt-1">{project.installationDate}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">説明</h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded">{project.description}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">備考</h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded">{project.notes}</p>
        </div>
      </div>
    </div>
  );
} 