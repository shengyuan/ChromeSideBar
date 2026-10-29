/**
 * Moves a grouped tab to the front of its group, so it is listed first under
 * the group (a Space is one group) in the sidebar's tab list.
 *
 * Used for tabs opened from a link (target=_blank, Cmd+click, "Open link in new
 * tab"). Chrome inserts those right after the tab that opened them, and a
 * bookmark's tab usually sits at the end of its Space's group, so new link tabs
 * kept piling up at the bottom of the list.
 *
 * Ungrouped tabs are left where Chrome put them. Tabs hidden from the list
 * (bookmark tabs) may end up after the moved tab, which does not change what
 * the list shows.
 */
export async function moveTabToFrontOfGroup(tabId: number): Promise<void>
{
  let tab: chrome.tabs.Tab;
  try
  {
    tab = await chrome.tabs.get(tabId);
  }
  catch
  {
    return;  // Tab was already closed
  }
  if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;

  // Find the group's frontmost tab
  const groupTabs = await chrome.tabs.query({ windowId: tab.windowId, groupId: tab.groupId });
  let firstTab: chrome.tabs.Tab | undefined;
  for (const groupTab of groupTabs)
  {
    if (!firstTab || groupTab.index < firstTab.index)
    {
      firstTab = groupTab;
    }
  }
  if (!firstTab || firstTab.id === tabId) return;

  // Moving in front of a tab of its own group keeps the group membership
  await chrome.tabs.move(tabId, { index: firstTab.index });
}
