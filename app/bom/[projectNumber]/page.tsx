'use client';

import { useParams } from 'next/navigation';
import { useDrawings } from '../../hooks/useDrawings';
import Link from 'next/link';

export default function BOMDetailPage() {
  const params = useParams();
  const projectNumber = params.projectNumber as string;
  const { drawings, loading, error } = useDrawings(projectNumber);

  if (loading) return <div className="p-4">図面を読み込み中...</div>;
  if (error) return <div className="p-4 text-red-500">エラー: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">BOM詳細 - プロジェクト番号: {projectNumber}</h1>
        <div className="flex gap-2">
          <Link 
            href={`/bom/${projectNumber}/detail`}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            詳細図
          </Link>
          <Link 
            href={`/bom/${projectNumber}/assembly`}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            組立図
          </Link>
          <Link 
            href={`/bom/${projectNumber}/packaging`}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            梱包
          </Link>
          <Link 
            href={`/bom/${projectNumber}/manufacturing`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            製造
          </Link>
          <Link 
            href="/bom"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            戻る
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">図面番号</th>
                <th className="px-4 py-2 text-left">図面名</th>
                <th className="px-4 py-2 text-left">図面種類</th>
                <th className="px-4 py-2 text-left">リビジョン</th>
                <th className="px-4 py-2 text-left">ステータス</th>
                <th className="px-4 py-2 text-left">装備ID</th>
                <th className="px-4 py-2 text-left">装備名</th>
                <th className="px-4 py-2 text-left">出図日</th>
                <th className="px-4 py-2 text-left">作図日</th>
              </tr>
            </thead>
            <tbody>
              {drawings.map((drawing) => (
                <tr key={drawing.Zumen_ID} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{drawing.Zumen_ID}</td>
                  <td className="px-4 py-2">{drawing.Zumen_Name}</td>
                  <td className="px-4 py-2">{drawing.Zumen_Kind}</td>
                  <td className="px-4 py-2">{drawing.rev_number}</td>
                  <td className="px-4 py-2">{drawing.status}</td>
                  <td className="px-4 py-2">{drawing.Souti_ID}</td>
                  <td className="px-4 py-2">{drawing.Souti_name}</td>
                  <td className="px-4 py-2">{drawing.Syutuzubi_Date}</td>
                  <td className="px-4 py-2">{drawing.Sakuzu_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 