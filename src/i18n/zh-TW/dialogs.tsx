import type { dialogs as en } from '../en/dialogs';

export const dialogs: typeof en = {
  closeDialog: '關閉對話框',

  // Bookmark edit / create dialogs
  newBookmark: '新增書籤',
  editBookmark: '編輯書籤',
  editFolder: '編輯資料夾',
  newFolder: '新增資料夾',
  folderName: '資料夾名稱',
  enterFolderName: '輸入資料夾名稱',

  // Folder picker
  newFolderNamePlaceholder: '新資料夾名稱',
  selectFolder: '選擇',

  // Tab group dialogs
  addToGroup: '加入群組',
  createNewGroup: '建立新群組',
  renameGroup: '重新命名群組',
  changeGroupColor: '變更群組顏色',
  groupName: '群組名稱',
  enterGroupName: '輸入群組名稱',
  unnamedGroup: '未命名群組',
  selectColor: '選擇顏色',
  // color is one of groupColorNames
  selectColorLabel: (color) => `選擇${color}`,
  // Display names for Chrome's tab group color ids (the ids themselves stay English)
  groupColorNames: {
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

  // Close tabs / delete bookmarks confirmation; countNode is the rendered (bold) count
  confirmDelete: {
    closeTabsTitle: (count) => `關閉 ${count} 個分頁`,
    deleteBookmarksTitle: (count) => `刪除 ${count} 個書籤`,
    closeTabsQuestion: (countNode) => <>確定要關閉 {countNode} 個分頁嗎？</>,
    deleteBookmarksQuestion: (countNode) => <>確定要刪除 {countNode} 個書籤嗎？</>,
    cannotBeUndone: '這個動作無法復原。',
  },
};
