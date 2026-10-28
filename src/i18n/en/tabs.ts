// Tab list: rows, group headers, context menus, toasts and dialogs; see docs/features/completed/034-i18n-language-switch.md
export const tabs = {
  // Section header
  sectionLabel: 'Tabs',
  sectionMenuTitle: 'Tab options',

  // Tab row hover buttons
  pin: 'Pin',
  pinTabAriaLabel: 'Pin tab',
  closeTabAriaLabel: 'Close tab',

  newTab: 'New Tab',
  unnamedGroup: 'Unnamed Group',

  // Tab and group context menus
  contextMenu: {
    pinToSidebar: 'Pin to Sidebar',
    addToBookmark: 'Add to Bookmark...',
    moveTabToSpace: 'Move Tab to Space...',
    moveTabsToSpace: 'Move Tabs to Space...',
    moveToNewWindow: 'Move to New Window',
    closeCountTabs: (count: number) => `Close ${count} Tabs`,
    addToGroup: 'Add to Group',
    closeTabsBefore: 'Close Tabs Before',
    closeTabsAfter: 'Close Tabs After',
    closeOtherTabs: 'Close Other Tabs',
    saveToBookmarks: 'Save to Bookmarks',
    sortByDomainAsc: 'Sort by Domain (A-Z)',
    sortByDomainDesc: 'Sort by Domain (Z-A)',
    renameGroup: 'Rename Group',
    changeColor: 'Change Color',
    closeTabsInGroup: 'Close Tabs in Group',
    groupsBeforeUngrouped: 'Groups before ungrouped tabs',
    groupsAfterUngrouped: 'Groups after ungrouped tabs',
    chromeNativeOrder: "Chrome's native order",
    closeTabs: 'Close Tabs',
  },

  // Toasts
  toast: {
    noBookmarkableTabs: 'No bookmarkable tabs to export',
    folderCreated: (folderPath: string) => `Bookmark folder "${folderPath}" is created`,
    folderUpdated: (folderPath: string) => `Bookmark folder "${folderPath}" is updated`,
    addedNewBookmarks: (count: number, folderPath: string) => `Added ${count} new bookmarks to "${folderPath}"`,
    allTabsAlreadyInFolder: 'All tabs already exist in folder',
    tabCreatedFromDrop: 'Tab created from dropped link',
    addedToBookmarks: 'Added to bookmarks',
    groupsSavedToBookmarks: 'Groups saved to bookmarks',
  },

  // Dialog titles and details
  dialog: {
    moveTabToSpace: 'Move Tab to Space',
    moveTabsToSpace: 'Move Tabs to Space',
    selectDestinationFolder: 'Select Destination Folder',
    addTabToBookmarkFolder: 'Add Tab to Bookmark Folder',
    addToBookmarkFolder: 'Add to Bookmark Folder',
    saveGroupsToBookmarkFolder: 'Save Groups to Bookmark Folder',
    closeAllWillCloseWindow: 'This will close the window.',
  },
};
