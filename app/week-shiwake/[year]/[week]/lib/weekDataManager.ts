import { saveWeekAchievements, setWeekDataChanged, hasWeekDataChanged } from '../imports'

interface WeekDataManagerProps {
  year: number
  week: number
  events: any[]
  workTimes: any[]
  saveWorkTimes: () => Promise<boolean>
  loadWeekData: (forceRefresh: boolean) => Promise<void>
  loadWorkTimesFromDb: () => Promise<void>
  setSaveMessage: (message: { type: string; text: string } | null) => void
  setIsSaving: (isSaving: boolean) => void
}

export const saveWeekData = async ({
  year,
  week,
  events,
  workTimes,
  saveWorkTimes,
  loadWeekData,
  loadWorkTimesFromDb,
  setSaveMessage,
  setIsSaving
}: WeekDataManagerProps): Promise<void> => {
  const hasWorkTimeChanges = workTimes.some(wt => wt.startTime || wt.endTime)
  
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
      const saved = await saveWorkTimes()
      if (!saved) {
        throw new Error("勤務時間データの保存に失敗しました")
      }
    }
    
    setSaveMessage({ type: "success", text: "週データが正常に保存されました" })
    setTimeout(() => setSaveMessage(null), 5000)

    await loadWeekData(true)
    await loadWorkTimesFromDb()
    
    setWeekDataChanged(year, week, false)
  } catch (error: unknown) {
    setSaveMessage({ 
      type: "error", 
      text: `保存エラー: ${error instanceof Error ? error.message : String(error)}` 
    })
    setTimeout(() => setSaveMessage(null), 5000)
  } finally {
    setIsSaving(false)
  }
} 