"use client"

import { MainTabHeader } from "../../[tab]/[content]/components/x.TabHeader/MainTabHeader"
import { SubTabHeader } from "../../[tab]/[content]/components/x.TabHeader/SubTabHeader"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function NumbersPage({ params }: { params: { projectcode: string } }) {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    fetch(`/api/project/${params.projectcode}/setsubi`)
      .then(res => res.json())
      .then(data => setList(data));
  }, [params.projectcode]);
  const handleAddClick = () => {
    router.push(`/project/detail/${params.projectcode}/manage/numbers/new`);
  };
  const handleEditClick = () => setIsEditMode(!isEditMode);
  const handleDelete = async (B_id: string) => {
    if (!window.confirm('本当に削除しますか？')) return;
    await fetch(`/api/project/${params.projectcode}/setsubi`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ B_id })
    });
    fetch(`/api/project/${params.projectcode}/setsubi`)
      .then(res => res.json())
      .then(data => setList(data));
  };
  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="numbers" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">製番管理</div>
          <div className="flex gap-2">
            <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700 transition" onClick={handleEditClick}>
              {isEditMode ? '編集終了' : '編集'}
            </button>
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition" onClick={handleAddClick}>
              製番追加
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">B_ID</th>
                <th className="border px-4 py-2">種別</th>
                <th className="border px-4 py-2">設備名</th>
                <th className="border px-4 py-2">英語名</th>
                {isEditMode && <th className="border px-4 py-2">操作</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.B_id}>
                  <td className="border px-4 py-2">{row.B_id}</td>
                  <td className="border px-4 py-2">{row.id_kind}</td>
                  <td className="border px-4 py-2">{row.setsubi_name}</td>
                  <td className="border px-4 py-2">{row.setsubi_english_name}</td>
                  {isEditMode && (
                    <td className="border px-4 py-2">
                      <button className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700 transition" onClick={() => handleDelete(row.B_id)}>
                        削除
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={isEditMode ? 5 : 4} className="text-gray-400 text-center py-4">データがありません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
} 