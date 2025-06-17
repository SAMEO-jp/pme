"use client"

import { useState, useEffect } from "react"
import { ProjectTabContent } from "./ProjectTabContent"
import { IndirectTabContent } from "./IndirectTabContent"

// サブタブの定義（各タブごとに用意）
const SUBTABS: Record<string, string[]> = {
  その他: ["出張", "〇対応", "プロ管理", "資料", "その他"],
  計画: ["計画図", "検討書", "見積り"],
  設計: ["計画図", "詳細図", "組立図", "改正図"],
  会議: ["内部定例", "外部定例", "プロ進行", "その他"],
  購入品: [],
  // 間接業務用のサブタブを追加
  純間接: ["日報入力", "会議", "人事評価", "作業", "その他"],
  目的間接: ["作業", "会議", "その他"],
  控除時間: ["休憩／外出", "組合時間", "その他"],
}

type WeekSidebarProps = {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  selectedProjectSubTab: string
  setSelectedProjectSubTab: (subTab: string) => void
  selectedEvent: any
  hasChanges: boolean
  handleDeleteEvent: () => void
  updateEvent: (updatedEvent: any) => void
  employees: any[]
  projects: any[]
  setSelectedEvent: (event: any) => void
  currentUser: any
  // 間接業務サブタブ用のプロパティを追加
  indirectSubTab?: string
  setIndirectSubTab?: (subTab: string) => void
}

// プロジェクト選択用のプルダウンコンポーネント
const ProjectSelect = ({ 
  projects, 
  selectedProjectCode, 
  onChange,
  label,
  selectedEvent,
  updateEvent,
  isProjectTab
}: { 
  projects: any[]; 
  selectedProjectCode: string; 
  onChange: (projectCode: string) => void;
  label: string;
  selectedEvent: any;
  updateEvent: (event: any) => void;
  isProjectTab: boolean;
}) => {
  // ローカルストレージから取得したプロジェクトを使用する
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  
  useEffect(() => {
    // コンポーネントマウント時にローカルストレージからプロジェクトデータを取得
    const allProjects = JSON.parse(localStorage.getItem('currentUser_projects') || '[]');
    
    try {
      // プロジェクト（isProject=1）のみをフィルタリング
      const filteredProjects = allProjects.filter((p: any) => p.isProject === '1');
      
      // プロジェクトデータのフィールド名を適切にマッピング
      const mappedProjects = filteredProjects.map((p: any) => ({
        projectCode: p.projectNumber,
        projectName: p.name
      }));
      
      console.log(`ローカルストレージから${mappedProjects.length}件のプロジェクトを読み込みました`);
      setLocalProjects(mappedProjects);
    } catch (error) {
      console.error('プロジェクトデータのパースに失敗しました:', error);
      // 失敗した場合は渡されたプロジェクトを使用
      setLocalProjects(projects.map(p => ({
        projectCode: p.projectCode || p.projectNumber,
        projectName: p.projectName || p.name
      })));
    }
  }, [projects]);
  
  const handleProjectChange = (projectCode: string) => {
    onChange(projectCode);
    
    if (selectedEvent) {
      if (isProjectTab) {
        // プロジェクトタブの場合は設備番号情報もリセット
        updateEvent({ 
          ...selectedEvent, 
          project: projectCode,
          equipmentNumber: "",
          equipmentName: "",
          departmentCode: ""
        });
      } else {
        // 間接業務タブ（目的間接）の場合
        updateEvent({ 
          ...selectedEvent, 
          purposeProject: projectCode 
        });
      }
    }
  };
  
  return (
    <div className="px-4 py-2 border-b">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select 
        className="w-full p-2 border rounded" 
        value={selectedProjectCode} 
        onChange={(e) => handleProjectChange(e.target.value)}
      >
        <option value="">選択してください</option>
        {localProjects.map((project) => (
          <option key={project.projectCode} value={project.projectCode}>
            {project.projectCode} - {project.projectName}
          </option>
        ))}
      </select>
    </div>
  );
};

