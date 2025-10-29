
'use client';

import { useMqttContext } from '@/context/mqtt-context';
import { StatusIndicator } from './status-indicator';
import { Waves } from 'lucide-react';

export function Header() {
  const { status } = useMqttContext();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            VitalView
          </h1>
        </div>
        <StatusIndicator status={status} />
      </div>
    </header>
  );
}
