'use client';

import { cn } from '@/lib/utils';
import type { MqttStatus } from '@/hooks/use-mqtt';

interface StatusIndicatorProps {
  status: MqttStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    Connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
    },
    Connected: {
      color: 'bg-green-500',
      text: 'Connected',
    },
    Disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
    },
    Error: {
      color: 'bg-red-500',
      text: 'Error',
    },
  };

  const { color, text } = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-3 w-3 rounded-full animate-pulse', color)} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
