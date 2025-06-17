'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TreeNodeProps {
  node: any;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer ${
          level === 0 ? 'font-semibold' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={toggleExpand}
      >
        {hasChildren ? (
          <span className="mr-1">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </span>
        ) : (
          <span className="w-5" />
        )}
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-sm font-mono text-orange-600 dark:text-orange-400 mr-2">
              {node.B_id}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {node.setsubi_name}
            </span>
          </div>
          {node.setsubi_english_name && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {node.setsubi_english_name}
            </div>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children.map((child: any, index: number) => (
            <TreeNode key={child.B_id || index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="space-y-1">
      {data.map((node, index) => (
        <TreeNode key={node.B_id || index} node={node} level={0} />
      ))}
    </div>
  );
}; 