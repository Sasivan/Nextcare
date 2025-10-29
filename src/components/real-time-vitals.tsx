
'use client';

import { useMqttContext } from '@/context/mqtt-context';
import { VitalSignCard } from './vital-sign-card';
import { AnomalyLog } from './anomaly-log';
import {
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  ThermometerSun,
  Move,
  Orbit,
} from 'lucide-react';

const vitalSignsConfig = [
  {
    key: 'heart_rate' as const,
    title: 'Heart Rate',
    unit: 'BPM',
    icon: HeartPulse,
    anomalyText: 'Uncommon heart rate',
    thresholds: { low: 40, high: 130 },
  },
  {
    key: 'body_temperature' as const,
    title: 'Body Temperature',
    unit: '°C',
    icon: Thermometer,
    anomalyText: 'High body temperature',
    thresholds: { low: 36.1, high: 37.2 },
  },
  {
    key: 'shirt_humidity' as const,
    title: 'Shirt Humidity',
    unit: '%',
    icon: Droplets,
    anomalyText: 'High sweat (Humidity)',
    thresholds: { high: 80 },
  },
  {
    key: 'breath_rate' as const,
    title: 'Breath Rate',
    unit: 'breaths/min',
    icon: Wind,
    anomalyText: 'Unusual breath rate',
    thresholds: { low: 10, high: 24 },
  },
  {
    key: 'env_temperature' as const,
    title: 'Environment Temp.',
    unit: '°C',
    icon: ThermometerSun,
    anomalyText: 'Not safest environment temperature',
    thresholds: { low: -10, high: 30 },
  },
  {
    key: 'AcX' as const,
    title: 'Accelerometer X-axis',
    unit: 'raw',
    icon: Move,
    anomalyText: '',
    thresholds: {},
  },
  {
    key: 'GyX' as const,
    title: 'Gyroscope X-axis',
    unit: 'raw',
    icon: Orbit,
    anomalyText: '',
    thresholds: {},
  },
];

export function RealTimeVitals() {
  const { payload } = useMqttContext();
  const lastUpdated = Date.now();

  const typedPayload = payload as any;


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {vitalSignsConfig.map((config) => (
        <VitalSignCard
          key={config.key}
          title={config.title}
          icon={config.icon}
          value={typedPayload ? typedPayload[config.key] : null}
          unit={config.unit}
          isAnomalous={
            typedPayload?.abnormal_sign.includes(config.anomalyText) ?? false
          }
          anomalyDetails={
            typedPayload && typedPayload.abnormal_sign.includes(config.anomalyText)
              ? {
                  vitalSign: config.title,
                  value: typedPayload[config.key],
                  thresholdLow: config.thresholds.low,
                  thresholdHigh: config.thresholds.high,
                }
              : null
          }
          lastUpdated={typedPayload ? lastUpdated : 0}
        />
      ))}
      <AnomalyLog anomalies={typedPayload?.abnormal_sign ?? []} />
    </div>
  );
}
