'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { AnomalyExplanationDialog } from './anomaly-explanation-dialog';
import type { ExplainAnomalyInput } from '@/ai/flows/anomaly-explanation';

interface VitalSignCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string | null;
  unit: string;
  isAnomalous: boolean;
  anomalyDetails: ExplainAnomalyInput | null;
  lastUpdated: number;
}

export function VitalSignCard({
  icon: Icon,
  title,
  value,
  unit,
  isAnomalous,
  anomalyDetails,
  lastUpdated,
}: VitalSignCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const cardClasses = cn(
    'transition-all duration-300',
    isAnomalous ? 'border-accent shadow-lg shadow-accent/10' : 'border-border',
    showAnimation && 'animate-pulse-bg'
  );

  useMemo(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [lastUpdated]);

  return (
    <>
      <Card className={cardClasses}>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            {value === null ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {typeof value === 'number' ? value.toFixed(1) : value}
              </div>
            )}
            <span className="text-lg font-medium text-muted-foreground">{unit}</span>
          </div>
          {isAnomalous && (
            <Button
              variant="link"
              size="sm"
              className="mt-2 h-auto p-0 text-accent"
              onClick={() => setDialogOpen(true)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Anomaly Detected - Explain
            </Button>
          )}
        </CardContent>
      </Card>
      <AnomalyExplanationDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        anomalyDetails={anomalyDetails}
      />
    </>
  );
}
