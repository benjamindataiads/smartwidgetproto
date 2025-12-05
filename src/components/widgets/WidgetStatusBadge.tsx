'use client';

import { Badge } from '@/components/ui/Badge';
import type { WidgetStatus } from '@/types';

interface WidgetStatusBadgeProps {
  status: WidgetStatus;
}

const statusConfig: Record<WidgetStatus, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'Paused' },
  stopped: { variant: 'danger', label: 'Stopped' },
  draft: { variant: 'default', label: 'Draft' },
};

export function WidgetStatusBadge({ status }: WidgetStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}

