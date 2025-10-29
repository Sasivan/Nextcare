
'use client';

import { useMqttContext } from '@/context/mqtt-context';
import { StatusIndicator } from './status-indicator';
import { Waves } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeaderProps {
  activeView: 'home' | 'elder' | 'family';
  setActiveView: (view: 'home' | 'elder' | 'family') => void;
}

export function Header({ activeView, setActiveView }: HeaderProps) {
  const { status } = useMqttContext();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Waves className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            NextCare+
          </h1>
        </div>
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'home' |'elder' | 'family')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="elder">Elder View</TabsTrigger>
              <TabsTrigger value="family">Family View</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>
      <StatusIndicator status={status} />
    </header>
  );
}
