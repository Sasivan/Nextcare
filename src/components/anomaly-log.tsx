'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';

interface AnomalyLogProps {
  anomalies: string[];
}

export function AnomalyLog({ anomalies }: AnomalyLogProps) {
  const hasAnomalies =
    anomalies.length > 0 && anomalies[0] !== 'All vital signs are within normal range';

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          System & Anomaly Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32 w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {!anomalies.length ? (
              <p className="text-sm text-muted-foreground">Waiting for data...</p>
            ) : hasAnomalies ? (
              anomalies.map((log, index) => (
                <p key={index} className="text-sm text-accent">
                  - {log}
                </p>
              ))
            ) : (
              <p className="text-sm text-green-500">{anomalies[0]}</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
