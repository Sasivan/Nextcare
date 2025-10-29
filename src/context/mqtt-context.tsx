
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMqtt, type MqttStatus } from '@/hooks/use-mqtt';
import type { VitalSigns } from '@/lib/types';
import type { IClientPublishOptions } from 'mqtt';

type MqttPublish = (
  topic: string,
  message: string,
  qos: 0 | 1 | 2
) => void;

interface MqttContextType {
  status: MqttStatus;
  payload: VitalSigns | null;
  publish: MqttPublish;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

const MQTT_BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const MQTT_TOPIC = 'vital-signs';

export function MqttProvider({ children }: { children: ReactNode }) {
  const { status, payload, publish } = useMqtt(MQTT_BROKER, MQTT_TOPIC);

  return (
    <MqttContext.Provider value={{ status, payload, publish }}>
      {children}
    </MqttContext.Provider>
  );
}

export function useMqttContext() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqttContext must be used within a MqttProvider');
  }
  return context;
}
