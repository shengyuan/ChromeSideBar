// Finds Chrome's top-level bookmark folders (Bookmarks Bar, Other Bookmarks,
// Mobile Bookmarks) without assuming their ids.
//
// Older Chrome always used the fixed ids '1' / '2' / '3'. Since Chrome 134 the
// API reports each top-level folder's `folderType` instead, and those ids are
// no longer guaranteed: a profile that keeps bookmarks in the Google account
// can have e.g. '809' / '810' and no node '2' at all. There may also be zero,
// one, or two folders of a type (a local copy and an account copy).

type BookmarkNode = chrome.bookmarks.BookmarkTreeNode;

export type RootFolderType = 'bookmarks-bar' | 'other' | 'mobile';

export const ROOT_NODE_ID = '0';

// Ids used by Chrome before folderType existed
const LEGACY_ROOT_IDS: Record<RootFolderType, string> = {
  'bookmarks-bar': '1',
  'other': '2',
  'mobile': '3',
};

// Fallback titles for when a folder has no title (e.g. old backups)
export const DEFAULT_ROOT_FOLDER_TITLES: Record<RootFolderType, string> = {
  'bookmarks-bar': 'Bookmarks Bar',
  'other': 'Other Bookmarks',
  'mobile': 'Mobile Bookmarks',
};

// A Chrome new enough to report folderType reports it on every top-level folder
function reportsFolderType(roots: readonly BookmarkNode[]): boolean
{
  return roots.some(n => n.folderType !== undefined);
}

/**
 * Type of one top-level folder, judged against the list it came from (the
 * live tree, or the roots of a backup file). Undefined for a managed folder
 * or anything that isn't a top-level folder.
 */
export function getRootFolderType(node: BookmarkNode, roots: readonly BookmarkNode[]): RootFolderType | undefined
{
  // Pre-134 Chrome (or a backup it made): fall back to the fixed ids
  if (!reportsFolderType(roots))
  {
    const entry = Object.entries(LEGACY_ROOT_IDS).find(([, id]) => id === node.id);
    return entry?.[0] as RootFolderType | undefined;
  }

  return node.folderType === 'managed' ? undefined : node.folderType;
}

/** Every top-level folder of a type - usually one, two with local + account copies. */
export function findRootFolders(roots: readonly BookmarkNode[], type: RootFolderType): BookmarkNode[]
{
  return roots.filter(n => getRootFolderType(n, roots) === type);
}

/**
 * The top-level folder of a type to read from or create in. Prefers the
 * account copy when there are two, since that is where Chrome saves new
 * bookmarks for a signed-in user.
 */
export function findRootFolder(roots: readonly BookmarkNode[], type: RootFolderType): BookmarkNode | undefined
{
  const matches = findRootFolders(roots, type);
  return matches.find(n => n.syncing) ?? matches[0];
}

/** True for a top-level folder, which cannot be renamed, moved or deleted. */
export function isRootFolder(node: BookmarkNode): boolean
{
  return node.parentId === ROOT_NODE_ID;
}

/** The live top-level folders, read fresh from Chrome. */
export async function getRootFolders(): Promise<BookmarkNode[]>
{
  const tree = await chrome.bookmarks.getTree();
  return tree[0]?.children ?? [];
}

/** Like findRootFolder on the live tree, but throws if Chrome has no such folder. */
export async function requireRootFolder(type: RootFolderType): Promise<BookmarkNode>
{
  const folder = findRootFolder(await getRootFolders(), type);
  if (!folder)
  {
    throw new Error(`Cannot find the "${DEFAULT_ROOT_FOLDER_TITLES[type]}" folder`);
  }
  return folder;
}
