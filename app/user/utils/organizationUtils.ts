// 役職の階層構造を定義
export const POSITION_HIERARCHY = {
  '所長': 1,
  '部長': 2,
  '室長': 3,
  '課長': 4,
} as const;

export type Position = keyof typeof POSITION_HIERARCHY;

// 役職の表示順序を定義
export const POSITION_ORDER: Position[] = ['所長', '部長', '室長', '課長'];

// ユーザーデータの型定義
export interface UserData {
  id: string;
  name: string;
  syokui: string;
  bumon: string;
  section?: string;
  team?: string;
  email?: string;
  telNaisen?: string;
  telGaisen?: string;
  company?: string;
  name_english?: string;
  name_yomi?: string;
  in_year?: string;
  authority?: string;
}

// 組織構造の型定義
export interface OrganizationNode {
  user: UserData;
  children: OrganizationNode[];
  level: number;
}

// ユーザーデータを組織構造に変換する関数
export function buildOrganizationTree(users: UserData[]): OrganizationNode[] {
  // 役職の優先順位を定義
  const positionOrder = {
    '所長': 1,
    '部長': 2,
    '室長': 3,
    '課長': 4,
    '主任': 5,
    '一般': 6
  };

  // 役職でソート
  const sortedUsers = [...users].sort((a, b) => {
    const orderA = positionOrder[a.syokui as keyof typeof positionOrder] || 999;
    const orderB = positionOrder[b.syokui as keyof typeof positionOrder] || 999;
    return orderA - orderB;
  });

  // ユーザーIDをキーとするマップを作成
  const userMap = new Map<string, OrganizationNode>();
  
  // 各ユーザーのノードを作成
  sortedUsers.forEach(user => {
    userMap.set(user.id, {
      user,
      children: [],
      level: POSITION_HIERARCHY[user.syokui as Position] || 999
    });
  });

  // ルートノードを格納する配列
  const roots: OrganizationNode[] = [];

  // 親子関係を構築
  sortedUsers.forEach(user => {
    const node = userMap.get(user.id)!;
    
    if (user.team && userMap.has(user.team)) {
      // 親が存在する場合、子として追加
      const parent = userMap.get(user.team)!;
      parent.children.push(node);
    } else {
      // 親が存在しない場合、ルートとして追加
      roots.push(node);
    }
  });

  // 各レベルのノードをソート
  function sortNodes(nodes: OrganizationNode[]): OrganizationNode[] {
    return nodes.sort((a, b) => {
      // まず役職でソート
      const posA = POSITION_HIERARCHY[a.user.syokui as Position] || 999;
      const posB = POSITION_HIERARCHY[b.user.syokui as Position] || 999;
      if (posA !== posB) return posA - posB;

      // 役職が同じ場合は部署名でソート
      if (a.user.bumon && b.user.bumon) {
        return a.user.bumon.localeCompare(b.user.bumon);
      }

      // 部署名も同じ場合は名前でソート
      return a.user.name.localeCompare(b.user.name);
    }).map(node => ({
      ...node,
      children: sortNodes(node.children)
    }));
  }

  return sortNodes(roots);
}

// 組織構造をフラットなリストに変換する関数（表示用）
export function flattenOrganizationTree(nodes: OrganizationNode[]): OrganizationNode[] {
  const result: OrganizationNode[] = [];
  
  function traverse(node: OrganizationNode) {
    result.push(node);
    node.children.forEach(traverse);
  }
  
  nodes.forEach(traverse);
  return result;
}

// 組織構造をグループ化する関数（役職別表示用）
export function groupByPosition(users: UserData[]): Record<string, UserData[]> {
  const groups: Record<string, UserData[]> = {};
  
  users.forEach(user => {
    const position = user.syokui || 'その他';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(user);
  });

  return groups;
} 