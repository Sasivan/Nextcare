'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { explainAnomaly, type ExplainAnomalyInput } from '@/ai/flows/anomaly-explanation';
import { Skeleton } from './ui/skeleton';

interface AnomalyExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomalyDetails: ExplainAnomalyInput | null;
}

export function AnomalyExplanationDialog({
  open,
  onOpenChange,
  anomalyDetails,
}: AnomalyExplanationDialogProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && anomalyDetails) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        try {
          const result = await explainAnomaly(anomalyDetails);
          setExplanation(result.explanation);
        } catch (e) {
          console.error("Failed to get anomaly explanation:", e);
          setError("Could not load explanation. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [open, anomalyDetails]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anomaly Explanation</DialogTitle>
          <DialogDescription>
            AI-powered insight into the {anomalyDetails?.vitalSign.toLowerCase()} reading.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {explanation && <p className="text-sm text-foreground">{explanation}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
