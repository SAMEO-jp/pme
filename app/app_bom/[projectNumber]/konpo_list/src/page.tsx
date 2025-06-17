'use client';

import { useParams } from 'next/navigation';

export default function KonpoList() {
  const params = useParams();
  const projectNumber = params?.projectNumber as string;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">梱包リスト - {projectNumber}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p>梱包リストの内容をここに表示します。</p>
      </div>
    </div>
  );
} 