import TabM_Settings from "../../components/TabM_Settings/page"
import MainTabHeader from "../../components/x.TabHeader/MainTabHeader"

export default function MainSettingsPage() {
  return (
    <>
      <MainTabHeader currentTab="main/main_settings" />
      <TabM_Settings />
    </>
  )
} 