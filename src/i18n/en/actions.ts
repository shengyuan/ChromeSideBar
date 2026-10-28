// Undo descriptions of the UndoableActions in src/actions/ (shown in the toast and the Undo menu item)
export const actions = {
  // CloseTabAction
  closedTab: (title: string) => `Closed "${title}"`,
  closedTabs: (count: number) => `Closed ${count} tabs`,

  // DeleteBookmarkAction
  deletedBookmark: (title: string) => `Deleted "${title}"`,
  deletedBookmarks: (count: number) => `Deleted ${count} bookmarks`,
  // Stands in for the name of a bookmark or folder without a title
  untitledBookmark: 'bookmark',

  // DeletePinnedSiteAction
  unpinnedSite: (title: string) => `Unpinned "${title}"`,
  unpinnedSites: (count: number) => `Unpinned ${count} sites`,

  // DeleteSpaceAction
  deletedSpace: (name: string) => `Deleted space "${name}"`,
  spaceNotFound: (spaceId: string) => `Space "${spaceId}" not found`,
};
