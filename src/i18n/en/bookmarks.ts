// Bookmark tree: rows, context menus, toasts, move dialogs and empty states
export const bookmarks = {
  // Folder chevron (TreeRow, shared by every tree)
  expand: 'Expand',
  collapse: 'Collapse',

  // Bookmark row hover buttons
  rowActions: {
    driftHint: 'Click to go back to the bookmarked URL',
    pin: 'Pin',
    pinBookmark: 'Pin bookmark',
    openTab: 'Open tab',
    closeTab: 'Close tab',
  },

  // Bookmark and folder context menus
  contextMenu: {
    pinToSidebar: 'Pin to Sidebar',
    openInNewTabs: 'Open in New Tabs',
    moveBookmarks: 'Move Bookmarks...',
    moveBookmarksToSpace: 'Move Bookmarks to Space...',
    closeBookmarks: (count: number) => `Close ${count} Bookmarks`,
    deleteBookmarks: (count: number) => `Delete ${count} Bookmarks`,
    newFolder: 'New Folder',
    newBookmark: 'New Bookmark',
    expandAll: 'Expand All',
    sortByName: 'Sort by Name',
    sortByDate: 'Sort by Date',
    openAllTabs: 'Open All Tabs',
    openAllTabsInNewWindow: 'Open All Tabs in New Window',
    openAsTabGroup: 'Open as Tab Group',
    moveFolder: 'Move Folder...',
    moveFolderToSpace: 'Move Folder to Space...',
    moveBookmark: 'Move Bookmark...',
    moveBookmarkToSpace: 'Move Bookmark to Space...',
    moveToTabs: 'Move To Tabs',
    backToBookmarkedUrl: 'Back to Bookmarked URL',
    replaceBookmarkedUrlWithCurrent: 'Replace Bookmarked URL with Current',
    closeTab: 'Close Tab',
    closeTabAndDelete: 'Close Tab and Delete',
  },

  // Toasts after opening or moving bookmarks
  toast: {
    noBookmarksInFolder: 'No bookmarks found in folder',
    openedTabsAsGroup: (count: number, folderName: string) => `Opened ${count} tabs as "${folderName}"`,
    openedTabs: (count: number) => `Opened ${count} tabs`,
    openedTabsInNewWindow: (count: number) => `Opened ${count} tabs in new window`,
    movedSelectionToSpace: (spaceName: string) => `Moved selection to ${spaceName}`,
    movedToSpace: (spaceName: string, folderPath: string) => `Moved to ${spaceName}. New location: ${folderPath}`,
  },

  // Errors shown in the Move to Space dialog
  moveToSpaceError: {
    spaceFallbackName: 'Space',
    noBookmarkFolder: (spaceName: string) => `"${spaceName}" has no bookmark folder configured`,
    folderMissing: (folderPath: string) => `Folder "${folderPath}" no longer exists`,
    noBookmarkSelected: 'No bookmark selected',
    unknownError: 'Unknown error',
    moveFailed: (message: string) => `Failed to move bookmark: ${message}`,
  },

  // Active Space's bookmark folder is gone
  spaceFolderNotFound: (folderPath: string) => `Folder "${folderPath}" not found. `,
  pickNewFolder: 'Pick new folder',
  selectBookmarkFolder: 'Select Bookmark Folder',

  // Empty filter results
  noBookmarksMatch: (filterText: string) => `No bookmarks match "${filterText}"`,
  noLoadedTabs: 'No loaded tabs found',

  // Move dialog titles
  dialogTitle: {
    moveBookmarksToSpace: 'Move Bookmarks to Space',
    moveFolderToSpace: 'Move Folder to Space',
    moveBookmarkToSpace: 'Move Bookmark to Space',
    moveFolderTo: 'Move Folder to...',
    moveBookmarkTo: 'Move Bookmark to...',
    moveTo: 'Move to...',
  },
};
