"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MainTabHeader } from "@xTabHeader/MainTabHeader"
import { SubTabHeader } from "@xTabHeader/SubTabHeader"
import { useRouter } from "next/navigation"

// 部署型
interface Department {
  name: string;
  ver_name: string;
  start_date: string;
  end_date: string;
  department_kind: string; // "部" | "室" | "課"
  top_department: string | null;
}

// ユーザー型
interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  section: string;
  team: string;
  email: string;
  telNaisen: string;
  telGaisen: string;
  company: string;
  name_english: string;
  name_yomi: string;
  in_year: string;
  authority: string;
}

// 階層構造型
interface DepartmentTree {
  [bu: string]: {
    [sitsu: string]: string[] // 課のリスト
  }
}

// 役職ごとの色マッピング
const positionColor: Record<string, string> = {
  '部長': 'bg-gradient-to-br from-blue-200 to-blue-400 border-blue-400',
  '部長代理': 'bg-gradient-to-br from-blue-100 to-blue-300 border-blue-300',
  '課長': 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-400',
  '室長': 'bg-gradient-to-br from-green-200 to-green-400 border-green-400',
  '上席主幹': 'bg-gradient-to-br from-purple-100 to-purple-300 border-purple-300',
  '主幹': 'bg-gradient-to-br from-pink-100 to-pink-300 border-pink-300',
  '主査': 'bg-gradient-to-br from-orange-100 to-orange-300 border-orange-300',
  'メンバー': 'bg-gradient-to-br from-gray-50 to-gray-200 border-gray-200',
};

// 役職グループ順（部長→部長代理→課長→室長）
const positionOrder = [
  ['部長', '部長代理', '課長', '室長'],
  ['上席主幹'],
  ['主幹'],
  ['主査'],
  ['メンバー']
];

function normalize(str: string | null | undefined) {
  return (str || '').trim().toLocaleUpperCase().replace(/\s/g, '');
}

function getPositionGroup(user: User) {
  if (['部長', '部長代理', '課長', '室長'].includes(user.position)) return 0;
  if (user.position === '上席主幹') return 1;
  if (user.position === '主幹') return 2;
  if (user.position === '主査') return 3;
  return 4;
}

function getPositionColor(user: User) {
  return positionColor[user.position] || positionColor['メンバー'];
}

function getSortKey(user: User) {
  return user.in_year ? user.in_year : user.id;
}

