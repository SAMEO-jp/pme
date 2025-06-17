'use client';

import { useRouter, useParams } from 'next/navigation';

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: '図面一覧', path: '/zumen_list' },
  { label: '製造一覧', path: '/sezou_list' },
  { label: '梱包リスト', path: '/konpo_list' },
  { label: '設置状況', path: '/kouzi_list' },
];

export default function Menu() {
  const router = useRouter();
  const params = useParams();
  const projectNumber = params?.projectNumber as string;

  const handleMenuClick = (path: string) => {
    router.push(`/app_bom/${projectNumber}${path}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">メニュー</h2>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleMenuClick(item.path)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
} 