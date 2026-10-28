import React from 'react';
import * as ContextMenu from './menu/ContextMenu';
import { Pencil, X, Trash2 } from 'lucide-react';
import { useT } from '../i18n';

interface SpaceContextMenuContentProps
{
  isAllSpace: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCloseAllTabs?: () => void;
}

export const SpaceContextMenuContent: React.FC<SpaceContextMenuContentProps> = ({
  isAllSpace,
  onEdit,
  onDelete,
  onCloseAllTabs,
}) =>
{
  const t = useT();
  if (isAllSpace)
  {
    return (
      <ContextMenu.Item onSelect={onCloseAllTabs}>
        <X size={14} className="mr-2 flex-shrink-0" /> {t.spaces.closeAllTabs}
      </ContextMenu.Item>
    );
  }

  return (
    <>
      <ContextMenu.Item onSelect={onEdit}>
        <Pencil size={14} className="mr-2 flex-shrink-0" /> {t.common.editEllipsis}
      </ContextMenu.Item>

      <ContextMenu.Separator />

      <ContextMenu.Item onSelect={onCloseAllTabs}>
        <X size={14} className="mr-2 flex-shrink-0" /> {t.spaces.closeAllTabsInSpace}
      </ContextMenu.Item>

      <ContextMenu.Separator />

      <ContextMenu.Item danger onSelect={onDelete}>
        <Trash2 size={14} className="mr-2 flex-shrink-0" /> {t.common.delete}
      </ContextMenu.Item>
    </>
  );
};
