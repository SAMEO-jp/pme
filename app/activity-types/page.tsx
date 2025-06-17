"use client"

import { useState, useEffect, useRef } from "react"
import { getActivityTypes, getActivityTypeColumns, addActivityType, updateActivityType, deleteActivityType } from "@/lib/activity-types"
import { Edit, Trash, Plus, Save, X, Check, ColumnsIcon, Settings, Filter, ChevronUp, ChevronDown } from "lucide-react"
import { useColumnSettings } from "./components/ColumnSettingsContext"

// 表示列の設定の型定義
type ColumnConfig = {
  id: string;
  name: string;
  dataType?: string;
  visible: boolean;
};

// 活動タイプの型定義
type ActivityType = {
  typeCode: string;
  typeName: string;
  description?: string;
  category?: string;
  subCategory?: string;
  displayOrder?: number;
  color?: string;
  isActive?: number;
  [key: string]: any; // 追加のカラム用
};

// ソート状態の型定義
type SortState = {
  column: string;
  direction: 'asc' | 'desc' | null;
};

// コンテキストメニュー位置の型定義
type ContextMenuPosition = {
  x: number;
  y: number;
  columnId: string;
};

export default function ActivityTypesPage() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<Partial<ActivityType>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [filterText, setFilterText] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [newType, setNewType] = useState<ActivityType>({
    typeCode: "",
    typeName: "",
    description: "",
    color: "#808080",
    isActive: 1,
    category: "",
    subCategory: "",
  })

  // ソート関連の状態
  const [sortState, setSortState] = useState<SortState>({ column: "", direction: null });

  // コンテキストメニュー関連の状態
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0, columnId: "" });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // 参照用
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // 表示列設定用の状態
  const { showColumnSettings, setShowColumnSettings } = useColumnSettings()
  const [columns, setColumns] = useState<ColumnConfig[]>([])

  // 一括編集用の状態
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkEdit, setShowBulkEdit] = useState(false)
  const [bulkEditField, setBulkEditField] = useState("")
  const [bulkEditValue, setBulkEditValue] = useState("")
  // 複数カラム編集用の状態
  const [bulkEditFields, setBulkEditFields] = useState<string[]>([])
  const [bulkEditValues, setBulkEditValues] = useState<Record<string, any>>({})

  // 編集モードの切り替え
  const handleEdit = (typeCode: string) => {
    setEditingId(typeCode);
    
    // 編集データの複製を作成（元のデータを変更しないため）
    const typeToEdit = activityTypes.find(type => type.typeCode === typeCode);
    if (typeToEdit) {
      setEditingValues({...typeToEdit});
    }
  }

  // 編集のキャンセル
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValues({});
  }

  // コンテキストメニューを閉じるためのイベントリスナーを設定
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // データの読み込み
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // 活動タイプのデータとカラム情報を並行して取得
        const [typeData, columnData] = await Promise.all([
          getActivityTypes(),
          getActivityTypeColumns()
        ]);
        
        setActivityTypes(typeData)
        
        // カラム情報が取得できた場合は更新
        if (columnData && columnData.length > 0) {
          // データベースから取得したカラム順をそのまま使用
          setColumns(columnData.map((col: ColumnConfig) => ({
            ...col,
            visible: true // 初期状態ではすべて表示
          })));
        } else {
          // API呼び出しが失敗した場合のフォールバック
          setColumns([
            { id: "typeCode", name: "コード", visible: true },
            { id: "typeName", name: "名称", visible: true },
            { id: "description", name: "説明", visible: true },
            { id: "category", name: "大分類", visible: true },
            { id: "subCategory", name: "中分類", visible: true },
            { id: "displayOrder", name: "表示順", visible: true },
            { id: "color", name: "色", visible: true },
            { id: "isActive", name: "状態", visible: true },
          ]);
        }

        // 初期状態では大分類のみ展開
        const initialExpanded: Record<string, boolean> = {}
        typeData.forEach((type: ActivityType) => {
          if (type.typeCode.endsWith("00")) {
            initialExpanded[type.typeCode.substring(0, 1)] = true
          }
        })
        setExpandedCategories(initialExpanded)
      } catch (error) {
        console.error("活動タイプデータの取得中にエラーが発生しました:", error)
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 編集内容の保存
  const handleSave = async (typeCode: string) => {
    try {
      // 編集中のレコードを見つける
      const editingType = activityTypes.find(type => type.typeCode === typeCode);
      if (!editingType) return;
      
      // APIを呼び出して更新
      await updateActivityType(editingType);
      
      // ステートを更新（楽観的更新）
      setActivityTypes(prevTypes => prevTypes.map(type => 
        type.typeCode === typeCode ? editingType : type
      ));
      
      setEditingId(null);
      alert(`${typeCode}の変更を保存しました`);
    } catch (error) {
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
      console.error("保存中にエラーが発生しました:", error);
    }
  }

  // 削除処理
  const handleDelete = async (typeCode: string) => {
    if (confirm(`${typeCode}を削除してもよろしいですか？`)) {
      try {
        // APIを呼び出して削除
        await deleteActivityType(typeCode);
        
        // ステートを更新
        setActivityTypes(prevTypes => prevTypes.filter(type => type.typeCode !== typeCode));
        
        alert(`${typeCode}を削除しました`);
      } catch (error) {
        alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
        console.error("削除中にエラーが発生しました:", error);
      }
    }
  }

  // 新規追加
  const handleAddNew = async () => {
    if (!newType.typeCode || !newType.typeName) {
      alert("コードと名称は必須です");
      return;
    }

    try {
      // APIを呼び出して追加
      const addedType = await addActivityType(newType);
      
      // ステートを更新
      setActivityTypes(prevTypes => [...prevTypes, addedType]);
      
      alert(`新しい活動タイプを追加しました`);
      
      // フォームをリセット
      setNewType({
        typeCode: "",
        typeName: "",
        description: "",
        color: "#808080",
        isActive: 1,
        category: "",
        subCategory: "",
      });
    } catch (error) {
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
      console.error("追加中にエラーが発生しました:", error);
    }
  }

  // カテゴリの展開/折りたたみを切り替え
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev: Record<string, boolean>) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // 大分類ごとにグループ化
  const groupedTypes = activityTypes.reduce((acc, type) => {
    const mainCategory = type.category || "その他"
    if (!acc[mainCategory]) {
      acc[mainCategory] = []
    }
    acc[mainCategory].push(type)
    return acc
  }, {} as Record<string, ActivityType[]>)

  // 一意のカテゴリリストを取得
  const uniqueCategories = [...new Set(activityTypes.map((type) => type.category))].filter(Boolean)

  // 列の表示/非表示を切り替える
  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  // すべての項目を選択/解除
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      setSelectedItems(filteredTypes.map(type => type.typeCode));
    } else {
      setSelectedItems([]);
    }
  };

  // 個別の項目選択/解除
  const handleSelectItem = (typeCode: string) => {
    setSelectedItems(prev => {
      if (prev.includes(typeCode)) {
        return prev.filter(id => id !== typeCode);
      } else {
        return [...prev, typeCode];
      }
    });
  };

  // 一括編集を実行
  const handleBulkEdit = async () => {
    if (bulkEditFields.length === 0 || selectedItems.length === 0) return;

    try {
      // 選択されたアイテムに対してフィールドを更新
      const updatedActivityTypes = activityTypes.map(type => {
        if (selectedItems.includes(type.typeCode)) {
          const updates: Record<string, any> = {};
          
          // 選択された各フィールドに対して値を適用
          bulkEditFields.forEach(field => {
            if (bulkEditValues[field] !== undefined) {
              // データ型に応じた値の変換
              const column = columns.find(col => col.id === field);
              let convertedValue = bulkEditValues[field];
              
              if (column?.dataType?.includes('INT')) {
                convertedValue = parseInt(bulkEditValues[field], 10);
              } else if (column?.dataType?.includes('REAL')) {
                convertedValue = parseFloat(bulkEditValues[field]);
              }
              
              updates[field] = convertedValue;
            }
          });
          
          return { ...type, ...updates };
        }
        return type;
      });

      // UIの状態を更新（楽観的更新）
      setActivityTypes(updatedActivityTypes);
      
      // 保存処理を実行
      // 各アイテムを個別に更新
      const updatePromises = selectedItems.map(typeCode => {
        const updatedType = updatedActivityTypes.find(type => type.typeCode === typeCode);
        if (updatedType) {
          return updateActivityType(updatedType);
        }
        return Promise.resolve();
      });
      
      // すべての更新処理が完了するのを待つ
      await Promise.all(updatePromises);
      
      // 一括編集後の後処理
      setShowBulkEdit(false);
      setBulkEditFields([]);
      setBulkEditValues({});
      alert(`${selectedItems.length}件のアイテムを一括編集しました`);
    } catch (error) {
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
      console.error("一括編集中にエラーが発生しました:", error);
    }
  };

  // 一括編集をキャンセル
  const handleCancelBulkEdit = () => {
    setShowBulkEdit(false);
    setBulkEditFields([]);
    setBulkEditValues({});
  };

  // 編集フィールドの追加/削除
  const toggleBulkEditField = (fieldId: string) => {
    setBulkEditFields(prev => {
      if (prev.includes(fieldId)) {
        // フィールドが既に選択されている場合は削除
        const newFields = prev.filter(id => id !== fieldId);
        
        // 値も削除
        const newValues = { ...bulkEditValues };
        delete newValues[fieldId];
        setBulkEditValues(newValues);
        
        return newFields;
      } else {
        // フィールドを追加
        return [...prev, fieldId];
      }
    });
  };

  // 特定フィールドの値を更新
  const updateBulkEditValue = (fieldId: string, value: any) => {
    setBulkEditValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // 列ヘッダーのクリックハンドラ - ソート切り替え
  const handleColumnHeaderClick = (columnId: string) => {
    setSortState(prev => {
      if (prev.column === columnId) {
        // 同じカラムが選択された場合、ソート方向を循環
        const nextDirection = prev.direction === 'asc' ? 'desc' : 
                             prev.direction === 'desc' ? null : 'asc';
        return { column: columnId, direction: nextDirection };
      } else {
        // 新しいカラムが選択された場合、昇順から開始
        return { column: columnId, direction: 'asc' };
      }
    });
  };

  // 列ヘッダーの右クリックハンドラ - コンテキストメニュー表示
  const handleColumnHeaderContextMenu = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setContextMenuPosition({ 
      x: e.clientX, 
      y: e.clientY,
      columnId 
    });
    setShowContextMenu(true);
  };

  // カラムフィルターの適用
  const handleApplyColumnFilter = (columnId: string, filterValue: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: filterValue
    }));
    setShowContextMenu(false);
  };

  // カラムフィルターのクリア
  const handleClearColumnFilter = (columnId: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
    setShowContextMenu(false);
  };

  // 特定のカラムから一意の値のリストを取得
  const getUniqueValuesForColumn = (columnId: string) => {
    // カラムの値を全て取得
    const allValues = activityTypes.map(type => type[columnId])
      .filter(val => val !== undefined && val !== null && val !== '');
    
    // 一意の値を取得
    const uniqueValues = [...new Set(allValues)];
    
    // ソートして返す
    return uniqueValues.sort();
  };

  // チェックボックスによるフィルター値の更新
  const handleCheckboxFilterChange = (columnId: string, value: string, isChecked: boolean) => {
    setColumnFilters(prev => {
      // 現在のフィルター文字列を解析（カンマ区切りで複数の値を許可）
      const currentValues = prev[columnId] ? prev[columnId].split(',') : [];
      
      // チェックボックスの状態に応じて値を追加または削除
      let newValues;
      if (isChecked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(v => v !== value);
      }
      
      // フィルター文字列を更新（空の場合はキーを削除）
      if (newValues.length === 0) {
        const newFilters = { ...prev };
        delete newFilters[columnId];
        return newFilters;
      } else {
        return {
          ...prev,
          [columnId]: newValues.join(',')
        };
      }
    });
  };

  // フィルタリングとソートを適用したデータを生成
  const getFilteredAndSortedData = () => {
  // フィルタリング
    let filteredData = activityTypes.filter((type) => {
      // 全体的なテキスト検索フィルター
    const matchesText =
      filterText === "" ||
      type.typeCode.toLowerCase().includes(filterText.toLowerCase()) ||
      type.typeName.toLowerCase().includes(filterText.toLowerCase()) ||
        (type.description && type.description.toLowerCase().includes(filterText.toLowerCase()));

      // カテゴリフィルター
      const matchesCategory = filterCategory === "" || type.category === filterCategory;
      
      // 各カラムの個別フィルター
      const matchesColumnFilters = Object.entries(columnFilters).every(
        ([columnId, filterValue]) => {
          const value = type[columnId];
          if (value === undefined || value === null) return false;
          
          // カンマ区切りの値リストによるフィルタリング
          if (filterValue.includes(',')) {
            const allowedValues = filterValue.split(',');
            return allowedValues.includes(String(value));
          }
          
          // 通常のテキスト検索フィルタリング
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        }
      );

      return matchesText && matchesCategory && matchesColumnFilters;
    });

    // ソート
    if (sortState.column && sortState.direction) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortState.column];
        const bValue = b[sortState.column];
        
        // nullやundefinedを処理
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        // 数値の場合
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // 文字列に変換してソート
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        
        return sortState.direction === 'asc' 
          ? aString.localeCompare(bString) 
          : bString.localeCompare(aString);
      });
    }

    return filteredData;
  };

  // フィルタリングとソートを適用したデータを取得
  const filteredTypes = getFilteredAndSortedData();

  // 編集時の入力フィールドをレンダリング
  function renderEditField(column: ColumnConfig, type: ActivityType) {
    const value = type[column.id];
    const dataType = column.dataType?.toUpperCase() || '';
    
    const updateField = (fieldValue: any) => {
      setActivityTypes(prevTypes => 
        prevTypes.map(t => {
          if (t.typeCode === type.typeCode) {
            return { ...t, [column.id]: fieldValue };
          }
          return t;
        })
      );
    };
    
    if (column.id === 'typeCode') {
      return <span className="font-mono">{value}</span>;
    }
    
    if (column.id === 'isActive') {
      return (
        <select 
          className="p-1 border rounded" 
          value={value}
          onChange={(e) => updateField(Number(e.target.value))}
        >
          <option value={1}>有効</option>
          <option value={0}>無効</option>
        </select>
      );
    }
    
    if (column.id === 'color') {
      return (
        <input 
          type="color" 
          className="w-16 h-8 border rounded" 
          value={value} 
          onChange={(e) => updateField(e.target.value)}
        />
      );
    }
    
    if (dataType.includes('INT') || dataType.includes('REAL') || dataType.includes('NUMERIC')) {
      return (
        <input 
          type="number" 
          className="w-20 p-1 border rounded" 
          value={value}
          onChange={(e) => updateField(Number(e.target.value))}
        />
      );
    }
    
    return (
      <input 
        type="text" 
        className="w-full p-1 border rounded" 
        value={value || ''} 
        onChange={(e) => updateField(e.target.value)}
      />
    );
  }

  return (
    <div className="p-1 relative">
      <div className="bg-white p-1 rounded-lg shadow-sm mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">エラーが発生しました: {error}</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {/* 表示列ボタン */}
                <button
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                    showColumnSettings 
                      ? "bg-blue-100 hover:bg-blue-200 border-blue-300" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ColumnsIcon className="w-4 h-4" />
                  <span>表示列</span>
                </button>
                {/* 一括編集ボタン */}
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowBulkEdit(true)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{selectedItems.length}件を編集</span>
                  </button>
                )}
              </div>
            </div>

            {/* 表示列設定パネル */}
            {showColumnSettings && (
              <div className="mb-4 p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">表示する列を選択</h3>
                <div className="flex flex-wrap gap-3">
                  {columns.map(column => (
                    <label key={column.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => toggleColumnVisibility(column.id)}
                        className="w-4 h-4"
                      />
                      <span>{column.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 一括編集パネル */}
            {showBulkEdit && (
              <div className="mb-4 p-4 border rounded-md bg-blue-50">
                <h3 className="font-medium mb-2">一括編集 - {selectedItems.length}件選択中</h3>
                
                {/* 編集するフィールドの選択（チップスタイル） */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">編集する列を選択</label>
                  <div className="flex flex-wrap gap-2">
                    {columns.filter(col => col.id !== 'typeCode').map(column => (
                      <button
                        key={column.id}
                        onClick={() => toggleBulkEditField(column.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bulkEditFields.includes(column.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {column.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 選択されたフィールドの値入力フォーム */}
                {bulkEditFields.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {bulkEditFields.map(fieldId => {
                      const column = columns.find(col => col.id === fieldId);
                      if (!column) return null;
                      
                      return (
                        <div key={fieldId} className="bg-white p-3 rounded border">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {column.name}の新しい値
                          </label>
                          {renderInputField(
                            column,
                            bulkEditValues[fieldId] || '',
                            (value) => updateBulkEditValue(fieldId, value)
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleBulkEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                    disabled={bulkEditFields.length === 0 || Object.keys(bulkEditValues).length === 0}
                  >
                    <Save className="h-5 w-5" />
                    一括適用
                  </button>
                  <button
                    onClick={handleCancelBulkEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md flex items-center gap-2 hover:bg-gray-600"
                  >
                    <X className="h-5 w-5" />
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto max-h-[83vh] overflow-y-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-gray-50">
                    {/* チェックボックス列 */}
                    <th className="py-2 px-4 border-b">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>

                    {/* 動的に表示列を制御 */}
                    {columns.filter(col => col.visible).map(column => (
                      <th 
                        key={column.id} 
                        onClick={() => handleColumnHeaderClick(column.id)}
                        onContextMenu={(e) => handleColumnHeaderContextMenu(e, column.id)}
                        className={`py-2 px-4 border-b text-left font-medium text-gray-700 cursor-pointer select-none ${
                          column.id === 'typeCode' ? 'w-24' : 
                          column.id === 'category' || column.id === 'subCategory' ? 'w-24' : 
                          column.id === 'displayOrder' ? 'w-20' : 
                          column.id === 'color' ? 'w-24' : 
                          column.id === 'isActive' ? 'w-20' : ''
                        } ${sortState.column === column.id ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex flex-col">
                          <span className="mb-1">{column.name}</span>
                          <div className="flex items-center justify-center h-5">
                            {sortState.column === column.id && sortState.direction && (
                              <span className="mr-1">
                                {sortState.direction === 'asc' ? 
                                  <ChevronUp className="w-4 h-4" /> : 
                                  <ChevronDown className="w-4 h-4" />
                                }
                              </span>
                            )}
                            {columnFilters[column.id] && (
                              <span className="text-xs text-blue-500">
                                <Filter className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="py-2 px-4 border-b text-left font-medium text-gray-700 w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.map((type) => (
                    <tr key={type.typeCode} className="hover:bg-gray-50">
                      {/* チェックボックス */}
                      <td className="py-2 px-4 border-b">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(type.typeCode)}
                          onChange={() => handleSelectItem(type.typeCode)}
                          className="w-4 h-4"
                        />
                      </td>

                      {/* 動的に列を表示 */}
                      {columns.filter(col => col.visible).map(column => (
                        <td key={column.id} className="py-2 px-4 border-b">
                        {editingId === type.typeCode ? (
                            // 編集モード
                            renderEditField(column, type)
                        ) : (
                            // 表示モード
                            renderDisplayValue(column, type)
                        )}
                      </td>
                      ))}

                      {/* 操作ボタン */}
                      <td className="py-2 px-4 border-b">
                        {editingId === type.typeCode ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSave(type.typeCode)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="保存"
                            >
                              <Save className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="キャンセル"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(type.typeCode)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="編集"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(type.typeCode)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="削除"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">新規活動タイプ追加</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                {columns.filter(col => col.id !== 'isActive' || true).map(column => (
                  <div key={column.id} className={column.id === 'description' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column.name} {isRequiredField(column.id) ? '*' : ''}
                    </label>
                    {renderInputField(
                      column,
                      newType[column.id],
                      (value) => setNewType({ ...newType, [column.id]: value })
                    )}
                    {column.id === 'typeCode' && (
                      <p className="text-xs text-gray-500 mt-1">大文字英数字4桁のコード (例: C101, M203)</p>
                    )}
                  </div>
                ))}
                
                <div className="md:col-span-2 flex justify-end mt-4">
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700"
                  >
                    <Plus className="h-5 w-5" />
                    新規追加
                  </button>
                </div>
              </div>
            </div>

            {/* コンテキストメニュー */}
            {showContextMenu && (
              <div 
                ref={contextMenuRef}
                className="fixed bg-white shadow-lg rounded-md p-3 z-50 w-64 border"
                style={{ 
                  top: `${contextMenuPosition.y}px`, 
                  left: `${contextMenuPosition.x}px`,
                }}
              >
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {columns.find(col => col.id === contextMenuPosition.columnId)?.name || ''}のフィルター
                  </h3>
                  
                  {/* テキスト検索フィールド */}
                  <div className="flex mb-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-l"
                      placeholder="テキスト検索..."
                      defaultValue={columnFilters[contextMenuPosition.columnId] || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          handleApplyColumnFilter(contextMenuPosition.columnId, value);
                        }
                      }}
                    />
                    <button 
                      className="bg-blue-500 text-white px-3 rounded-r"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        handleApplyColumnFilter(contextMenuPosition.columnId, input.value);
                      }}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 列の一意の値によるフィルタリングオプション */}
                  <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">利用可能な値:</p>
                    {getUniqueValuesForColumn(contextMenuPosition.columnId).map(value => {
                      // 現在のフィルター値を解析
                      const currentFilters = columnFilters[contextMenuPosition.columnId] || '';
                      const currentValues = currentFilters.split(',');
                      const isChecked = currentValues.includes(String(value));
                      
                      return (
                        <label key={String(value)} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxFilterChange(
                              contextMenuPosition.columnId,
                              String(value),
                              e.target.checked
                            )}
                            className="w-4 h-4"
                          />
                          <span className="text-sm truncate">{String(value)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                {columnFilters[contextMenuPosition.columnId] && (
                  <button
                    className="w-full py-1 px-2 bg-red-100 text-red-700 rounded text-sm"
                    onClick={() => handleClearColumnFilter(contextMenuPosition.columnId)}
                  >
                    このフィルターをクリア
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// 表示時の値をレンダリング
function renderDisplayValue(column: ColumnConfig, type: ActivityType) {
  const value = type[column.id];
  
  if (column.id === 'typeCode') {
    return <span className="font-mono">{value}</span>;
  }
  
  if (column.id === 'isActive') {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "有効" : "無効"}
      </span>
    );
  }
  
  if (column.id === 'color') {
    return (
      <div className="flex items-center">
        <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: value }}></div>
        {value}
      </div>
    );
  }
  
  return value;
}

// 必須フィールドかどうかを判定
function isRequiredField(columnId: string): boolean {
  return ['typeCode', 'typeName', 'category', 'subCategory'].includes(columnId);
}

// 入力フィールドをレンダリング（一括編集や新規追加フォーム用）
function renderInputField(column: ColumnConfig, value: any, onChange: (value: any) => void) {
  const dataType = column.dataType?.toUpperCase() || '';
  
  if (column.id === 'typeCode') {
    return (
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        maxLength={4}
      />
    );
  }
  
  if (column.id === 'isActive') {
    return (
      <select
        className="w-full p-2 border rounded"
        value={value !== undefined ? value : 1}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={1}>有効</option>
        <option value={0}>無効</option>
      </select>
    );
  }
  
  if (column.id === 'color') {
    return (
      <input
        type="color"
        className="w-full h-10 border rounded"
        value={value || '#808080'}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  
  if (dataType.includes('INT') || dataType.includes('NUMERIC')) {
    return (
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={value === undefined ? '' : value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={1}
      />
    );
  }

  if (dataType.includes('REAL') || dataType.includes('FLOAT')) {
    return (
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={value === undefined ? '' : value}
        onChange={(e) => onChange(Number(e.target.value))}
        step="0.01"
      />
    );
  }
  
  if (column.id === 'description') {
    return (
      <textarea
        className="w-full p-2 border rounded"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    );
  }
  
  return (
    <input
      type="text"
      className="w-full p-2 border rounded"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
