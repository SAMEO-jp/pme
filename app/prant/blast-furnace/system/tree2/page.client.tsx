'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface TreeNodeProps {
  node: any;
  level: number;
  onSelect: (node: any) => void;
  isSelected: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onSelect, isSelected }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isFourDigit = node.B_id.length === 4;

  return (
    <div
      className={`
        p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-orange-100 dark:bg-orange-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
        ${level === 0 ? 'font-semibold' : ''}
        ${isFourDigit ? 'border border-orange-100 dark:border-orange-900/30' : ''}
      `}
      onClick={() => onSelect(node)}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <span className={`text-sm font-mono mr-2 ${
              isFourDigit 
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-orange-500 dark:text-orange-300'
            }`}>
              {node.B_id}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {node.setsubi_name}
            </span>
            {hasChildren && (
              <ChevronRight className={`h-4 w-4 ml-2 ${
                isFourDigit
                  ? 'text-orange-500'
                  : 'text-gray-500'
              }`} />
            )}
          </div>
          {node.setsubi_english_name && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {node.setsubi_english_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TreeColumn: React.FC<{
  nodes: any[];
  level: number;
  onSelect: (node: any) => void;
  selectedPath: any[];
  title: string;
}> = ({ nodes, level, onSelect, selectedPath, title }) => {
  return (
    <div className="min-w-[250px] max-w-[400px] border-r border-gray-200 dark:border-gray-700 p-2">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 px-3">
        {title}
      </div>
      <div className="space-y-2">
        {nodes.map((node, index) => (
          <TreeNode
            key={node.B_id || index}
            node={node}
            level={level}
            onSelect={onSelect}
            isSelected={selectedPath[level]?.B_id === node.B_id}
          />
        ))}
      </div>
    </div>
  );
};

export const TreeView: React.FC<{ data: any[], onSelect?: (node: any) => void }> = ({ data, onSelect }) => {
  const [selectedPath, setSelectedPath] = useState<any[]>([]);

  const handleSelect = (node: any, level: number) => {
    const newPath = selectedPath.slice(0, level);
    newPath[level] = node;
    setSelectedPath(newPath);
    if (onSelect) onSelect(node);
  };

  const columns = [
    { nodes: data, title: '2桁製番' }
  ];

  if (selectedPath[0]?.children) {
    columns.push({
      nodes: selectedPath[0].children,
      title: '3桁製番'
    });
  }

  if (selectedPath[1]?.children) {
    columns.push({
      nodes: selectedPath[1].children,
      title: '4桁製番'
    });
  }

  if (selectedPath[2]?.children) {
    columns.push({
      nodes: selectedPath[2].children,
      title: '詳細製番（5-6桁）'
    });
  }

  return (
    <div className="flex overflow-x-auto min-h-[400px]">
      {columns.map(({ nodes, title }, level) => (
        <TreeColumn
          key={level}
          nodes={nodes}
          level={level}
          onSelect={(node) => handleSelect(node, level)}
          selectedPath={selectedPath}
          title={title}
        />
      ))}
    </div>
  );
}; 