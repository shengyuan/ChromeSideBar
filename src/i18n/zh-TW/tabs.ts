import type { tabs as en } from '../en/tabs';

export const tabs: typeof en = {
  // Section header
  sectionLabel: '分頁',
  sectionMenuTitle: '分頁選項',

  // Tab row hover buttons
  pin: '釘選',
  pinTabAriaLabel: '釘選分頁',
  closeTabAriaLabel: '關閉分頁',

  newTab: '新分頁',
  unnamedGroup: '未命名群組',

  // Tab and group context menus
  contextMenu: {
    pinToSidebar: '釘選到側邊欄',
    addToBookmark: '加入書籤…',
    moveTabToSpace: '將分頁移到空間…',
    moveTabsToSpace: '將分頁移到空間…',
    moveToNewWindow: '移到新視窗',
    closeCountTabs: (count) => `關閉 ${count} 個分頁`,
    addToGroup: '加入群組',
    closeTabsBefore: '關閉上方的分頁',
    closeTabsAfter: '關閉下方的分頁',
    closeOtherTabs: '關閉其他分頁',
    saveToBookmarks: '儲存到書籤',
    sortByDomainAsc: '依網域排序（A-Z）',
    sortByDomainDesc: '依網域排序（Z-A）',
    renameGroup: '重新命名群組',
    changeColor: '變更顏色',
    closeTabsInGroup: '關閉群組中的分頁',
    groupsBeforeUngrouped: '群組排在未分組的分頁之前',
    groupsAfterUngrouped: '群組排在未分組的分頁之後',
    chromeNativeOrder: 'Chrome 原生順序',
    closeTabs: '關閉分頁',
  },

  // Toasts
  toast: {
    noBookmarkableTabs: '沒有可匯出成書籤的分頁',
    folderCreated: (folderPath) => `已建立書籤資料夾「${folderPath}」`,
    folderUpdated: (folderPath) => `已更新書籤資料夾「${folderPath}」`,
    addedNewBookmarks: (count, folderPath) => `已將 ${count} 個新書籤加入「${folderPath}」`,
    allTabsAlreadyInFolder: '所有分頁都已在資料夾中',
    tabCreatedFromDrop: '已從拖曳的連結建立分頁',
    addedToBookmarks: '已加入書籤',
    groupsSavedToBookmarks: '已將群組儲存到書籤',
  },

  // Dialog titles and details
  dialog: {
    moveTabToSpace: '將分頁移到空間',
    moveTabsToSpace: '將分頁移到空間',
    selectDestinationFolder: '選擇目的資料夾',
    addTabToBookmarkFolder: '將分頁加入書籤資料夾',
    addToBookmarkFolder: '加入書籤資料夾',
    saveGroupsToBookmarkFolder: '將群組儲存到書籤資料夾',
    closeAllWillCloseWindow: '這會關閉視窗。',
  },
};