export default function NewMemberPage({ params }: { params: { projectcode: string } }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tree, setTree] = useState<DepartmentTree>({});
  const [selectedBu, setSelectedBu] = useState<string>("");
  const [selectedSitsu, setSelectedSitsu] = useState<string>("");
  const [selectedKa, setSelectedKa] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDepartments();
    fetchAllUsers();
    fetchProjectMembers();
  }, []);

  // 部署データ取得＆ツリー生成
  const fetchDepartments = async () => {
    const res = await fetch("/api/all_department");
    const data: Department[] = await res.json();
    setDepartments(data);
    // 部→室→課のツリー生成
    const buList = data.filter(d => d.department_kind === "部");
    const sitsuList = data.filter(d => d.department_kind === "室");
    const kaList = data.filter(d => d.department_kind === "課");
    const tree: DepartmentTree = {};
    buList.forEach(bu => {
      tree[bu.name] = {};
      const sitsus = sitsuList.filter(s => normalize(s.top_department) === normalize(bu.name));
      sitsus.forEach(sitsu => {
        tree[bu.name][sitsu.name] = kaList
          .filter(k => normalize(k.top_department) === normalize(sitsu.name))
          .map(k => k.name);
      });
    });
    setTree(tree);
  };

  // 全ユーザー取得
  const fetchAllUsers = async () => {
    const res = await fetch("/api/user/all_user");
    const data: User[] = await res.json();
    setUsers(data);
  };

  // プロジェクト参加メンバー取得
  const fetchProjectMembers = async () => {
    const res = await fetch(`/api/project/${params.projectcode}/member`);
    const data = await res.json();
    setProjectMembers(data.map((m: any) => m.user));
  };

  // 選択肢リスト
  const buList = Object.keys(tree);
  const sitsuList = selectedBu ? Object.keys(tree[selectedBu] || {}) : [];
  const kaList = (selectedBu && selectedSitsu) ? tree[selectedBu][selectedSitsu] || [] : [];

  // メンバーリストのロジック
  let memberList: User[] = [];
  if (selectedBu && !selectedSitsu && !selectedKa) {
    // 部だけ選択時: 部に所属し、sectionもteamも空の人のみ
    memberList = users.filter(u =>
      u.department === selectedBu && !u.section && !u.team
    );
  } else if (selectedBu && selectedSitsu && !selectedKa) {
    // 室選択時: 室に所属し、teamが空
    memberList = users.filter(u =>
      u.department === selectedBu &&
      u.section === selectedSitsu &&
      (!u.team)
    );
  } else if (selectedBu && selectedSitsu && selectedKa) {
    // 課選択時: 課に所属
    memberList = users.filter(u =>
      u.department === selectedBu &&
      u.section === selectedSitsu &&
      u.team === selectedKa
    );
  }

  // 役職ごとにグループ化し、各グループ内で年次順（なければ社員番号順）でソート
  const groupedMembers: User[][] = positionOrder.map(roles =>
    memberList
      .filter(u => roles.includes(u.position) || (roles[0] === 'メンバー' && !positionOrder.flat().includes(u.position)))
      .sort((a, b) => {
        // 部長→部長代理→課長→室長の順
        if (roles.length > 1) {
          const idxA = roles.indexOf(a.position);
          const idxB = roles.indexOf(b.position);
          if (idxA !== idxB) return idxA - idxB;
        }
        return getSortKey(a).localeCompare(getSortKey(b));
      })
  );

  // メンバー追加処理
  const handleAddMember = async (user: User) => {
    setAddingUserId(user.id);
    try {
      const res = await fetch(`/api/project/${params.projectcode}/member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: "メンバー" })
      });
      if (res.ok) {
        setAddedUserIds(ids => [...ids, user.id]);
        // メンバー追加成功後、メンバー管理画面に戻る
        router.push(`/project/detail/${params.projectcode}/manage`);
      }
    } finally {
      setAddingUserId(null);
    }
  };

  // すでにプロジェクトに参加しているか
  const isAlreadyMember = (user: User) => projectMembers.some(pm => pm.id === user.id);

  return (
    <div>
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="members" />
      <div className="flex gap-4 p-6 bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl min-h-[80vh] shadow-xl justify-center">
        {/* 4カラム均等レイアウト */}
        <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardHeader><CardTitle>部</CardTitle></CardHeader>
            <CardContent>
              {buList.map(bu => (
                <Button
                  key={bu}
                  variant={selectedBu === bu ? "default" : "outline"}
                  className={`w-full mb-2 text-left rounded-lg transition-all ${selectedBu === bu ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                  onClick={() => {
                    setSelectedBu(bu);
                    setSelectedSitsu("");
                    setSelectedKa("");
                  }}
                >{bu}</Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardHeader><CardTitle>室</CardTitle></CardHeader>
            <CardContent>
              {sitsuList.map(sitsu => (
                <Button
                  key={sitsu}
                  variant={selectedSitsu === sitsu ? "default" : "outline"}
                  className={`w-full mb-2 text-left rounded-lg transition-all ${selectedSitsu === sitsu ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                  onClick={() => {
                    setSelectedSitsu(sitsu);
                    setSelectedKa("");
                  }}
                  disabled={!selectedBu}
                >{sitsu}</Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardHeader><CardTitle>課</CardTitle></CardHeader>
            <CardContent>
              {kaList.map(ka => (
                <Button
                  key={ka}
                  variant={selectedKa === ka ? "default" : "outline"}
                  className={`w-full mb-2 text-left rounded-lg transition-all ${selectedKa === ka ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                  onClick={() => setSelectedKa(ka)}
                  disabled={!selectedSitsu}
                >{ka}</Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-2/5 min-w-[320px] h-[1000px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardContent>
              <div className="flex flex-col gap-4 h-full overflow-y-auto">
                {groupedMembers.map((group, idx) => (
                  group.length > 0 && (
                    <div key={idx}>
                      {idx > 0 && <hr className="my-2 border-t-2 border-gray-200" />}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {group.map(user => (
                          <div
                            key={user.id}
                            className={`p-2 ${getPositionColor(user)} rounded-xl shadow flex flex-col gap-1 border w-full min-h-[88px] justify-between break-words whitespace-normal`}
                          >
                            <div className="font-bold text-xs text-orange-700 flex items-center gap-1 break-words whitespace-normal">
                              <span>{user.name}</span>
                              <span className="text-[10px] text-gray-500 break-words whitespace-normal">({user.id})</span>
                            </div>
                            <div className="text-xs text-gray-700 break-words whitespace-normal">役職: {user.position || '-'}</div>
                            <div className="text-xs text-gray-500 break-words whitespace-normal">{user.in_year ? `入社: ${user.in_year}` : ''}</div>
                            <div className="flex justify-end mt-1">
                              <Button
                                size="sm"
                                className="rounded-full px-2 py-0.5 shadow hover:bg-orange-200 transition-all text-xs"
                                disabled={addingUserId === user.id || addedUserIds.includes(user.id) || isAlreadyMember(user)}
                                onClick={() => handleAddMember(user)}
                              >
                                {isAlreadyMember(user)
                                  ? "参加済み"
                                  : addedUserIds.includes(user.id)
                                    ? "追加済み"
                                    : addingUserId === user.id
                                      ? "追加中..."
                                      : "追加"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {groupedMembers.flat().length === 0 && (
                  <div className="text-gray-400">該当するメンバーがいません</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
