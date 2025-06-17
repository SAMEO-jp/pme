// サイト全体で使う名称やラベルの定義

export const SITE_TITLE = "設計業務システム"
export const SYSTEM_FILE_MANAGEMENT = "ファイル管理システム"
export const SYSTEM_DATA_MANAGEMENT = "データ管理システム"
export const SYSTEM_DATABASE_VIEW = "データベース閲覧"

export const TITLE_STYLE = "text-2xl font-bold"
export const TITLE_GRAY_STYLE = "text-gray-700 text-xl font-bold"
export const TITLE_WHITE_STYLE = "text-white text-xl font-bold"

export const HEADER_BG_GRADIENT = "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
export const HEADER_TEXT_WHITE = "text-white hover:text-gray-100";
export const HEADER_GRID = "w-full px-0 py-4 grid grid-cols-[auto,1fr,auto]";
export const HEADER_RIGHT = "flex items-center justify-end gap-3 pr-6";

export const isFileManagementPage = (pathname: string) => pathname.startsWith("/file-management")
export const isZDataManagementPage = (pathname: string) => pathname.startsWith("/z_datamanagement")

export const getHeaderBgClass = (pathname: string) => {
  if (isFileManagementPage(pathname)) return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white';
  if (isZDataManagementPage(pathname)) return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white';
  return 'bg-white';
};

export const getLinkTextColorClass = (pathname: string) => {
  if (isFileManagementPage(pathname)) return 'text-white hover:text-gray-100';
  if (isZDataManagementPage(pathname)) return 'text-white hover:text-gray-100';
  return 'text-red-600 hover:text-red-700';
};

// ページごとのタイトル表示ルール
export const PAGE_TITLE_RULES = [
  {
    condition: (pathname: string, zDataManagement?: boolean, fileManagement?: boolean) => zDataManagement === true,
    title: SYSTEM_DATA_MANAGEMENT,
    style: TITLE_WHITE_STYLE
  },
  {
    condition: (pathname: string, zDataManagement?: boolean, fileManagement?: boolean) => pathname.startsWith("/dtamp"),
    title: SYSTEM_DATA_MANAGEMENT,
    style: TITLE_WHITE_STYLE
  },
  {
    condition: (pathname: string, zDataManagement?: boolean, fileManagement?: boolean) => pathname.startsWith("/database_control/view_database"),
    title: SYSTEM_DATABASE_VIEW,
    style: TITLE_GRAY_STYLE
  },
  {
    condition: (pathname: string, zDataManagement?: boolean, fileManagement?: boolean) => fileManagement === true,
    title: SYSTEM_FILE_MANAGEMENT,
    style: TITLE_WHITE_STYLE
  }
] as const; 