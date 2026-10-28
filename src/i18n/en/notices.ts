// Text produced outside components (utils, hooks, contexts) that reaches the UI:
// tooltips, toasts and error messages
export const notices = {
  // Tooltip of a pinned site / bookmark whose tab navigated away (src/utils/driftTooltip.ts)
  driftTooltip: {
    nowLine: (title: string) => `Now: ${title}`,
    pinGoBackHint: 'Double-click to go back',
    bookmarkGoBackHint: 'Click icon to go back',
  },

  // Moving a tab to a Space (src/utils/tabOperations.ts)
  removedFromGroup: 'Removed from group',
  movedToSpace: (name: string) => `Moved to ${name}`,
  spaceNotFound: 'Space not found',

  unknownError: 'Unknown error',

  // Errors shown above the bookmark tree / tab list (src/hooks/useBookmarks.ts, useTabs.ts)
  bookmarksUnavailable: 'Unable to access browser bookmarks',
  tabsUnavailable: 'Unable to access browser tabs',
  // Fallback when Chrome reports an error without a message; operation is an internal name, e.g. "create folder"
  operationFailed: (operation: string) => `Failed to ${operation}`,

  // Icon picker (src/utils/iconify.ts)
  iconsOffline: 'You appear to be offline',
  iconsLoadFailed: 'Failed to load icons',

  // Import errors and notes (src/utils/bookmarkRoots.ts, backupRestore.ts, arcImport.ts)
  rootFolderNames: {
    bookmarksBar: 'Bookmarks Bar',
    other: 'Other Bookmarks',
    mobile: 'Mobile Bookmarks',
  },
  rootFolderNotFound: (folderName: string) => `Cannot find the "${folderName}" folder`,
  importTargetFolderNotFound: 'Cannot find the "Other Bookmarks" folder to import into',
  arcImport: {
    existingBookmarksNotModified: 'Existing bookmarks were not modified',
    spaceFolderRecreated: (spaceName: string) => `Folder for "${spaceName}" not found, created new one`,
  },
};
