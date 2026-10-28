import { PinnedSite } from '../hooks/usePinnedSites';
import { Space } from '../contexts/SpacesContext';
import { isEmoji } from './emoji';
import {
  DEFAULT_ROOT_FOLDER_TITLES,
  findRootFolder,
  getRootFolders,
  getRootFolderType,
  RootFolderType,
} from './bookmarkRoots';
import { getMessages } from '../i18n';

// Convert PascalCase to kebab-case — used only for v1 backup migration
function toKebabCase(name: string): string
{
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Migrate v1 backup: convert PascalCase icon names to kebab-case
function migrateV1Backup(backup: FullBackup): void
{
  if (backup.spaces)
  {
    for (const space of backup.spaces)
    {
      if (space.icon && space.icon !== 'LayoutGrid' && !isEmoji(space.icon))
      {
        space.icon = toKebabCase(space.icon);
      }
    }
  }

  if (backup.pinnedSites)
  {
    for (const site of backup.pinnedSites)
    {
      if (site.customIconName)
      {
        site.customIconName = toKebabCase(site.customIconName);
      }
    }
  }

  backup.version = 2;
}

export interface TabGroupBackup {
  title: string;
  color: chrome.tabGroups.ColorEnum;
  tabs: {
    url: string;
    title: string;
    pinned: boolean;
  }[];
}

export interface FullBackup {
  version: 1 | 2;
  exportedAt: string;
  pinnedSites?: PinnedSite[];
  bookmarks?: chrome.bookmarks.BookmarkTreeNode[];
  tabGroups?: TabGroupBackup[];
  spaces?: Space[];
}

// Type guard to check if a file is a backup (has version field)
export function isFullBackup(data: unknown): data is FullBackup {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    'exportedAt' in data
  );
}

// Export all data (bookmarks, tabs+groups, pinned sites)
export async function exportFullBackup(
  pinnedSites: readonly PinnedSite[],
  bookmarks: chrome.bookmarks.BookmarkTreeNode[]
): Promise<void> {
  // Get current tabs and tab groups
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const groups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });

  // Build tab groups with their tabs
  const tabGroups: TabGroupBackup[] = groups.map(group => ({
    title: group.title || '',
    color: group.color,
    tabs: tabs
      .filter(tab => tab.groupId === group.id)
      .map(tab => ({
        url: tab.url || '',
        title: tab.title || '',
        pinned: tab.pinned || false,
      })),
  }));

  const backup: FullBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    pinnedSites: [...pinnedSites],
    bookmarks,
    tabGroups,
  };

  const data = JSON.stringify(backup, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sidebar-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type BookmarkImportMode = 'replace' | 'folder';
export type PinnedSitesImportMode = 'replace' | 'append';
export type TabGroupsImportMode = 'replace' | 'append';
export type SpacesImportMode = 'replace' | 'append';

// Import bookmarks recursively, returns count of bookmarks created
export async function importBookmarkNode(
  node: chrome.bookmarks.BookmarkTreeNode,
  parentId: string
): Promise<number> {
  let count = 0;
  if (node.url) {
    // It's a bookmark
    await chrome.bookmarks.create({
      parentId,
      title: node.title,
      url: node.url,
    });
    count = 1;
  } else if (node.children) {
    // It's a folder
    const folder = await chrome.bookmarks.create({
      parentId,
      title: node.title,
    });
    for (const child of node.children) {
      count += await importBookmarkNode(child, folder.id);
    }
  }
  return count;
}

// Clear all bookmarks in a folder
async function clearBookmarkFolder(folderId: string): Promise<void> {
  const children = await chrome.bookmarks.getChildren(folderId);
  for (const child of children) {
    await chrome.bookmarks.removeTree(child.id);
  }
}

// Import tab groups by creating tabs and grouping them
async function importTabGroups(tabGroups: TabGroupBackup[]): Promise<void> {
  for (const group of tabGroups) {
    if (group.tabs.length === 0) continue;

    // Create all tabs for this group
    const createdTabIds: number[] = [];
    for (const tabInfo of group.tabs) {
      const tab = await chrome.tabs.create({
        url: tabInfo.url,
        active: false,
        pinned: tabInfo.pinned,
      });
      if (tab.id) {
        createdTabIds.push(tab.id);
      }
    }

    // Group the tabs
    if (createdTabIds.length > 0) {
      // Get windowId from first created tab
      const firstTab = await chrome.tabs.get(createdTabIds[0]);
      const groupId = await chrome.tabs.group({
        tabIds: createdTabIds,
        createProperties: { windowId: firstTab.windowId }
      });
      await chrome.tabGroups.update(groupId, {
        title: group.title,
        color: group.color,
      });
    }
  }
}

export interface ImportResult {
  pinnedSitesCount: number;
  bookmarksCount: number;
  tabGroupsCount: number;
  spacesCount: number;
}

export interface ImportOptions {
  importPinnedSites: boolean;
  pinnedSitesMode: PinnedSitesImportMode;
  importBookmarks: boolean;
  bookmarkMode: BookmarkImportMode;
  importTabGroups: boolean;
  tabGroupsMode: TabGroupsImportMode;
  importSpaces: boolean;
  spacesMode: SpacesImportMode;
}

// Close all tabs in current window except one (Chrome requires at least one tab)
// Returns the ID of the blank tab created to keep the window open
async function closeAllTabs(): Promise<number | undefined> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  if (tabs.length === 0) return undefined;

  // Create a new blank tab first (Chrome won't allow closing all tabs)
  const newTab = await chrome.tabs.create({ url: 'about:blank' });

  // Close all other tabs
  const tabIdsToClose = tabs
    .filter(tab => tab.id && tab.id !== newTab.id)
    .map(tab => tab.id as number);

  if (tabIdsToClose.length > 0) {
    await chrome.tabs.remove(tabIdsToClose);
  }

  return newTab.id;
}

