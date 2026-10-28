import type { spaces as en } from '../en/spaces';

export const spaces: typeof en = {
  allSpaceName: '全部',
  allSpaceBadge: '全部',

  spaceBarLabel: '空間',
  createNewSpace: '建立新空間',
  closeWindowWarning: '這會關閉視窗。',

  closeAllTabs: '關閉所有分頁',
  closeAllTabsInSpace: '關閉空間內的所有分頁',

  navigateToSpace: '前往空間',
  navigatorWindowTitle: '空間導覽',
  searchSpacesPlaceholder: '搜尋空間…',
  noMatches: '沒有符合的項目',
  noSpacesAvailable: '沒有可用的空間',
  noFolder: '無資料夾',
  current: '目前',
  noBookmarkFolderConfigured: (spaceName) => `「${spaceName}」尚未設定書籤資料夾`,

  editDialog: {
    createTitle: '建立空間',
    editTitle: '編輯空間',
    namePlaceholder: '輸入空間名稱',
    nameRequired: '請輸入名稱',
    duplicateName: '已有同名的空間',
    otherBookmarksNotFound: '找不到「其他書籤」資料夾',
    folderNoLongerExists: '選取的資料夾已不存在',
    otherBookmarksFallback: '其他書籤',
    folderNamePlaceholder: '{名稱}',
    bookmarkFolder: '書籤資料夾',
    bookmarkFolderHelp: '在這個空間儲存的書籤會存放在這個資料夾。',
    folderWillBeCreated: '儲存時會建立這個資料夾',
    pickExistingFolder: '選擇現有資料夾',
    selectBookmarkFolder: '選擇書籤資料夾',
  },

  colorNames: {
    grey: '灰色',
    blue: '藍色',
    red: '紅色',
    yellow: '黃色',
    green: '綠色',
    pink: '粉紅色',
    purple: '紫色',
    cyan: '青色',
    orange: '橘色',
  },

  deleteDialog: {
    title: '刪除空間',
    confirm: (spaceName) => <>確定要刪除<strong>「{spaceName}」</strong>嗎？</>,
    details: '書籤不會被刪除，但這個空間中的分頁會關閉。',
  },
};
