import type { importExport as en } from '../en/importExport';

export const importExport: typeof en = {
  // Shared by the backup and Arc import dialogs
  importing: '匯入中…',
  importComplete: '匯入完成',
  importFailed: '匯入失敗，請再試一次。',
  successfullyImported: '已成功匯入：',
  showDetails: '顯示詳細資訊',
  appendToExisting: '附加到現有項目',
  replaceExisting: '取代現有項目',
  replaceAllSpaces: '取代所有空間',

  // Imported / found item counts
  pinnedSitesCount: (count) => `${count} 個釘選網站`,
  bookmarksCount: (count) => `${count} 個書籤`,
  tabsAndGroupsCount: (count) => `${count} 個分頁和群組`,
  spacesCount: (count) => `${count} 個空間`,

  // Data type checkboxes (backup export and import)
  pinnedSitesWithCount: (count) => `釘選網站（${count}）`,
  bookmarks: '書籤',
  tabsAndGroups: '分頁和群組',
  tabsAndGroupsWithCount: (count) => `分頁和群組（${count}）`,
  spacesWithCount: (count) => `空間（${count}）`,

  backupExport: {
    exporting: '匯出中…',
    failed: '匯出失敗，請再試一次。',
  },

  backupImport: {
    title: '匯入備份',
    fileTooLarge: '備份檔案太大（上限 10MB）',
    invalidFormat: '備份檔案格式無效',
    noData: '備份檔案中沒有資料',
    parseFailed: '無法解析備份檔案',
    exportedOn: (date) => `匯出日期：${date}`,
    selectData: '選擇要匯入的資料：',
    replaceExistingPinnedSites: '取代現有的釘選網站',
    replaceAllTabs: '取代所有分頁',
    replaceAllBookmarks: '取代所有書籤',
    importToOtherBookmarks: '匯入到「其他書籤」',
    importToOtherBookmarksHint: '會建立一個子資料夾存放匯入的書籤',
  },

  exportConflict: {
    title: '資料夾已存在',
    message: (folderName) => `已經有名為「${folderName}」的書籤資料夾。要如何處理？`,
    overwrite: '覆寫（取代所有書籤）',
    merge: '合併（只新增缺少的書籤）',
  },

  arcImport: {
    title: '從 Arc 瀏覽器匯入',
    intro: '將 Arc 瀏覽器的側邊欄匯入 Chrome，包含 Top Apps、空間和書籤。',
    // fileName is the rendered "StorableSidebar.json" element
    selectFileFrom: (fileName) => <>請從下列位置選擇 Arc 的 {fileName} 檔案：</>,
    copyPath: '複製路徑',
    pathTip: '提示：在檔案選擇視窗中按 Cmd+Shift+G 可前往指定路徑',
    selectFile: '選擇檔案…',
    fileTooLarge: '檔案太大（上限 10MB）',
    invalidFile: '不是有效的 Arc StorableSidebar.json 檔案',
    noData: '檔案中找不到可匯入的資料',
    parseFailed: '無法解析 Arc 側邊欄檔案',

    // Preview summary
    found: '找到：',
    foundTopApps: (count) => `${count} 個 Top Apps`,
    foundSpaces: (count) => `${count} 個空間`,
    foundPinnedItems: (count) => `${count} 個釘選的分頁／資料夾`,
    foundUnpinnedTabs: (count) => `${count} 個未釘選的分頁`,
    foundSkipped: (count) => `略過 ${count} 個（Live Folders）`,

    // Import options
    topAppsAsPinnedSites: '將 Top Apps 匯入為釘選網站',
    spacesAndBookmarks: '空間與書籤',
    openUnpinnedTabs: '在 Chrome 中開啟未釘選的分頁',
    openUnpinnedTabsHint: '會依各空間名稱建立分頁群組',

    // Result
    mergedWithExisting: (count) => `（其中 ${count} 個與現有空間合併）`,
    tabsOpened: (count) => `已開啟 ${count} 個分頁`,
  },
};
