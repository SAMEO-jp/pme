import { BOMType } from '@bom/types/bom';

interface BOMListProps {
  data: BOMType;
}

export function BOMList({ data }: BOMListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {data.map((item) => (
          <li key={item.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {item.partNumber}
                  </p>
                  <p className="ml-2 flex-shrink-0 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {item.status}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    更新日: {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 