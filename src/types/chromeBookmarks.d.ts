// chrome.bookmarks fields added in Chrome 134 that the installed @types/chrome
// predates. See src/utils/bookmarkRoots.ts for how they are used.
declare namespace chrome.bookmarks
{
  export interface BookmarkTreeNode
  {
    /** Set on folders the browser owns (top-level folders). Chrome 134+. */
    folderType?: 'bookmarks-bar' | 'other' | 'mobile' | 'managed';
    /** True when the node is stored in the user's Google account. Chrome 134+. */
    syncing?: boolean;
  }
}
