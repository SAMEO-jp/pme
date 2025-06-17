// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";

// interface PackagingList {
//   KONPO_LIST_ID: string;
//   PROJECT_ID: string;
//   UNIT_COUNT: number;
//   TOTAL_QUANTITY: number;
//   TOTAL_WEIGHT: number;
// }

// // 3桁区切りカンマを<sup>ｔ</sup>に置換するフォーマット関数
// const formatWithT = (value: number) => {
//   if (!isFinite(value)) return '-';
//   const str = Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   return str.replace(/,/g, '<sup>ｔ</sup>');
// };

// export default function PackagingListPage() {
//   const params = useParams();
//   const router = useRouter();
//   const projectNumber = params.projectNumber as string;
//   const [lists, setLists] = useState<PackagingList[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchLists();
//   }, [projectNumber]);

//   const fetchLists = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch(`/api/bom/${projectNumber}/packaging/list`);
//       if (!response.ok) {
//         throw new Error('梱包リストの取得に失敗しました');
//       }
//       const data = await response.json();
//       setLists(data);
//     } catch (error) {
//       console.error('梱包リストの取得に失敗しました:', error);
//       setError(error instanceof Error ? error.message : '梱包リストの取得に失敗しました');
//       toast.error('梱包リストの取得に失敗しました');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBack = () => {
//     router.push(`/bom/${projectNumber}/packaging/unit`);
//   };

//   const handleViewDetails = (listId: string) => {
//     router.push(`/bom/${projectNumber}/packaging/list/${listId}`);
//   };

//   if (isLoading) {
//     return <div>読み込み中...</div>;
//   }

//   if (error) {
//     return <div>エラー: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>梱包リスト一覧</CardTitle>
//             <Button onClick={handleBack}>戻る</Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>リスト番号</TableHead>
//                 <TableHead>梱包単位数</TableHead>
//                 <TableHead>総数量</TableHead>
//                 <TableHead>総重量</TableHead>
//                 <TableHead className="w-[100px]"></TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {lists.map((list) => (
//                 <TableRow key={list.KONPO_LIST_ID}>
//                   <TableCell>{list.KONPO_LIST_ID}</TableCell>
//                   <TableCell>{list.UNIT_COUNT}</TableCell>
//                   <TableCell>{list.TOTAL_QUANTITY}</TableCell>
//                   <TableCell dangerouslySetInnerHTML={{ __html: formatWithT(list.TOTAL_WEIGHT) }} />
//                   <TableCell>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleViewDetails(list.KONPO_LIST_ID)}
//                     >
//                       詳細
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
