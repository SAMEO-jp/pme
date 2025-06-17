"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainTabHeader } from "@xTabHeader/MainTabHeader";
import { SubTabHeader } from "@xTabHeader/SubTabHeader";
import { TreeView } from "app/prant/blast-furnace/system/tree2/page.client";

// --- 追加: 設備データを階層構造に変換する関数 ---
function convertToTreeData(data: any[]) {
  const groupedByTwoDigits: { [key: string]: any[] } = {};
  data.forEach(item => {
    const twoDigits = item.B_id.substring(0, 2);
    if (!groupedByTwoDigits[twoDigits]) {
      groupedByTwoDigits[twoDigits] = [];
    }
    groupedByTwoDigits[twoDigits].push(item);
  });
  const treeData = Object.entries(groupedByTwoDigits)
    .map(([twoDigits, items]) => {
      const parentItem = items.find(item => item.B_id.endsWith('00')) || {
        B_id: twoDigits + '00',
        id_kind: 'group',
        setsubi_name: `グループ ${twoDigits}`,
        setsubi_english_name: `Group ${twoDigits}`,
        level: 0,
        isExpanded: false
      };
      const groupedByThreeDigits: { [key: string]: any[] } = {};
      items.forEach(item => {
        if (!item.B_id.endsWith('00')) {
          const threeDigits = item.B_id.substring(0, 3);
          if (!groupedByThreeDigits[threeDigits]) {
            groupedByThreeDigits[threeDigits] = [];
          }
          groupedByThreeDigits[threeDigits].push(item);
        }
      });
      const children = Object.entries(groupedByThreeDigits)
        .map(([threeDigits, subItems]) => {
          const subParentItem = subItems.find(item => item.B_id.endsWith('0')) || {
            B_id: threeDigits + '0',
            id_kind: 'group',
            setsubi_name: `グループ ${threeDigits}`,
            setsubi_english_name: `Group ${threeDigits}`,
            level: 1,
            isExpanded: false
          };
          const fourDigitItems = subItems.filter(item => item.B_id.length === 4 && !item.B_id.endsWith('0'));
          const detailedItems = subItems.filter(item => item.B_id.length > 4);
          const groupedByFourDigits = fourDigitItems.map(fourDigitItem => {
            const prefix = fourDigitItem.B_id;
            const children = detailedItems.filter(item => item.B_id.startsWith(prefix)).sort((a, b) => a.B_id.localeCompare(b.B_id));
            return {
              ...fourDigitItem,
              children: children.length > 0 ? children : undefined
            };
          });
          return {
            ...subParentItem,
            children: groupedByFourDigits.sort((a, b) => a.B_id.localeCompare(b.B_id))
          };
        })
        .filter(item => item.B_id)
        .sort((a, b) => a.B_id.localeCompare(b.B_id));
      return {
        ...parentItem,
        children
      };
    })
    .sort((a, b) => a.B_id.localeCompare(b.B_id));
  return treeData;
}

export default function NumbersNewPage({ params }: { params: { projectcode: string } }) {
  const router = useRouter();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    // 設備データ取得API（仮）
    fetch("/api/equipment/kouro")
      .then(res => res.json())
      .then(data => setTreeData(convertToTreeData(data.data || [])));
  }, []);

  // プラスボタンで設備追加
  const handleAdd = async () => {
    if (!selected) return;
    const res = await fetch(`/api/project/${params.projectcode}/setsubi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ B_ID: selected.B_id })
    });
    if (res.ok) {
      router.push(`/project/detail/${params.projectcode}/manage/numbers`);
    } else {
      alert("追加に失敗しました");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="numbers" />
      <main className="flex-1 p-6">
        <div className="text-2xl font-bold mb-4">製番追加</div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-4">追加したい設備をツリーから選択してください。</div>
          <div className="mb-4">
            <TreeView data={treeData} onSelect={setSelected} />
          </div>
          <button
            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
            onClick={handleAdd}
            disabled={!selected}
          >
            ＋この設備を追加
          </button>
        </div>
      </main>
    </div>
  );
} 