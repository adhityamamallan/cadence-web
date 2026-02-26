import type { Theme } from 'baseui';

import { type WorkflowEventStatusBadgeSize } from '../workflow-history-event-status-badge.types';

export default function getBadgeIconSize(
  theme: Theme,
  size: WorkflowEventStatusBadgeSize
): string {
  const iconSizeMap: Record<WorkflowEventStatusBadgeSize, string> = {
    small: theme.sizing.scale500,
    medium: theme.sizing.scale600,
  };

  return iconSizeMap[size];
}
