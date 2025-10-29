'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMqtt, type MqttStatus } from '@/hooks/use-mqtt';
import type { VitalSigns } from '@/lib/types';

interface MqttContextType {
  status: MqttStatus;
  payload: VitalSigns | null;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

const MQTT_BROKER = 'wss://broker.hivemq.com:8000/mqtt';
const MQTT_TOPIC = 'vital-signs';

export function MqttProvider({ children }: { children: ReactNode }) {
  const { status, payload } = useMqtt(MQTT_BROKER, MQTT_TOPIC);

  return (
    <MqttContext.Provider value={{ status, payload }}>
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
