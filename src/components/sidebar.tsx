
'use client';

import { cn } from '@/lib/utils';
import { HeartPulse, Siren, Pill, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type NavItem = 'Real-time Vitals' | 'SOS Alert' | 'Medication' | 'Emergency Fall Detection';

const navItems: { name: NavItem; icon: React.ElementType }[] = [
  { name: 'Real-time Vitals', icon: HeartPulse },
  { name: 'SOS Alert', icon: Siren },
  { name: 'Medication', icon: Pill },
  { name: 'Emergency Fall Detection', icon: ShieldAlert },
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
