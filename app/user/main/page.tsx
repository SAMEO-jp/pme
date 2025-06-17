"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserTabHeader from '../components/UserTabHeader';
import OrganizationChart from '../components/OrganizationChart';
import PositionGroups from '../components/PositionGroups';
import TableViewGrid from '../../z_datamanagement/components/TableViewGrid';
import { ColumnSettingsProvider } from '../../z_datamanagement/components/context/ColumnSettingsContext';
import { UserData, buildOrganizationTree, groupByPosition } from '../utils/organizationUtils';

const UserMainPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'position' | 'org'>('all');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/all_user');
        if (!response.ok) {
          throw new Error('ユーザーデータの取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user: UserData) => {
    router.push(`/user/detail/${user.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // テーブルカラムの定義
  const tableColumns = [
    { key: 'name', header: '名前', width: 'w-32' },
    { key: 'position', header: '役職', width: 'w-24' },
    { key: 'department', header: '部門', width: 'w-32' },
    { key: 'section', header: '室', width: 'w-24' },
    { key: 'team', header: '課', width: 'w-24' },
    { key: 'email', header: 'メール', width: 'w-48' },
    { key: 'telNaisen', header: '内線', width: 'w-24' },
    { key: 'telGaisen', header: '外線', width: 'w-32' },
    { key: 'company', header: '会社', width: 'w-32' },
    { key: 'name_english', header: '英語名', width: 'w-48' },
    { key: 'name_yomi', header: '読み仮名', width: 'w-32' },
    { key: 'in_year', header: '入社年', width: 'w-24' },
    { key: 'authority', header: '権限', width: 'w-24' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <UserTabHeader activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-4">
            {activeTab === 'all' ? (
              <ColumnSettingsProvider>
                <TableViewGrid
                  data={users}
                  columns={tableColumns}
                  isLoading={false}
                  error={null}
                  tableName="all_user"
                  pageSize={50}
                  emptyMessage="ユーザーデータがありません"
                  headerTitle={<h1 className="text-xl font-bold">ユーザー一覧</h1>}
                />
              </ColumnSettingsProvider>
            ) : activeTab === 'position' ? (
              <PositionGroups
                groups={groupByPosition(users)}
                onUserClick={handleUserClick}
              />
            ) : (
              <OrganizationChart
                data={buildOrganizationTree(users)}
                onUserClick={handleUserClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMainPage; 