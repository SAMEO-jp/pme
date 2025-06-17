import TabM_Management from "../../components/TabM_Management/page"
import { MainTabHeader } from "../../components/x.TabHeader/MainTabHeader"

export default function MainManagementPage() {
  return (
    <>
      <MainTabHeader currentTab="main/main_management" />
      <TabM_Management />
    </>
  )
} 