// Generate unique space name by adding suffix if needed
function generateUniqueSpaceName(name: string, existingNames: Set<string>): string
{
  if (!existingNames.has(name))
  {
    return name;
  }

  let suffix = 2;
  while (existingNames.has(`${name} (${suffix})`))
  {
    suffix++;
  }
  return `${name} (${suffix})`;
}

// Import full backup
export async function importFullBackup(
  backup: FullBackup,
  options: ImportOptions,
  replacePinnedSites: (sites: PinnedSite[]) => void,
  appendPinnedSites: (sites: PinnedSite[]) => void,
  replaceSpaces: (spaces: Space[]) => Promise<void>,
  appendSpaces: (spaces: Space[]) => Promise<void>,
  existingSpaceNames: string[]
): Promise<ImportResult> {
  // Migrate v1 backups to v2 (PascalCase → kebab-case icon names)
  if (backup.version === 1)
  {
    migrateV1Backup(backup);
  }

  const result: ImportResult = {
    pinnedSitesCount: 0,
    bookmarksCount: 0,
    tabGroupsCount: 0,
    spacesCount: 0,
  };

  // Import pinned sites
  if (options.importPinnedSites && backup.pinnedSites && backup.pinnedSites.length > 0) {
    if (options.pinnedSitesMode === 'replace') {
      replacePinnedSites(backup.pinnedSites);
    } else {
      appendPinnedSites(backup.pinnedSites);
    }
    result.pinnedSitesCount = backup.pinnedSites.length;
  }

  // Import bookmarks
  if (options.importBookmarks && backup.bookmarks && backup.bookmarks.length > 0) {
    // The backup structure can be either:
    // 1. [rootNode] where rootNode.children contains Bookmarks Bar and Other Bookmarks
    // 2. [bookmarksBar, otherBookmarks] directly (flat structure)
    const rootNode = backup.bookmarks.length === 1 &&
      backup.bookmarks[0].children &&
      !backup.bookmarks[0].url
        ? backup.bookmarks[0]
        : null;

    const searchArray = rootNode?.children || backup.bookmarks;

    // Match the backup's top-level folders by type, not by id: a backup from
    // a newer Chrome can have ids like '809', and so can this browser. A
    // backup may also hold two folders of one type (local + account copy).
    const sourceRoots = searchArray
      .map(node => ({ node, type: getRootFolderType(node, searchArray) }))
      .filter((r): r is { node: chrome.bookmarks.BookmarkTreeNode; type: RootFolderType } => r.type !== undefined);

    const liveRoots = await getRootFolders();
    const liveOther = findRootFolder(liveRoots, 'other');
    if (!liveOther) {
      throw new Error(getMessages().notices.importTargetFolderNotFound);
    }

    if (options.bookmarkMode === 'replace') {
      // Clear every target folder first (once, even if two source copies map
      // to it), so a fallback folder created below can't be wiped by a later clear
      const clearedTargetIds = new Set<string>();
      for (const { node: source, type } of sourceRoots) {
        const target = findRootFolder(liveRoots, type);
        if (source.children && target && !clearedTargetIds.has(target.id)) {
          await clearBookmarkFolder(target.id);
          clearedTargetIds.add(target.id);
        }
      }

      // Import each top-level folder into the folder of the same type here
      for (const { node: source, type } of sourceRoots) {
        if (!source.children) continue;

        let targetId: string;
        const target = findRootFolder(liveRoots, type);
        if (target) {
          targetId = target.id;
        } else {
          if (source.children.length === 0) continue;
          // This browser has no folder of that type (e.g. no Mobile Bookmarks):
          // keep its contents in a subfolder of Other Bookmarks instead
          const fallbackFolder = await chrome.bookmarks.create({
            parentId: liveOther.id,
            title: source.title || DEFAULT_ROOT_FOLDER_TITLES[type],
          });
          targetId = fallbackFolder.id;
        }

        for (const child of source.children) {
          result.bookmarksCount += await importBookmarkNode(child, targetId);
        }
      }
    } else {
      // Create in "Other Bookmarks" as a subfolder
      const dateStr = new Date().toLocaleDateString();
      const importFolder = await chrome.bookmarks.create({
        parentId: liveOther.id,
        title: `Imported Bookmarks ${dateStr}`,
      });

      // Create subfolders for each root folder to preserve structure
      for (const { node: source, type } of sourceRoots) {
        if (!source.children || source.children.length === 0) continue;

        const subfolder = await chrome.bookmarks.create({
          parentId: importFolder.id,
          title: source.title || DEFAULT_ROOT_FOLDER_TITLES[type],
        });
        for (const child of source.children) {
          result.bookmarksCount += await importBookmarkNode(child, subfolder.id);
        }
      }
    }
  }

  // Import tab groups
  if (options.importTabGroups && backup.tabGroups && backup.tabGroups.length > 0) {
    let blankTabId: number | undefined;
    if (options.tabGroupsMode === 'replace') {
      blankTabId = await closeAllTabs();
    }
    await importTabGroups(backup.tabGroups);
    result.tabGroupsCount = backup.tabGroups.length;

    // Close the blank tab if other tabs exist
    if (blankTabId) {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      if (tabs.length > 1) {
        await chrome.tabs.remove(blankTabId);
      }
    }
  }

  // Import spaces. Awaited so SpaceManager's segment self-heal (for spaces
  // with bookmarkFolderPath but no bookmarkFolderSegments - Arc import and
  // pre-bookmarkFolderSegments backups both produce that shape) has actually
  // landed by the time this function - and the caller's "success" UI - report done.
  if (options.importSpaces && backup.spaces && backup.spaces.length > 0) {
    if (options.spacesMode === 'replace') {
      await replaceSpaces(backup.spaces);
    } else {
      // For append mode, rename spaces with duplicate names
      const existingNamesSet = new Set(existingSpaceNames);
      const renamedSpaces = backup.spaces.map(space =>
      {
        const uniqueName = generateUniqueSpaceName(space.name, existingNamesSet);
        // Add this name to the set so subsequent spaces don't conflict
        existingNamesSet.add(uniqueName);
        return { ...space, name: uniqueName };
      });
      await appendSpaces(renamedSpaces);
    }
    result.spacesCount = backup.spaces.length;
  }

  return result;
}
