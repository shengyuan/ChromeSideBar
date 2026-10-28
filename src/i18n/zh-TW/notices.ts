import type { notices as en } from '../en/notices';

export const notices: typeof en = {
  driftTooltip: {
    nowLine: (title) => `目前：${title}`,
    pinGoBackHint: '按兩下返回原網址',
    bookmarkGoBackHint: '按一下圖示返回原網址',
  },

  removedFromGroup: '已移出群組',
  movedToSpace: (name) => `已移至「${name}」`,
  spaceNotFound: '找不到空間',

  unknownError: '未知的錯誤',

  bookmarksUnavailable: '無法存取瀏覽器書籤',
  tabsUnavailable: '無法存取瀏覽器分頁',
  operationFailed: (operation) => `操作失敗（${operation}）`,

  iconsOffline: '目前似乎沒有網路連線',
  iconsLoadFailed: '無法載入圖示',

  rootFolderNames: {
    bookmarksBar: '書籤列',
    other: '其他書籤',
    mobile: '行動裝置書籤',
  },
  rootFolderNotFound: (folderName) => `找不到「${folderName}」資料夾`,
  importTargetFolderNotFound: '找不到「其他書籤」資料夾，無法匯入',
  arcImport: {
    existingBookmarksNotModified: '現有的書籤沒有變更',
    spaceFolderRecreated: (spaceName) => `找不到「${spaceName}」的資料夾，已建立新的資料夾`,
  },
};
