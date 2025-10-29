'use client';

import { useMqttContext } from '@/context/mqtt-context';
import { VitalSignCard } from './vital-sign-card';
import { AnomalyLog } from './anomaly-log';
import {
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  Pill,
  ThermometerSun,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

const vitalSignsConfig = [
  {
    key: 'heart_rate' as const,
    title: 'Heart Rate',
    unit: 'BPM',
    icon: HeartPulse,
    anomalyText: 'Uncommon heart rate',
    thresholds: { low: 60, high: 100 },
  },
  {
    key: 'body_temperature' as const,
    title: 'Body Temperature',
    unit: '°C',
    icon: Thermometer,
    anomalyText: 'High body temperature',
    thresholds: { high: 37 },
  },
  {
    key: 'shirt_humidity' as const,
    title: 'Shirt Humidity',
    unit: '%',
    icon: Droplets,
    anomalyText: 'High sweat (Humidity)',
    thresholds: { high: 70 },
  },
  {
    key: 'breath_rate' as const,
    title: 'Breath Rate',
    unit: 'breaths/min',
    icon: Wind,
    anomalyText: 'Unusual breath rate',
    thresholds: { low: 12, high: 18 },
  },
  {
    key: 'env_temperature' as const,
    title: 'Environment Temp.',
    unit: '°C',
    icon: ThermometerSun,
    anomalyText: 'Not safest environment temperature',
    thresholds: { low: 5, high: 35 },
  },
];

export function Dashboard() {
  const { payload } = useMqttContext();
  const lastUpdated = Date.now();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vitalSignsConfig.map((config) => (
        <VitalSignCard
          key={config.key}
          title={config.title}
          icon={config.icon}
          value={payload ? payload[config.key] : null}
          unit={config.unit}
          isAnomalous={
            payload?.abnormal_sign.includes(config.anomalyText) ?? false
          }
          anomalyDetails={
            payload && payload.abnormal_sign.includes(config.anomalyText)
              ? {
                  vitalSign: config.title,
                  value: payload[config.key],
                  thresholdLow: config.thresholds.low,
                  thresholdHigh: config.thresholds.high,
                }
              : null
          }
          lastUpdated={payload ? lastUpdated : 0}
        />
      ))}
      <Card>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Medication Adherence
          </CardTitle>
          <Pill className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        {payload ? (
          <div className={`text-3xl font-bold ${payload.swallow_pill_today ? 'text-green-500' : 'text-destructive'}`}>
            {payload.swallow_pill_today ? 'YES' : 'NO'}
          </div>
        ) : (
          <Skeleton className="h-8 w-20" />
        )}
          <p className="text-xs text-muted-foreground mt-2">Pill swallowed today</p>
        </CardContent>
      </Card>
      <AnomalyLog anomalies={payload?.abnormal_sign ?? []} />
    </div>
  );
}
