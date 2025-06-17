import TabM_MyPage from "../../components/TabM_MyPage/page"
import MainTabHeader from "../../components/x.TabHeader/MainTabHeader"

export default function MainMyPagePage() {
  return (
    <>
      <MainTabHeader currentTab="main/main_mypage" />
      <TabM_MyPage />
    </>
  )
} 