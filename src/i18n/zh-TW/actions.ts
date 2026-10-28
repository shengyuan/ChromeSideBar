import type { actions as en } from '../en/actions';

export const actions: typeof en = {
  // CloseTabAction
  closedTab: (title) => `已關閉「${title}」`,
  closedTabs: (count) => `已關閉 ${count} 個分頁`,

  // DeleteBookmarkAction
  deletedBookmark: (title) => `已刪除「${title}」`,
  deletedBookmarks: (count) => `已刪除 ${count} 個書籤`,
  untitledBookmark: '書籤',

  // DeletePinnedSiteAction
  unpinnedSite: (title) => `已取消釘選「${title}」`,
  unpinnedSites: (count) => `已取消釘選 ${count} 個網站`,

  // DeleteSpaceAction
  deletedSpace: (name) => `已刪除空間「${name}」`,
  spaceNotFound: (spaceId) => `找不到空間「${spaceId}」`,
};
