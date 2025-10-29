
'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Siren, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type NavItem = 'Dashboard' | 'SOS Alert' | 'Medication';

const navItems: { name: NavItem; icon: React.ElementType }[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'SOS Alert', icon: Siren },
  { name: 'Medication', icon: Pill },
];

interface SidebarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
}

export function Sidebar({ activeItem, setActiveItem }: SidebarProps) {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background flex flex-col items-center py-4 z-20">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeItem === item.name ? 'default' : 'ghost'}
                  size="icon"
                  className={cn(
                    'rounded-lg',
                    activeItem === item.name &&
                      'bg-primary text-primary-foreground'
                  )}
                  onClick={() => setActiveItem(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