// 間接業務選択用のプルダウンコンポーネント
const IndirectSelect = ({ 
  projects, 
  selectedProjectCode, 
  onChange,
  label
}: { 
  projects: any[]; 
  selectedProjectCode: string; 
  onChange: (projectCode: string) => void;
  label: string;
}) => {
  // ローカルストレージから取得した間接業務を使用する
  const [localIndirects, setLocalIndirects] = useState<any[]>([]);
  
  useEffect(() => {
    // コンポーネントマウント時にローカルストレージから間接業務データを取得
    const allProjects = JSON.parse(localStorage.getItem('currentUser_projects') || '[]');
    
    try {
      // 間接業務（isProject=0）のみをフィルタリング
      const indirects = allProjects.filter((p: any) => p.isProject === '0');
      
      // 間接業務データのフィールド名を適切にマッピング
      const mappedIndirects = indirects.map((p: any) => ({
        projectCode: p.projectNumber,
        projectName: p.name
      }));
      
      console.log(`ローカルストレージから${mappedIndirects.length}件の間接業務を読み込みました`);
      setLocalIndirects(mappedIndirects);
    } catch (error) {
      console.error('間接業務データのパースに失敗しました:', error);
      // 失敗した場合は渡されたプロジェクトからisProject=0のものを使用
      const filteredProjects = projects.filter(p => p.isProject === 0 || p.isProject === "0");
      setLocalIndirects(filteredProjects.map(p => ({
        projectCode: p.projectCode || p.projectNumber,
        projectName: p.projectName || p.name
      })));
    }
  }, [projects]);
  
  return (
    <div className="px-4 py-2 border-b">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select 
        className="w-full p-2 border rounded" 
        value={selectedProjectCode} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">選択してください</option>
        {localIndirects.map((project) => (
          <option key={project.projectCode} value={project.projectCode}>
            {project.projectCode} - {project.projectName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function WeekSidebar({
  selectedTab,
  setSelectedTab,
  selectedProjectSubTab,
  setSelectedProjectSubTab,
  selectedEvent,
  hasChanges,
  handleDeleteEvent,
  updateEvent,
  employees,
  projects,
  setSelectedEvent,
  currentUser,
  indirectSubTab = "純間接", // デフォルト値を設定
  setIndirectSubTab = () => {}, // デフォルト値を設定
}: WeekSidebarProps) {
  // 購入品検索用の状態
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  // 最近使用した購入品
  const [recentItems, setRecentItems] = useState<any[]>([
    { id: "item1", name: "水素供給バルブ", description: "高圧水素用バルブ 300A" },
    { id: "item2", name: "水素流量計", description: "マスフローメーター 0-100Nm3/h" },
    { id: "item3", name: "制御盤", description: "水素吹き込み制御盤" },
  ])

  // 状態管理に関連する変数
  const [selectedProjectCode, setSelectedProjectCode] = useState<string>("")
  const [equipmentNumbers, setEquipmentNumbers] = useState<string[]>([])
  const [equipmentOptions, setEquipmentOptions] = useState<{ id: string, name: string }[]>([])
  const [equipmentNumber, setEquipmentNumber] = useState<string>("")
  const [equipmentName, setEquipmentName] = useState<string>("")
  const [purchaseItems, setPurchaseItems] = useState<any[]>([])
  const [isLoadingEquipment, setIsLoadingEquipment] = useState<boolean>(false)
  const [isLoadingPurchaseItems, setIsLoadingPurchaseItems] = useState<boolean>(false)

  // サブタブ用のステート追加
  const [selectedOtherSubTab, setSelectedOtherSubTab] = useState<string>("〇先対応")
  // 間接業務のサブタブ用ステート
  const [selectedIndirectDetailTab, setSelectedIndirectDetailTab] = useState<string>("日報入力")
  const [purposeProjectCode, setPurposeProjectCode] = useState<string>("")

  // コンポーネントがマウントされたときに、選択されたイベントからプロジェクトと製番を設定
  useEffect(() => {
    if (selectedEvent) {
      // プロジェクトが選択されている場合
      if (selectedEvent.project) {
        setSelectedProjectCode(selectedEvent.project)
      }

      // 設備番号が選択されている場合
      if (selectedEvent.equipmentNumber) {
        setEquipmentNumber(selectedEvent.equipmentNumber)
      }

      // 設備名が設定されている場合
      if (selectedEvent.equipmentName) {
        setEquipmentName(selectedEvent.equipmentName)
      }
    }
  }, [selectedEvent])

  // プロジェクトが選択されたときに製番リストを取得
  useEffect(() => {
    if (!selectedProjectCode) {
      setEquipmentNumbers([])
      setEquipmentOptions([])
      setEquipmentNumber("")
      setEquipmentName("")
      return
    }

    const fetchEquipmentNumbers = async () => {
      setIsLoadingEquipment(true)
      try {
        if (selectedProjectSubTab === "購入品") {
          // 購入品リストから設備番号・名称を取得（プロジェクト個別＋all）
          const [res1, res2] = await Promise.all([
            fetch(`/api/project-purchase-items?projectCode=${selectedProjectCode}`),
            fetch(`/api/project-purchase-items?projectCode=all`)
          ])
          const data1 = await res1.json()
          const data2 = await res2.json()
          const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])]
          // ユニークなequipmentNumber/itemNameペア
          const filtered = allData.filter((item: any) => item.equipmentNumber && item.itemName)
          const uniquePairs = Array.from(new Map(filtered.map((item: any) => [item.equipmentNumber, item.itemName])).entries())
          // all/未選択を先頭に
          uniquePairs.sort(([a], [b]) => (a === '0' ? -1 : b === '0' ? 1 : 0))
          setEquipmentNumbers(uniquePairs.map(([num]) => num as string))
          setEquipmentOptions(uniquePairs.map(([num, name]) => ({ id: String(num), name: String(name) })))
          if (uniquePairs.length > 0 && !equipmentNumber) {
            setEquipmentNumber(uniquePairs[0][0] as string)
            setEquipmentName(uniquePairs[0][1] as string)
          }
        } else {
          // project_equipmentテーブルからequipment_id/equipment_Nameを取得（プロジェクト個別＋all）
          const [res1, res2] = await Promise.all([
            fetch(`/api/project-equipment-list?projectId=${selectedProjectCode}`),
            fetch(`/api/project-equipment-list?projectId=all`)
          ])
          const data1 = await res1.json()
          const data2 = await res2.json()
          const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])]
          // all/未選択を先頭に
          allData.sort((a: any, b: any) => (a.equipment_id === '0' ? -1 : b.equipment_id === '0' ? 1 : 0))
          setEquipmentNumbers(allData.map((eq: any) => eq.equipment_id))
          setEquipmentOptions(allData.map((eq: any) => ({ id: String(eq.equipment_id), name: String(eq.equipment_Name) })))
          if (allData.length > 0 && !equipmentNumber) {
            setEquipmentNumber(allData[0].equipment_id)
            setEquipmentName(allData[0].equipment_Name)
          }
        }
      } catch (error) {
        setEquipmentNumbers([])
        setEquipmentOptions([])
      } finally {
        setIsLoadingEquipment(false)
      }
    }
    fetchEquipmentNumbers()
  }, [selectedProjectCode, selectedProjectSubTab])

  // 製番が選択されたときに購入品リストを取得
  useEffect(() => {
    if (!selectedProjectCode || !equipmentNumber) {
      setPurchaseItems([])
      return
    }

    const fetchPurchaseItems = async () => {
      setIsLoadingPurchaseItems(true)
      try {
        // プロジェクト個別＋all
        const [res1, res2] = await Promise.all([
          fetch(`/api/project-purchase-items?projectCode=${selectedProjectCode}&equipmentNumber=${equipmentNumber}`),
          fetch(`/api/project-purchase-items?projectCode=all&equipmentNumber=${equipmentNumber}`)
        ])
        const data1 = await res1.json()
        const data2 = await res2.json()
        const allData = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])]
        setPurchaseItems(allData)
      } catch (error) {
        console.error("購入品リストの取得中にエラーが発生しました:", error)
      } finally {
        setIsLoadingPurchaseItems(false)
      }
    }

    fetchPurchaseItems()
  }, [selectedProjectCode, equipmentNumber])

  // 検索語が変更されたときに検索結果を更新
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    // 選択されたプロジェクトと製番に基づいて購入品をフィルタリング
    if (selectedProjectCode && equipmentNumber && purchaseItems.length > 0) {
      // 実際の購入品データからフィルタリング
      const filteredItems = purchaseItems
        .filter(
          (item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.itemDescription && item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .map((item) => ({
          id: item.keyID,
          name: item.itemName,
          description: item.itemDescription,
        }))

      setSearchResults(filteredItems)
    } else {
      // プロジェクトや製番が選択されていない場合はモックデータを使用
      const mockResults = [
        { id: "item1", name: "水素供給バルブ", description: "高圧水素用バルブ 300A" },
        { id: "item2", name: "水素流量計", description: "マスフローメーター 0-100Nm3/h" },
        { id: "item3", name: "制御盤", description: "水素吹き込み制御盤" },
        { id: "item4", name: "高圧電源装置", description: "DC 100kV 10mA" },
        { id: "item5", name: "集塵極板", description: "特殊合金製 2m×3m" },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )

      setSearchResults(mockResults)
    }
  }, [searchTerm, selectedProjectCode, equipmentNumber, purchaseItems])

  // タブ切り替え時に業務分類コードを更新する関数
  const updateActivityCodePrefix = (tab: string, subTab?: string) => {
    if (!selectedEvent) return;
    
    let newCode = "";
    
    if (tab === "project") {
      // サブタブ変更時に関連する業務タイプの選択状態をリセット
      if (subTab === "計画図" || subTab === "検討書" || subTab === "見積り") {
        // 計画関連の選択をリセット
        if (selectedEvent.planningSubType || selectedEvent.estimateSubType) {
          // 計画図のサブタイプがある場合はリセット
          updateEvent({
            ...selectedEvent,
            planningSubType: "",
            estimateSubType: ""
          });
        }
      } else if (subTab === "詳細図" || subTab === "組立図" || subTab === "改正図") {
        // 設計関連の選択をリセット
        if (selectedEvent.designSubType) {
          updateEvent({
            ...selectedEvent,
            designSubType: ""
          });
        }
      } else if (subTab === "その他") {
        // その他の選択をリセット
        if (selectedEvent.travelType || selectedEvent.stakeholderType || 
            selectedEvent.documentType || selectedEvent.documentMaterial) {
          updateEvent({
            ...selectedEvent,
            travelType: "",
            stakeholderType: "",
            documentType: "",
            documentMaterial: ""
          });
        }
      }
      
      let codePrefix = "P"; // デフォルトはP
      if (subTab === "計画") codePrefix = "P";
      else if (subTab === "設計") codePrefix = "D";
      else if (subTab === "会議") codePrefix = "M";
      else if (subTab === "購入品") codePrefix = "P";
      else if (subTab === "その他") codePrefix = "O";
      
      // サブタブに基づく3桁目の文字を設定
      let thirdChar = "0"; // デフォルト
      if (subTab === "計画") {
        // 計画サブタブ
        if (selectedEvent.subTabType === "計画図") thirdChar = "P";
        else if (selectedEvent.subTabType === "検討書") thirdChar = "C";
        else if (selectedEvent.subTabType === "見積り") thirdChar = "T";
      }
      else if (subTab === "設計") {
        if (selectedEvent.subTabType === "計画図") thirdChar = "P";
        else if (selectedEvent.subTabType === "詳細図") thirdChar = "S";
        else if (selectedEvent.subTabType === "組立図") thirdChar = "K";
        else if (selectedEvent.subTabType === "改正図") thirdChar = "R";
      }
      else if (subTab === "会議") {
        if (selectedEvent.subTabType === "内部定例") thirdChar = "N";
        else if (selectedEvent.subTabType === "外部定例") thirdChar = "G";
        else if (selectedEvent.subTabType === "プロ進行") thirdChar = "J";
        else if (selectedEvent.subTabType === "その他") thirdChar = "O";
      }
      else if (subTab === "その他") {
        if (selectedEvent.subTabType === "出張") thirdChar = "A";
        else if (selectedEvent.subTabType === "〇対応") thirdChar = "U";
        else if (selectedEvent.subTabType === "プロ管理") thirdChar = "B";
        else if (selectedEvent.subTabType === "資料") thirdChar = "L";
        else if (selectedEvent.subTabType === "その他") thirdChar = "O";
      }
      else if (subTab === "購入品") {
        thirdChar = "0"; // 購入品はすべて0
      }
      
      // 下二桁（基本00、購入品は選択値）
      let lastDigits = "00";
      if (subTab === "購入品" && selectedEvent.activityColumn) {
        // 購入品タブの場合は、選択された列の値を下二桁に設定
        const columnCode =
          selectedEvent.activityColumn === "0" ? "00" :
          selectedEvent.activityColumn === "1" ? "01" :
          selectedEvent.activityColumn === "2" ? "02" :
          selectedEvent.activityColumn === "3" ? "03" :
          selectedEvent.activityColumn === "4" ? "04" :
          selectedEvent.activityColumn === "5" ? "05" :
          selectedEvent.activityColumn === "6" ? "06" :
          selectedEvent.activityColumn === "7" ? "07" :
          selectedEvent.activityColumn === "8" ? "08" :
          selectedEvent.activityColumn === "9" ? "09" :
          selectedEvent.activityColumn === "A" ? "10" :
          selectedEvent.activityColumn === "B" ? "11" :
          selectedEvent.activityColumn === "C" ? "12" :
          selectedEvent.activityColumn === "D" ? "13" :
          selectedEvent.activityColumn === "E" ? "14" :
          selectedEvent.activityColumn === "F" ? "15" :
          selectedEvent.activityColumn === "G" ? "16" : "00";
        lastDigits = columnCode;
      }
      
      // プロジェクトタブの4桁コードを構成
      newCode = `${codePrefix}${thirdChar}${lastDigits}`;
    } else if (tab === "indirect") {
      // 間接業務は現在のサブタブとディテールサブタブを確認して4桁コードを構成
      let codePrefix = "";
      let codeSuffix = "00";
      
      // プレフィックス設定（純間接=ZJ, 目的間接=ZM, 控除時間=ZK）
      if (indirectSubTab === "純間接") {
        codePrefix = "ZJ";
        // サブタブによるサフィックス
        if (selectedIndirectDetailTab === "会議") codeSuffix = "M0";
        else if (selectedIndirectDetailTab === "日報入力") codeSuffix = "D0";
        else if (selectedIndirectDetailTab === "人事評価") codeSuffix = "H0";
        else if (selectedIndirectDetailTab === "作業") codeSuffix = "A0";
        else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
        else codeSuffix = "00";
      } 
      else if (indirectSubTab === "目的間接") {
        codePrefix = "ZM";
        // サブタブによるサフィックス
        if (selectedIndirectDetailTab === "会議") codeSuffix = "M0";
        else if (selectedIndirectDetailTab === "作業") codeSuffix = "A0";
        else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
        else codeSuffix = "00";
      } 
      else if (indirectSubTab === "控除時間") {
        codePrefix = "ZK";
        // サブタブによるサフィックス
        if (selectedIndirectDetailTab === "休憩／外出") codeSuffix = "ZZ";
        else if (selectedIndirectDetailTab === "組合時間") codeSuffix = "ZK";
        else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
        else codeSuffix = "00";
      }
      else {
        codePrefix = "Z";
      }
      
      // 間接業務の4桁コードを構成
      newCode = codePrefix + codeSuffix;
    }
    
    const updatedEvent = {
      ...selectedEvent,
      activityCode: newCode,
      businessCode: newCode
    };
    
    // 間接業務タブに変更した場合
    if (tab === "indirect") {
      updatedEvent.indirectType = indirectSubTab;
    }
    
    updateEvent(updatedEvent);
  };

  // 設備番号選択時に設備名もセット
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    setEquipmentNumber(selectedId)
    const found = equipmentOptions.find(opt => opt.id === selectedId)
    setEquipmentName(found ? found.name : "")
    // 必要に応じてイベントにも反映
    if (selectedEvent) {
      if (selectedProjectSubTab === "購入品") {
        updateEvent({ ...selectedEvent, equipmentNumber: selectedId, itemName: found ? found.name : "" })
      } else {
        updateEvent({ ...selectedEvent, equipment_id: selectedId, equipment_Name: found ? found.name : "" })
      }
    }
  }

  // equipmentNumberが変わったときに自動で名称をセット
  useEffect(() => {
    if (!equipmentNumber) {
      setEquipmentName("")
      return
    }
    const found = equipmentOptions.find(opt => opt.id === equipmentNumber)
    setEquipmentName(found ? found.name : "")
  }, [equipmentNumber, equipmentOptions])

  return (
    <div className="w-80 ml-4">
      {/* 1つのカードにまとめたサイドバー */}
      <div className="bg-white rounded-lg shadow flex-1 overflow-y-auto">
        {/* ヘッダー部分 */}
        <div className="p-3 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">業務詳細</h2>
          {selectedEvent && (
          <div className="flex border rounded overflow-hidden">
            <button
              className={`py-1 px-3 text-sm font-medium ${
                selectedTab === "project" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
                onClick={() => {
                  setSelectedTab("project");
                  if (selectedEvent) {
                    updateActivityCodePrefix("project", selectedProjectSubTab);
                  }
                }}
            >
              プロジェクト
            </button>
            <button
              className={`py-1 px-3 text-sm font-medium ${
                selectedTab === "indirect" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
                onClick={() => {
                  setSelectedTab("indirect");
                  if (selectedEvent) {
                    updateActivityCodePrefix("indirect");
                  }
                }}
            >
              間接業務
            </button>
          </div>
          )}
        </div>

        {/* イベント未選択時のデフォルト表示 */}
        {!selectedEvent ? (
          <div className="p-4">
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">左側のカレンダーから日付を選択、または</p>
              <p className="text-gray-500 mb-4">タイムグリッドの枠をクリックして新しい業務を登録してください</p>
            </div>
          </div>
        ) : (
        <>
        {/* プロジェクトコード選択ドロップダウン - プロジェクトタブまたは目的間接タブの場合のみ表示 */}
        {(selectedTab === "project" || (selectedTab === "indirect" && indirectSubTab === "目的間接")) && (
          <ProjectSelect
            projects={projects}
            selectedProjectCode={selectedTab === "project" ? selectedProjectCode : purposeProjectCode}
            onChange={(projectCode) => {
              if (selectedTab === "project") {
                setSelectedProjectCode(projectCode);
              } else {
                setPurposeProjectCode(projectCode);
              }
            }}
            label={selectedTab === "project" ? "プロジェクトコード" : "目的プロジェクトコード"}
            selectedEvent={selectedEvent}
            updateEvent={updateEvent}
            isProjectTab={selectedTab === "project"}
          />
        )}

        {/* 純間接の場合の固定プロジェクトコード表示 */}
        {selectedTab === "indirect" && indirectSubTab === "純間接" && (
          <div className="px-4 py-2 border-b">
            <label className="block text-xs font-medium text-gray-500 mb-1">純間接コード</label>
            <div className="p-2 bg-gray-100 rounded border text-gray-700">純間接（作業対象プロジェクトなし）</div>
          </div>
        )}

        {/* 控除時間の場合の固定プロジェクトコード表示 */}
        {selectedTab === "indirect" && indirectSubTab === "控除時間" && (
          <div className="px-4 py-2 border-b">
            <label className="block text-xs font-medium text-gray-500 mb-1">控除時間コード</label>
            <div className="p-2 bg-gray-100 rounded border text-gray-700">控除時間の為プロ番無し</div>
          </div>
        )}

        {/* サブタブ表示 - プロジェクトタブの場合 */}
        {selectedTab === "project" && (
          <div className="flex overflow-x-auto text-sm border-b px-4 py-2">
            {["計画", "設計", "会議", "購入品", "その他"].map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedProjectSubTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setSelectedProjectSubTab(subTab);
                  
                  // サブタブ変更時に各種選択状態をリセット
                if (selectedEvent) {
                    // リセットが必要なフィールドを特定
                    const resetFields = {
                      planningSubType: "",
                      estimateSubType: "",
                      designSubType: "",
                      designTypeCode: "",
                      meetingType: "",
                      meetingCode: "",
                      travelType: "",
                      stakeholderType: "",
                      documentType: "",
                      documentMaterial: ""
                    };
                    
                    // 更新イベントを呼び出し
                    updateEvent({ 
                      ...selectedEvent, 
                      ...resetFields,
                      subTabType: "" // サブタブの種類もリセット
                    });
                    
                    // 業務分類コードを更新
                    updateActivityCodePrefix("project", subTab);
                  }
                }}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* サブタブ表示 - 間接業務タブの場合 */}
        {selectedTab === "indirect" && (
          <div className="flex overflow-x-auto text-sm border-b px-4 py-2">
            {["純間接", "目的間接", "控除時間"].map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  indirectSubTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setIndirectSubTab(subTab);
                  // 業務分類コードのプレフィックスと初期サフィックスを設定
                  let initialCode;
                  let defaultSubTab = "";
                  
                  if (subTab === "純間接") {
                    initialCode = "ZJD0"; // 日報入力がデフォルト
                    defaultSubTab = "日報入力";
                  } else if (subTab === "目的間接") {
                    initialCode = "ZMA0"; // 作業がデフォルト
                    defaultSubTab = "作業";
                  } else if (subTab === "控除時間") {
                    initialCode = "ZKZZ"; // 休憩/外出がデフォルト
                    defaultSubTab = "休憩／外出";
                  } else {
                    initialCode = "Z000";
                  }
                  
                  if (selectedEvent) {
                    // リセットが必要なフィールドを特定
                    const resetFields = {
                      meetingType: "",
                      workType: "",
                      indirectDetailType: defaultSubTab
                    };
                    
                    updateEvent({
                      ...selectedEvent,
                      ...resetFields,
                      activityCode: initialCode,
                      businessCode: initialCode,
                      indirectType: subTab
                    });
                  }
                  
                  // サブタブのデフォルト値を設定
                  if (subTab === "純間接") {
                    setSelectedIndirectDetailTab("日報入力");
                  } else if (subTab === "目的間接") {
                    setSelectedIndirectDetailTab("作業");
                  } else if (subTab === "控除時間") {
                    setSelectedIndirectDetailTab("休憩／外出");
                  }
                }}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* 間接業務の純間接サブタブ */}
        {selectedTab === "indirect" && indirectSubTab === "純間接" && (
          <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
            {SUBTABS.純間接.map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedIndirectDetailTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setSelectedIndirectDetailTab(subTab);
                  // サブタブに基づいて下二桁を設定
                  let codeSuffix = "00";
                  if (subTab === "会議") codeSuffix = "M0";
                  else if (subTab === "日報入力") codeSuffix = "D0";
                  else if (subTab === "人事評価") codeSuffix = "H0";
                  else if (subTab === "作業") codeSuffix = "A0";
                  else if (subTab === "その他") codeSuffix = "O0";
                  
                  // 純間接のプレフィックス + 業務コードサフィックス
                  const newCode = `ZJ${codeSuffix}`;
                  
                  // リセットすべきフィールド
                  const resetFields = {
                    meetingType: "",
                    workType: ""
                  };
                  
                  if (selectedEvent) {
                    updateEvent({ 
                      ...selectedEvent, 
                      ...resetFields,
                      indirectDetailType: subTab,
                      activityCode: newCode,
                      businessCode: newCode 
                    });
                  }
                }}
              >
                {subTab}
              </button>
            ))}
      </div>
        )}

        {/* 間接業務の目的間接サブタブ */}
        {selectedTab === "indirect" && indirectSubTab === "目的間接" && (
          <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
            {SUBTABS.目的間接.map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedIndirectDetailTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setSelectedIndirectDetailTab(subTab);
                  // サブタブに基づいて下二桁を設定
                  let codeSuffix = "00";
                  if (subTab === "会議") codeSuffix = "M0";
                  else if (subTab === "作業") codeSuffix = "A0";
                  else if (subTab === "その他") codeSuffix = "O0";
                  
                  // 目的間接のプレフィックス + 業務コードサフィックス
                  const newCode = `ZM${codeSuffix}`;
                  
                  // リセットすべきフィールド
                  const resetFields = {
                    meetingType: "",
                    workType: ""
                  };
                  
                  if (selectedEvent) {
                    updateEvent({ 
                      ...selectedEvent, 
                      ...resetFields,
                      indirectDetailType: subTab,
                      activityCode: newCode,
                      businessCode: newCode 
                    });
                  }
                }}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* 間接業務の控除時間サブタブ */}
        {selectedTab === "indirect" && indirectSubTab === "控除時間" && (
          <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
            {SUBTABS.控除時間.map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedIndirectDetailTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setSelectedIndirectDetailTab(subTab);
                  // サブタブに基づいて下二桁を設定
                  let codeSuffix = "00";
                  if (subTab === "休憩／外出") codeSuffix = "ZZ";
                  else if (subTab === "組合時間") codeSuffix = "ZK";
                  else if (subTab === "その他") codeSuffix = "O0";
                  
                  // 控除時間のプレフィックス + 業務コードサフィックス
                  const newCode = `ZK${codeSuffix}`;
                  
                  if (selectedEvent) {
                    updateEvent({ 
                      ...selectedEvent, 
                      indirectDetailType: subTab,
                      activityCode: newCode,
                      businessCode: newCode 
                    });
                  }
                }}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* 第2レベルのサブタブ（選択されたタブに応じて表示） */}
        {selectedTab === "project" && selectedProjectSubTab === "その他" && (
          <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
            {SUBTABS.その他.map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedOtherSubTab === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setSelectedOtherSubTab(subTab)}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* 計画、設計、会議タブのサブタブ */}
        {selectedTab === "project" && 
          (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || selectedProjectSubTab === "会議") && 
          SUBTABS[selectedProjectSubTab as keyof typeof SUBTABS]?.length > 0 && (
          <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
            {SUBTABS[selectedProjectSubTab as keyof typeof SUBTABS].map((subTab) => (
              <button
                key={subTab}
                className={`py-1 px-1 whitespace-nowrap mr-2 ${
                  selectedEvent?.subTabType === subTab
                    ? "bg-blue-100 text-blue-800 font-medium rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  // サブタブに基づいて3桁目の文字を設定
                  let thirdChar = "0"; // デフォルト
                  
                  if (selectedProjectSubTab === "計画") {
                    if (subTab === "計画図") thirdChar = "P";
                    else if (subTab === "検討書") thirdChar = "C";
                    else if (subTab === "見積り") thirdChar = "T";
                  }
                  else if (selectedProjectSubTab === "設計") {
                    if (subTab === "計画図") thirdChar = "P";
                    else if (subTab === "詳細図") thirdChar = "S";
                    else if (subTab === "組立図") thirdChar = "K";
                    else if (subTab === "改正図") thirdChar = "R";
                  }
                  else if (selectedProjectSubTab === "会議") {
                    if (subTab === "内部定例") thirdChar = "N";
                    else if (subTab === "外部定例") thirdChar = "G";
                    else if (subTab === "プロ進行") thirdChar = "J";
                    else if (subTab === "その他") thirdChar = "O";
                  }
                  
                  // 業務分類コードの最初の文字
                  let codePrefix = "P";
                  if (selectedProjectSubTab === "計画") codePrefix = "P";
                  else if (selectedProjectSubTab === "設計") codePrefix = "D";
                  else if (selectedProjectSubTab === "会議") codePrefix = "M";
                  
                  // 4桁コードを構成（下二桁は00固定）
                  const newCode = `${codePrefix}${thirdChar}00`;
                  
                  // リセットが必要なフィールドを特定
                  const resetFields = {
                    planningSubType: "",
                    estimateSubType: "",
                    designSubType: "",
                    designTypeCode: "",
                    meetingType: "",
                    meetingCode: ""
                  };
                  
                  updateEvent({ 
                    ...selectedEvent, 
                    ...resetFields,
                    subTabType: subTab,
                    activityCode: newCode,
                    businessCode: newCode
                  });
                }}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* 購入品タブの中分類選択 */}
        {selectedTab === "project" && selectedProjectSubTab === "購入品" && (
          <div className="border-b bg-gray-50">
            <div className="px-4 py-2">
              <select 
                className="w-full py-1 border rounded text-sm" 
                value={selectedEvent?.activityColumn || "0"}
                onChange={(e) => {
                  const newColumn = e.target.value;
                  // 行は"1"（汎用）固定
                  const row = "1"; 
                  // 横列の値を2桁の数字に変換
                  const columnCode =
                    newColumn === "0" ? "00" :
                    newColumn === "1" ? "01" :
                    newColumn === "2" ? "02" :
                    newColumn === "3" ? "03" :
                    newColumn === "4" ? "04" :
                    newColumn === "5" ? "05" :
                    newColumn === "6" ? "06" :
                    newColumn === "7" ? "07" :
                    newColumn === "8" ? "08" :
                    newColumn === "9" ? "09" :
                    newColumn === "A" ? "10" :
                    newColumn === "B" ? "11" :
                    newColumn === "C" ? "12" :
                    newColumn === "D" ? "13" :
                    newColumn === "E" ? "14" :
                    newColumn === "F" ? "15" :
                    newColumn === "G" ? "16" : "00";
                    
                  // プレフィックスはP（購入品タブは常にP）
                  const newCode = `P${row}${columnCode}`;
                  updateEvent({
                    ...selectedEvent,
                    activityColumn: newColumn,
                    activityCode: newCode,
                    businessCode: newCode
                  });
                }}
              >
                <option value="0">00: 計画図作成</option>
                <option value="1">01: 仕様書作成準備</option>
                <option value="2">02: 仕様書作成・発行</option>
                <option value="3">03: 見積仕様比較検討</option>
                <option value="4">04: 契約確定確認</option>
                <option value="5">05: KOM</option>
                <option value="6">06: 確定仕様対応</option>
                <option value="7">07: 納入図対応</option>
                <option value="8">08: 工事用資料整備</option>
                <option value="9">09: 図面化及び出図対応</option>
                <option value="A">10: 試運転要領</option>
                <option value="B">11: 取説</option>
                <option value="C">12: 検査要領対応</option>
                <option value="D">13: 検査対応</option>
                <option value="E">14: 出荷調整対応</option>
                <option value="F">15: 検定対応</option>
                <option value="G">16: その他</option>
              </select>
            </div>
          </div>
        )}

        {/* 設備番号と設備名の入力欄 - プロジェクトタブの場合のみ表示 */}
        {selectedTab === "project" ? (
          <div className="border-b">
            <div className="flex justify-between">
              <div className="w-2/5 px-4 py-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {selectedProjectSubTab === "購入品" ? "購入品番号" : "設備番号"}
                </label>
                <select 
                  className="w-full p-2 border rounded text-sm" 
                  value={equipmentNumber} 
                  onChange={handleEquipmentChange}
                  disabled={!selectedProjectCode || isLoadingEquipment || equipmentOptions.length === 0}
                >
                  {equipmentOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.id}</option>
                  ))}
                </select>
              </div>
              <div className="w-3/5 px-4 py-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {selectedProjectSubTab === "購入品" ? "名称" : "設備名称"}
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm"
                  value={equipmentName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEquipmentName(name);
                    if (selectedEvent) {
                      if (selectedProjectSubTab === "購入品") {
                        updateEvent({ ...selectedEvent, itemName: name })
                      } else {
                        updateEvent({ ...selectedEvent, equipment_Name: name })
                      }
                    }
                  }}
                  placeholder=""
                  disabled={!equipmentNumber}
                />
              </div>
            </div>
            {selectedProjectCode && equipmentNumbers.length === 0 && !isLoadingEquipment && (
              <p className="text-xs text-red-500 mt-1 px-4 pb-2">このプロジェクトには{selectedProjectSubTab === "購入品" ? "購入品番号" : "設備番号"}が登録されていません</p>
            )}
          </div>
        ) : (
          // 間接業務タブの場合は「入力の必要無し」と表示
          <div className="border-b px-4 py-4">
            <div className="text-center text-gray-500 font-medium">
              設備番号・設備名称の入力の必要無し
            </div>
          </div>
        )}

        {/* 業務分類コード表示 - すべてのタブで共通 */}
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">業務分類コード</label>
            <div className="bg-blue-50 p-2 rounded-md flex items-center">
              <span className="font-mono text-lg font-bold">
                {selectedEvent?.activityCode || ""}
              </span>
              {selectedTab === "project" ? (
                // プロジェクトタブの場合は通常の設備番号と設備名を表示
                equipmentNumber && (
                  <span className="text-sm font-bold text-gray-600 ml-2">
                    {' - '}{equipmentNumber}{' - '}{equipmentName ? equipmentName : "XXXX"}
                  </span>
                )
              ) : (
                // 間接業務タブの場合は両方XXXXと表示
                <span className="text-sm font-bold text-gray-600 ml-2">
                  {' - XXXX - XXXX'}
                </span>
              )}
            </div>
            {selectedEvent?.businessCode && selectedEvent.businessCode !== selectedEvent.activityCode && (
              <div className="bg-gray-50 p-2 rounded-md mt-2 flex items-center">
                <span className="font-mono text-sm font-bold text-gray-600">{selectedEvent.businessCode}</span>
                <span className="text-xs text-gray-500 ml-2">業務コード</span>
              </div>
            )}
          </div>
      </div>

        {/* イベント詳細部分 - 選択時 */}
      {selectedEvent && (
          <div>
          {selectedTab === "project" ? (
            <ProjectTabContent
              selectedProjectSubTab={selectedProjectSubTab}
              selectedEvent={selectedEvent}
              updateEvent={updateEvent}
              projects={projects}
              selectedProjectCode={selectedProjectCode}
              setSelectedProjectCode={setSelectedProjectCode}
              equipmentNumbers={equipmentNumbers}
              selectedEquipment={equipmentNumber}
              setSelectedEquipment={setEquipmentNumber}
              isLoadingEquipment={isLoadingEquipment}
              purchaseItems={purchaseItems}
              isLoadingPurchaseItems={isLoadingPurchaseItems}
                selectedOtherSubTab={selectedOtherSubTab}
                setSelectedOtherSubTab={setSelectedOtherSubTab}
            />
          ) : (
              <IndirectTabContent 
                selectedEvent={selectedEvent} 
                updateEvent={updateEvent} 
                indirectSubTab={indirectSubTab}
                selectedIndirectDetailTab={selectedIndirectDetailTab}
                purposeProjectCode={purposeProjectCode}
              />
            )}

            <div className="space-y-0">
              <div className="border-b">
                <div className="px-4 py-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">タイトル</label>
                  <div className="relative">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={selectedEvent.title}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, title: e.target.value })
                }}
              />
                  </div>
                </div>
            </div>

              <div className="border-b">
                <div className="px-4 py-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">説明</label>
                  <div className="relative">
              <textarea
                className="w-full p-2 border rounded h-24"
                value={selectedEvent.description}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, description: e.target.value })
                }}
              ></textarea>
                  </div>
                </div>
            </div>

              <div className="grid grid-cols-2 border-b">
              {/* 開始時間 */}
                <div className="px-4 py-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">開始時間</label>
                <div className="flex space-x-2">
                  {/* 時間セレクト */}
                  <select
                    className="p-2 border rounded"
                    value={String(new Date(selectedEvent.startDateTime).getHours()).padStart(2, "0")}
                    onChange={(e) => {
                      const newHour = Number(e.target.value)
                      const newStart = new Date(selectedEvent.startDateTime)
                      newStart.setHours(newHour)
                      // 表示位置（top）の再計算（例：1 時間 = 64px）
                      const top = newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64
                      updateEvent({
                        ...selectedEvent,
                        startDateTime: newStart.toISOString(),
                        top,
                      })
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  {/* 分セレクト */}
                  <select
                    className="p-2 border rounded"
                    value={String(new Date(selectedEvent.startDateTime).getMinutes()).padStart(2, "0")}
                    onChange={(e) => {
                      const newMinute = Number(e.target.value)
                      const newStart = new Date(selectedEvent.startDateTime)
                      newStart.setMinutes(newMinute)
                      const top = newStart.getHours() * 64 + (newMinute / 60) * 64
                      updateEvent({
                        ...selectedEvent,
                        startDateTime: newStart.toISOString(),
                        top,
                      })
                    }}
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                      <option key={m} value={m.toString().padStart(2, "0")}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 終了時間 */}
                <div className="px-4 py-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">終了時間</label>
                <div className="flex space-x-2">
                  {/* 時間セレクト */}
                  <select
                    className="p-2 border rounded"
                    value={String(new Date(selectedEvent.endDateTime).getHours()).padStart(2, "0")}
                    onChange={(e) => {
                      const newHour = Number(e.target.value)
                      const newEnd = new Date(selectedEvent.endDateTime)
                      newEnd.setHours(newHour)
                      // 終了時間の場合、開始時間との時間差から高さを再計算
                      const startTime = new Date(selectedEvent.startDateTime)
                      const duration = (newEnd.getTime() - startTime.getTime()) / 60000
                      const height = (duration / 60) * 64
                      updateEvent({
                        ...selectedEvent,
                        endDateTime: newEnd.toISOString(),
                        height,
                      })
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  {/* 分セレクト */}
                  <select
                    className="p-2 border rounded"
                    value={String(new Date(selectedEvent.endDateTime).getMinutes()).padStart(2, "0")}
                    onChange={(e) => {
                      const newMinute = Number(e.target.value)
                      const newEnd = new Date(selectedEvent.endDateTime)
                      newEnd.setMinutes(newMinute)
                      const startTime = new Date(selectedEvent.startDateTime)
                      const duration = (newEnd.getTime() - startTime.getTime()) / 60000
                      const height = (duration / 60) * 64
                      updateEvent({
                        ...selectedEvent,
                        endDateTime: newEnd.toISOString(),
                        height,
                      })
                    }}
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                      <option key={m} value={m.toString().padStart(2, "0")}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Only show status field when not in meeting tab */}
            {!(selectedTab === "project" && selectedProjectSubTab === "会議") && (
                <div className="border-b">
                  <div className="px-4 py-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">状態</label>
                    <div className="relative">
                <select
                  className="w-full p-2 border rounded"
                  value={selectedEvent.status}
                  onChange={(e) => {
                    updateEvent({ ...selectedEvent, status: e.target.value })
                  }}
                >
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                  <option value="中止">中止</option>
                </select>
                    </div>
                  </div>
              </div>
            )}

              <div className="px-4 py-4 flex justify-center gap-4">
                <button
                  onClick={handleDeleteEvent}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium w-48"
                >
                  削除
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium w-48"
                >
                  閉じる
                </button>
              </div>
          </div>
        </div>
      )}

        {/* イベント未選択時のデフォルト表示 */}
      {!selectedEvent && (
          <div className="p-4">
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">左側のカレンダーから日付を選択、または</p>
              <p className="text-gray-500 mb-4">タイムグリッドの枠をクリックして新しい業務を登録してください</p>
              <h4 className="text-sm font-medium mb-2">週別表示の使い方</h4>
              <p className="text-xs text-gray-600 mb-2">この画面では、週単位で業務予定を管理できます。</p>

            </div>
            {/* タブに応じた説明を追加 */}
            {selectedTab === "project" && (
              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">プロジェクト業務について</h3>
                <p className="text-xs text-gray-600">
                  プロジェクト業務では「計画」「設計」「会議」「購入品」「その他」などの業務を管理できます。
                  タイムグリッドをクリックして新しい業務を追加してください。
                </p>
        </div>
      )}

            {selectedTab === "indirect" && (
              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">間接業務について</h3>
                <p className="text-xs text-gray-600">
                  間接業務では会議、研修、勉強会、資料作成などのプロジェクトに直接関連しない業務を管理できます。
                  タイムグリッドをクリックして新しい業務を追加してください。
                </p>
              </div>
            )}
        </div>
      )}
        </>
        )}
      </div>
    </div>
  )
}
