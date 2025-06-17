"use client"

import {
  // React
  useState,
  useEffect,
  useRef,
  useCallback,

  // Next.js
  useParams,
  useRouter,

  // DnD
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  restrictToWindowEdges,

  // データベース
  getEmployees,
  saveWeekAchievements,
  deleteAchievement,
  getCurrentUser,
  setWeekDataChanged,
  hasWeekDataChanged,
  saveWeekDataToStorage,
  clearWeekData,
  getWeekDataFromStorage,
  getKintaiByWeek,
  updateKintaiByWeek,

  // コンポーネント
  WeekSidebar,
  TimeGrid,
  EventDragOverlay,

  // ユーティリティ
  getWeekNumber,
  getWeekDates,
  getWeekDaysArray,
  formatDateTimeForStorage,
  parseDateTime,
  FIFTEEN_MIN_HEIGHT,
  minuteSlots,
  createNewEvent,
  useResizeEvent,
  EventItem,
  customDropAnimation,
  EVENT_CATEGORY_COLORS,
  DEFAULT_WORK_TIMES
} from "./imports"

export default function WeekShiwakePage() {
  // useParamsを使用してパラメータを取得（Next.js 15.2.4対応）
  const params = useParams()
  const router = useRouter()

  // URLパラメータから年と週を取得
  const year = Number.parseInt(params.year as string) || new Date().getFullYear()
  const week = Number.parseInt(params.week as string) || getWeekNumber(new Date())

  // 状態の型定義を追加
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeEvent, setActiveEvent] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ employeeNumber: string; name: string }>({
    employeeNumber: "999999",
    name: "仮ログイン",
  })
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const previousYearWeek = useRef<{ year: number; week: number }>({ year, week })
  // useState内にタブ状態を追加
  const [selectedTab, setSelectedTab] = useState("project")
  const [selectedProjectSubTab, setSelectedProjectSubTab] = useState("計画")
  // 間接業務タブ用のステートを追加
  const [indirectSubTab, setIndirectSubTab] = useState("純間接")
  const [apiError, setApiError] = useState<string | null>(null)
  // saveMessageの状態を追加
  const [saveMessage, setSaveMessage] = useState<{ type: string; text: string } | null>(null)

  // リサイズフックを使用
  const { handleResizeStart } = useResizeEvent(events, setEvents, selectedEvent, setSelectedEvent, year, week)

  // dnd-kitのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 20ピクセルから5ピクセルに減少 - より素早くドラッグを開始
      },
    }),
    useSensor(KeyboardSensor),
  )

  // 週の開始日と終了日を計算
  const { startDate, endDate } = getWeekDates(year, week)

  // 週の日付配列を生成
  const weekDays = getWeekDaysArray(startDate, endDate)

  // 時間スロットを生成（0時から23時まで）に変更
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  // 今日の日付を取得
  const today = new Date()
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Ctrlキーの状態を監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // ユーザー情報の取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // すでにcurrentUserが設定されていて、かつ仮ログインでない場合は何もしない
        if (currentUser && currentUser.employeeNumber !== "999999") {
          return;
        }

        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const data = await response.json();
        
        if (data.success && data.data) {
          const user = {
            employeeNumber: data.data.user_id || data.data.employeeNumber,
            name: data.data.name || "未設定"
          };
          setCurrentUser(user);
        } else {
          throw new Error("ユーザー情報が取得できませんでした");
        }
      } catch (error) {
        console.error("ユーザー情報の取得エラー:", error);
        // エラー時は仮ログイン状態を維持
        setCurrentUser({
          employeeNumber: "999999",
          name: "仮 ユーザー"
        });
      }
    };

    fetchCurrentUser();
  }, []);

  // イベントがない場合のデフォルト表示用ダミーイベント
  useEffect(() => {
    if (!loading && events.length === 0 && !selectedEvent) {
      // 週の初日の9時をデフォルト時間に設定
      const today = new Date()
      const defaultHour = 9
      
      // デフォルトイベントを作成
      const defaultEvent = createNewEvent({
        day: weekDays[0], // 週の初日
        hour: defaultHour,
        minute: 0,
        employeeNumber: currentUser.employeeNumber,
        selectedTab,
        selectedProjectSubTab,
        projects,
      })
      
      // デフォルトイベントは保存しない
      setSelectedEvent({
        ...defaultEvent,
        isDefault: true // これはデフォルトイベントであることを示すフラグ
      })
    }
  }, [loading, events, selectedEvent, weekDays, currentUser, selectedTab, selectedProjectSubTab, projects])

  // 週が変更されたときの処理
  useEffect(() => {
    const handleWeekChange = async () => {
      const prevYear = previousYearWeek.current.year
      const prevWeek = previousYearWeek.current.week

      // 週が変更された場合、前の週のデータを保存
      if (prevYear !== year || prevWeek !== week) {
        if (hasWeekDataChanged(prevYear, prevWeek)) {
          try {
            // 前の週のデータを取得
            const prevWeekEvents = events

            // 保存確認
            const shouldSave = confirm(`${prevYear}年第${prevWeek}週のデータに未保存の変更があります。保存しますか？`)

            if (shouldSave) {
              setIsSaving(true)
              await saveWeekAchievements(prevYear, prevWeek, prevWeekEvents)
              setSaveMessage({ type: "success", text: `${prevYear}年第${prevWeek}週のデータを保存しました` })
              // 5秒後にメッセージを消す
              setTimeout(() => setSaveMessage(null), 5000)
            } else {
              // 保存しない場合は変更フラグをクリア
              clearWeekData(prevYear, prevWeek)
            }
          } catch (error: unknown) {
            console.error("前の週のデータ保存中にエラーが発生しました:", error)
            setSaveMessage({
              type: "error",
              text: `保存エラー: ${error instanceof Error ? error.message : String(error)}`,
            })
            // 5秒後にメッセージを消す
            setTimeout(() => setSaveMessage(null), 5000)
          } finally {
            setIsSaving(false)
          }
        }
      }

      // 現在の週を記録
      previousYearWeek.current = { year, week }

      // 新しい週のデータを読み込む
      await loadWeekData(true)
      
      // 勤務時間データを初期化
      initializeWorkTimes()
    }

    handleWeekChange()
  }, [year, week])

  // 変更フラグの監視
  useEffect(() => {
    const checkChanges = () => {
      const changed = hasWeekDataChanged(year, week)
      setHasChanges(changed)
    }

    // 初期チェック
    checkChanges()

    // 定期的にチェック
    const interval = setInterval(checkChanges, 1000)

    return () => clearInterval(interval)
  }, [year, week])

  // ページ離脱時の処理
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasWeekDataChanged(year, week)) {
        // 変更がある場合は保存を試みる
        try {
          saveWeekDataToStorage(year, week, events)
          // 変更されたことを通知
          setWeekDataChanged(year, week, true)
        } catch (error) {
          console.error("離脱時の自動保存処理中にエラーが発生しました:", error)
        }

        e.preventDefault()
        e.returnValue = "変更が保存されていません。このページを離れますか？"
        return e.returnValue
      }
    }

    // ページ内の移動時にも保存処理を行う
    const handleRouteChange = () => {
      if (hasWeekDataChanged(year, week)) {
        try {
          console.log("ページ移動時に自動保存します")
          saveWeekDataToStorage(year, week, events)
          handleSaveWeekData()
        } catch (error) {
          console.error("ページ移動時の自動保存処理中にエラーが発生しました:", error)
        }
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [year, week, events]);

  // データの読み込み
  const loadWeekData = async (forceRefresh = false) => {
    setLoading(true)
    setApiError(null)
    try {
      const empData = await getEmployees()
      setEmployees(empData)

      const user = await getCurrentUser()
      setCurrentUser(user)

      // localStorageからプロジェクトデータを取得
      const cachedProjects = localStorage.getItem('currentUser_projects')
      if (cachedProjects) {
        const parsedProjects = JSON.parse(cachedProjects)
        setProjects(parsedProjects)
      }

      const apiUrl = `/api/achievements/week/${year}/${week}`

      try {
        const response = await fetch(apiUrl)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API応答エラー: ${response.status}, ${errorText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "データの取得に失敗しました")
        }

        const formattedEvents = data.data.map((event: EventItem) => {
          const startTime = new Date(event.startDateTime)
          const startHour = startTime.getHours()
          const startMinutes = startTime.getMinutes()

          const top = startHour * 64 + (startMinutes / 60) * 64

          return {
            ...formatEventForClient(event),
            top,
          }
        })

        setEvents(formattedEvents)

        saveWeekDataToStorage(year, week, formattedEvents)
        setWeekDataChanged(year, week, false)
      } catch (apiError) {
        setApiError(String(apiError))

        const cachedData = getWeekDataFromStorage(year, week)
        if (cachedData) {
          setEvents(cachedData)
        } else {
          setEvents([])
        }
      }

      setSelectedEvent(null)
    } catch (error: unknown) {
      alert(`データ取得エラー: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  // formatEventForClient関数をコンポーネント内に定義
  function formatEventForClient(item: EventItem) {
    const startTime = new Date(item.startDateTime)
    const endTime = new Date(item.endDateTime)
    const startHour = startTime.getHours()
    const startMinutes = startTime.getMinutes()
    const endHour = endTime.getHours()
    const endMinutes = endTime.getMinutes()
    const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes)
    const top = startHour * 64 + (startMinutes / 60) * 64
    const height = (duration / 60) * 64

    return {
      id: item.keyID,
      keyID: item.keyID, // keyIDも保持しておく
      title: item.subject,
      startDateTime: item.startDateTime,
      endDateTime: item.endDateTime,
      description: item.content || "",
      project: item.projectNumber || "",
      category: item.type || "",
      color: item.type ? (EVENT_CATEGORY_COLORS[item.type] || "#3788d8") : "#3788d8",
      employeeNumber: item.employeeNumber,
      position: item.position,
      facility: item.facility,
      status: item.status,
      organizer: item.organizer,
      top,
      height,
      // その他のフィールド
      businessCode: item.businessCode || item.classification5 || "", // businessCodeを優先、後方互換性のためclassification5も確認
      departmentCode: item.departmentCode || "", // 設備番号用
      weekCode: item.weekCode,
      classification1: item.classification1,
      classification2: item.classification2,
      classification3: item.classification3,
      classification4: item.classification4,
      classification5: item.classification5,
      classification6: item.classification6,
      classification7: item.classification7,
      classification8: item.classification8,
      classification9: item.classification9,
      // 業務分類コード関連フィールド
      activityCode: item.businessCode || item.classification5 || "", // businessCodeを優先
      activityRow: item.classification6 || "",
      activityColumn: item.classification7 || "",
      activitySubcode: item.classification8 || "",
      // 設備番号
      equipmentNumber: item.departmentCode || "", // departmentCodeから設備番号を取得
    }
  }

  // コンポーネントがマウントされた後に9時の位置にスクロールする処理を追加
  useEffect(() => {
    // 読み込み完了後に9時の位置にスクロール
    if (!loading) {
      const gridContainer = document.querySelector(".overflow-auto")
      if (gridContainer) {
        // 9時の位置 = 9時間分の高さ (各時間は64pxの高さ)
        gridContainer.scrollTop = 9 * 64
      }
    }
  }, [loading])

  // 勤務時間データ管理用のステート
  const [workTimes, setWorkTimes] = useState<{ date: string; startTime?: string; endTime?: string }[]>([])
  
  // 勤務時間データを初期化する関数
  const initializeWorkTimes = () => {
    // ローカルストレージから勤務時間データを取得
    const storageKey = `workTimes_${year}_${week}`;
    const savedWorkTimes = localStorage.getItem(storageKey);
    
    if (savedWorkTimes) {
      // 保存されたデータがあれば使用（ローカルキャッシュ）
      try {
        const parsedWorkTimes = JSON.parse(savedWorkTimes);
        setWorkTimes(parsedWorkTimes);
        console.log('ローカルストレージから勤務時間データを取得しました', parsedWorkTimes.length);
      } catch (error) {
        console.error('勤務時間データの解析に失敗しました:', error);
        // 解析エラーの場合はデフォルト値を設定
        initializeDefaultWorkTimes();
      }
    } else {
      // データベースから勤務時間データを取得
      loadWorkTimesFromDb();
    }
  };
  
  // データベースから勤務時間データを取得する関数
  const loadWorkTimesFromDb = async () => {
    try {
      console.log(`データベースから勤務時間データを取得します: ${year}年 第${week}週`);
      const kintaiData = await getKintaiByWeek(year, week);
      
      if (kintaiData && kintaiData.length > 0) {
        console.log('データベースから勤務時間データを取得しました', kintaiData.length);
        setWorkTimes(kintaiData);
        
        // キャッシュとして保存
        const storageKey = `workTimes_${year}_${week}`;
        localStorage.setItem(storageKey, JSON.stringify(kintaiData));
      } else {
        console.log('データベースに勤務時間データがありませんでした。デフォルト値を使用します。');
        initializeDefaultWorkTimes();
      }
    } catch (error) {
      console.error('データベースからの勤務時間データ取得に失敗しました:', error);
      // エラーの場合はデフォルト値を設定
      initializeDefaultWorkTimes();
    }
  };
  
  // デフォルトの勤務時間データを初期化する関数
  const initializeDefaultWorkTimes = () => {
    // ユーザーごとのデフォルト設定を取得
    const userDefaultKey = `workTimes_default_${currentUser.employeeNumber}`;
    const userDefaults = localStorage.getItem(userDefaultKey);
    let defaultStartTimes = { ...DEFAULT_WORK_TIMES.START_TIMES };
    let defaultEndTimes = { ...DEFAULT_WORK_TIMES.END_TIMES };
    
    if (userDefaults) {
      try {
        const parsedDefaults = JSON.parse(userDefaults);
        defaultStartTimes = { ...defaultStartTimes, ...parsedDefaults.startTimes };
        defaultEndTimes = { ...defaultEndTimes, ...parsedDefaults.endTimes };
      } catch (error) {
        console.error('ユーザーデフォルト設定の解析に失敗しました:', error);
      }
    }
    
    // 週の各日のデフォルト勤務時間データを初期化
    const newWorkTimes = weekDays.map(day => {
      const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      const dayOfWeek = day.getDay(); // 0: 日曜日, 1-5: 平日, 6: 土曜日
      
      return {
        date: dateString,
        startTime: defaultStartTimes[dayOfWeek as keyof typeof defaultStartTimes] || "",
        endTime: defaultEndTimes[dayOfWeek as keyof typeof defaultEndTimes] || ""
      };
    });
    
    setWorkTimes(newWorkTimes);
    
    // キャッシュとして保存
    const storageKey = `workTimes_${year}_${week}`;
    localStorage.setItem(storageKey, JSON.stringify(newWorkTimes));
  };
  
  // 勤務時間変更ハンドラ
  const handleWorkTimeChange = (date: string, startTime: string, endTime: string) => {
    console.log('勤務時間変更:', { date, startTime, endTime });
    
    const updatedWorkTimes = workTimes.map(wt => 
      wt.date === date 
        ? { ...wt, startTime, endTime } 
        : wt
    );
    
    setWorkTimes(updatedWorkTimes);
    
    // ローカルストレージに保存
    const storageKey = `workTimes_${year}_${week}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedWorkTimes));
    
    // 週データの変更フラグを設定
    setWeekDataChanged(year, week, true);
    
  };

  // ページ遷移前に保存するカスタム関数
  const navigateWithSaveCheck = useCallback((url: string) => {
    if (hasWeekDataChanged(year, week)) {
      const willSave = confirm("変更が保存されていません。保存してから移動しますか？");
      if (willSave) {
        // 同期的に保存してから遷移
        saveWeekDataToStorage(year, week, events);
        
        // APIへの保存を行ってから遷移
        saveWeekAchievements(year, week, events)
          .then(() => {
            console.log("ページ遷移前に自動保存しました");
            router.push(url);
          })
          .catch(error => {
            console.error("保存に失敗しました:", error);
            if (confirm("保存に失敗しました。それでも移動しますか？")) {
              router.push(url);
            }
          });
      } else {
        // 保存せずに遷移
        router.push(url);
      }
    } else {
      // 変更がなければそのまま遷移
      router.push(url);
    }
  }, [year, week, events, router]);
  
  // window.navigationイベントをインターセプト（モダンブラウザのための遷移検知）
  useEffect(() => {
    // Electronでも動作するようにwindowのbeforeunloadイベントを設定
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasWeekDataChanged(year, week)) {
        // 同期的に保存処理を実行
        saveWeekDataToStorage(year, week, events);
        
        // 確認ダイアログを表示
        e.preventDefault();
        e.returnValue = "変更が保存されていません。このページを離れますか？";
        return e.returnValue;
      }
    };

    // aタグのクリックを検知してページ遷移をインターセプト
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      // 内部リンクかつAPIリンクでない場合
      if (href && href.startsWith('/') && !href.startsWith('/api')) {
        // 変更がある場合
        if (hasWeekDataChanged(year, week)) {
          e.preventDefault();
          navigateWithSaveCheck(href);
        }
      }
    };
    
    // ボタンイベント監視（Next.jsの内部リンクをインターセプト）
    document.addEventListener('click', handleLinkClick);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [year, week, events, navigateWithSaveCheck]);

  // 週データの保存処理を修正
  const handleSaveWeekData = async () => {
    const hasWorkTimeChanges = workTimes.some(wt => wt.startTime || wt.endTime);
    
    if (!hasWeekDataChanged(year, week) && !hasWorkTimeChanges) {
      alert("保存する変更はありません。")
      return
    }

    try {
      setIsSaving(true)

      if (!events || events.length === 0) {
        alert("保存するイベントデータが空です。操作をキャンセルします。")
        return
      }

      await saveWeekAchievements(year, week, events)
      
      if (workTimes && workTimes.length > 0) {
        const savedKintai = await updateKintaiByWeek(year, week, workTimes)
        if (!savedKintai) {
          throw new Error("勤務時間データの保存に失敗しました")
        }
      }
      
      setSaveMessage({ type: "success", text: "週データが正常に保存されました" })
      setTimeout(() => setSaveMessage(null), 5000)

      await loadWeekData(true)
      await loadWorkTimesFromDb()
      
      setWeekDataChanged(year, week, false)
    } catch (error: unknown) {
      setSaveMessage({ type: "error", text: `保存エラー: ${error instanceof Error ? error.message : String(error)}` })
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  // イベントをクリックしたときの処理
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  // タイムスロットをクリックしたときの処理
  const handleTimeSlotClick = (day: Date, hour: number, minute = 0) => {
    // currentUserが存在し、employeeNumberが設定されていることを確認
    if (!currentUser || !currentUser.employeeNumber) {
      console.error("ユーザー情報が正しく設定されていません");
      alert("ユーザー情報が正しく設定されていません。ログインし直してください。");
      return;
    }

    const newEvent = createNewEvent({
      day,
      hour,
      minute,
      employeeNumber: currentUser.employeeNumber,
      selectedTab,
      selectedProjectSubTab,
      projects,
    })

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    setSelectedEvent(newEvent)

    // 変更をローカルストレージに保存
    saveWeekDataToStorage(year, week, updatedEvents)
    setWeekDataChanged(year, week, true)
  }

  // ドラッグ開始時の処理
  const handleDragStart = (event: any) => {
    const { active } = event
    const draggedEvent = active.data.current.event
    const dragHandleOffset = active.data.current.dragHandleOffset || 16 // 15分の高さ = 16px

    // ドラッグハンドルのオフセット情報を含めてアクティブイベントを設定
    setActiveEvent({
      ...draggedEvent,
      dragHandleOffset,
    })
  }

  // ドラッグ終了時の処理
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveEvent(null)

    if (!over) return

    const draggedEvent = active.data.current.event
    const { day, hour, minute = 0 } = over.data.current
    const dragHandleOffset = active.data.current.dragHandleOffset || FIFTEEN_MIN_HEIGHT

    // 元のイベントの時間情報を取得
    const originalStart = parseDateTime(draggedEvent.startDateTime)
    const originalEnd = parseDateTime(draggedEvent.endDateTime)
    const duration = (originalEnd.getTime() - originalStart.getTime()) / 60000 // 分単位の期間

    // 新しい開始時間を設定（ドラッグハンドルのオフセットを考慮）
    const newStart = new Date(day)
    newStart.setHours(hour)
    newStart.setMinutes(minute)

    // ドラッグハンドルのオフセットを考慮して時間を調整
    // ドロップ先情報から新しい開始日時をそのまま設定
    // ドロップ先（日付、hour, minute）を基準とするので補正は不要
    newStart.setHours(hour)
    newStart.setMinutes(minute)
    newStart.setSeconds(0)
    newStart.setMilliseconds(0)

    // 新しい終了時間を計算（期間を維持）
    const newEnd = new Date(newStart)
    newEnd.setMinutes(newStart.getMinutes() + duration)
    // 日時を正しくフォーマット
    const startDateTimeStr = formatDateTimeForStorage(newStart)
    const endDateTimeStr = formatDateTimeForStorage(newEnd)

    // Ctrlキーが押されている場合はコピー、そうでなければ移動
    if (isCtrlPressed) {
      // 新しいIDを生成
      const year = newStart.getFullYear()
      const month = (newStart.getMonth() + 1).toString().padStart(2, "0")
      const day_str = newStart.getDate().toString().padStart(2, "0")
      const hours = newStart.getHours().toString().padStart(2, "0")
      const minutes = newStart.getMinutes().toString().padStart(2, "0")
      const newId = `${draggedEvent.employeeNumber}_${year}${month}${day_str}${hours}${minutes}`

      // コピーしたイベントを作成
      const copiedEvent = {
        ...draggedEvent,
        id: newId,
        keyID: newId, // keyIDも設定
        startDateTime: startDateTimeStr,
        endDateTime: endDateTimeStr,
        top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64, // 上端位置を計算（0時基準）
        unsaved: true,
      }

      // イベントリストに追加
      const updatedEvents = [...events, copiedEvent]
      setEvents(updatedEvents)

      // 変更をローカルストレージに保存
      saveWeekDataToStorage(year, week, updatedEvents)
      setWeekDataChanged(year, week, true)
    } else {
      // 通常の移動処理
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return {
            ...e,
            startDateTime: startDateTimeStr,
            endDateTime: endDateTimeStr,
            top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64, // 上端位置を計算（0時基準）
            unsaved: true, // 未保存フラグを設定
          }
        }
        return e
      })

      setEvents(updatedEvents)

      // 変更をローカルストレージに保存
      saveWeekDataToStorage(year, week, updatedEvents)
      setWeekDataChanged(year, week, true)

      // 選択中のイベントも更新
      if (selectedEvent && selectedEvent.id === draggedEvent.id) {
        setSelectedEvent({
          ...selectedEvent,
          startDateTime: startDateTimeStr,
          endDateTime: endDateTimeStr,
          top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64, // 上端位置を計算（0時基準）
          unsaved: true,
        })
      }
    }
  }

  // イベントの更新
  const updateEvent = (updatedEvent: any) => {
    // プロジェクトが変更された場合、色も更新
    let updatedColor = updatedEvent.color

    if (updatedEvent.project && updatedEvent.project !== selectedEvent?.project) {
      // プロジェクトコードの最後の数字に基づいて色を割り当て
      const lastDigit = updatedEvent.project.slice(-1)

      const projectColors: Record<string, string> = {
        "0": "#3788d8", // 青
        "1": "#43a047", // 緑
        "2": "#8e24aa", // 紫
        "3": "#e67c73", // 赤
        "4": "#f6bf26", // 黄
        "5": "#0097a7", // シアン
        "6": "#ff9800", // オレンジ
        "7": "#795548", // 茶
        "8": "#607d8b", // 青灰
        "9": "#d81b60", // ピンク
      }

      updatedColor = lastDigit ? (projectColors[lastDigit] || "#3788d8") : "#3788d8"
    }

    const updatedEvents = events.map((e) => {
      if (e.id === updatedEvent.id) {
        return { ...updatedEvent, color: updatedColor, unsaved: true }
      }
      return e
    })

    setEvents(updatedEvents)
    setSelectedEvent({ ...updatedEvent, color: updatedColor })

    // 変更をローカルストレージに保存
    saveWeekDataToStorage(year, week, updatedEvents)

    // 明示的に変更フラグを設定
    console.log(`イベント更新: 変更フラグを設定します (${year}年第${week}週)`)
    setWeekDataChanged(year, week, true)
  }

  // イベントの削除
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      if (confirm("このイベントを削除してもよろしいですか？")) {
        if (hasWeekDataChanged(year, week)) {
          try {
            await saveWeekAchievements(year, week, events);
          } catch (error) {
            if (!confirm("変更の保存に失敗しました。それでも削除を続けますか？")) {
              return;
            }
          }
        }

        if (!selectedEvent.id.startsWith("new-")) {
          await deleteAchievement(selectedEvent.id)
        }

        const updatedEvents = events.filter((e) => e.id !== selectedEvent.id)
        setEvents(updatedEvents)
        setSelectedEvent(null)

        saveWeekDataToStorage(year, week, updatedEvents)
        setWeekDataChanged(year, week, true)

        alert("イベントが削除されました")
      }
    } catch (error: unknown) {
      alert(`削除エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // カスタムイベントリスナーを追加
  useEffect(() => {
    // 更新ボタンのイベントリスナー
    const handleRefresh = () => {
      loadWeekData(true)
    }

    // 保存ボタンのイベントリスナー
    const handleSave = () => {
      handleSaveWeekData()
    }

    // イベントリスナーを登録
    window.addEventListener("week-refresh", handleRefresh)
    window.addEventListener("week-save", handleSave)

    // クリーンアップ
    return () => {
      window.removeEventListener("week-refresh", handleRefresh)
      window.removeEventListener("week-save", handleSave)
    }
  }, [events, year, week])

  // saveMessageをカスタムイベントで親コンポーネントに渡す
  useEffect(() => {
    if (saveMessage) {
      // カスタムイベントを発行して親コンポーネントに通知
      window.dispatchEvent(
        new CustomEvent("week-save-message", {
          detail: saveMessage,
        }),
      )
    }
  }, [saveMessage])

  // ページが読み込まれたら、勤務時間データを読み込む
  useEffect(() => {
    if (!loading && currentUser && currentUser.employeeNumber) {
      initializeWorkTimes();
        }
  }, [loading, currentUser?.employeeNumber]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* APIエラーメッセージ */}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">APIエラーが発生しました</p>
              <p className="text-sm">{apiError}</p>
              <p className="text-sm mt-2">
                ローカルキャッシュからデータを表示しています。最新のデータではない可能性があります。
              </p>
            </div>
          )}

          <div className="flex">
            {/* 週表示のメインエリア */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <TimeGrid
                weekDays={weekDays}
                timeSlots={timeSlots}
                minuteSlots={minuteSlots}
                isToday={isToday}
                events={events}
                handleTimeSlotClick={handleTimeSlotClick}
                handleEventClick={handleEventClick}
                handleResizeStart={handleResizeStart}
                workTimes={workTimes}
                onWorkTimeChange={handleWorkTimeChange}
              />

              {/* ドラッグ中のオーバーレイ */}
              <DragOverlay
                modifiers={[restrictToWindowEdges]}
                dropAnimation={customDropAnimation}
                zIndex={1000}
                adjustScale={false}
              >
                {activeEvent ? <EventDragOverlay event={activeEvent} /> : null}
              </DragOverlay>
            </DndContext>

            {/* 右サイドバーコンポーネント */}
            <WeekSidebar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              selectedProjectSubTab={selectedProjectSubTab}
              setSelectedProjectSubTab={setSelectedProjectSubTab}
              selectedEvent={selectedEvent}
              hasChanges={hasChanges}
              handleDeleteEvent={handleDeleteEvent}
              updateEvent={updateEvent}
              employees={employees}
              projects={projects}
              setSelectedEvent={setSelectedEvent}
              currentUser={currentUser}
              indirectSubTab={indirectSubTab}
              setIndirectSubTab={setIndirectSubTab}
            />
          </div>
        </div>
      )}
    </div>
  )
}
