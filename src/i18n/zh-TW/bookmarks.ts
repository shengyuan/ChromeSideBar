import type { bookmarks as en } from '../en/bookmarks';

export const bookmarks: typeof en = {
  // Folder chevron (TreeRow, shared by every tree)
  expand: '展開',
  collapse: '收合',

  // Bookmark row hover buttons
  rowActions: {
    driftHint: '按一下即可回到書籤網址',
    pin: '釘選',
    pinBookmark: '釘選書籤',
    openTab: '開啟分頁',
    closeTab: '關閉分頁',
  },

  // Bookmark and folder context menus
  contextMenu: {
    pinToSidebar: '釘選到側邊欄',
    openInNewTabs: '在新分頁中開啟',
    moveBookmarks: '移動書籤…',
    moveBookmarksToSpace: '將書籤移到空間…',
    closeBookmarks: (count) => `關閉 ${count} 個書籤`,
    deleteBookmarks: (count) => `刪除 ${count} 個書籤`,
    newFolder: '新增資料夾',
    newBookmark: '新增書籤',
    expandAll: '全部展開',
    sortByName: '依名稱排序',
    sortByDate: '依日期排序',
    openAllTabs: '開啟所有分頁',
    openAllTabsInNewWindow: '在新視窗中開啟所有分頁',
    openAsTabGroup: '以分頁群組開啟',
    moveFolder: '移動資料夾…',
    moveFolderToSpace: '將資料夾移到空間…',
    moveBookmark: '移動書籤…',
    moveBookmarkToSpace: '將書籤移到空間…',
    moveToTabs: '移到分頁區',
    backToBookmarkedUrl: '回到書籤網址',
    replaceBookmarkedUrlWithCurrent: '以目前網址取代書籤網址',
    closeTab: '關閉分頁',
    closeTabAndDelete: '關閉分頁並刪除',
  },

  // Toasts after opening or moving bookmarks
  toast: {
    noBookmarksInFolder: '資料夾中沒有書籤',
    openedTabsAsGroup: (count, folderName) => `已在群組「${folderName}」中開啟 ${count} 個分頁`,
    openedTabs: (count) => `已開啟 ${count} 個分頁`,
    openedTabsInNewWindow: (count) => `已在新視窗中開啟 ${count} 個分頁`,
    movedSelectionToSpace: (spaceName) => `已將所選項目移到「${spaceName}」`,
    movedToSpace: (spaceName, folderPath) => `已移到「${spaceName}」。新位置：${folderPath}`,
  },

  // Errors shown in the Move to Space dialog
  moveToSpaceError: {
    spaceFallbackName: '空間',
    noBookmarkFolder: (spaceName) => `「${spaceName}」尚未設定書籤資料夾`,
    folderMissing: (folderPath) => `資料夾「${folderPath}」已不存在`,
    noBookmarkSelected: '未選取書籤',
    unknownError: '未知的錯誤',
    moveFailed: (message) => `無法移動書籤：${message}`,
  },

  // Active Space's bookmark folder is gone
  spaceFolderNotFound: (folderPath) => `找不到資料夾「${folderPath}」。`,
  pickNewFolder: '選擇新資料夾',
  selectBookmarkFolder: '選擇書籤資料夾',

  // Empty filter results
  noBookmarksMatch: (filterText) => `沒有符合「${filterText}」的書籤`,
  noLoadedTabs: '沒有已開啟的分頁',

  // Move dialog titles
  dialogTitle: {
    moveBookmarksToSpace: '將書籤移到空間',
    moveFolderToSpace: '將資料夾移到空間',
    moveBookmarkToSpace: '將書籤移到空間',
    moveFolderTo: '將資料夾移到…',
    moveBookmarkTo: '將書籤移到…',
    moveTo: '移到…',
  },
};
