
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import mqtt, { MqttClient, IClientPublishOptions } from 'mqtt';
import type { VitalSigns } from '@/lib/types';
import { useToast } from './use-toast';

export type MqttStatus = 'Connecting' | 'Connected' | 'Disconnected' | 'Error';

export function useMqtt(brokerUrl: string, topic: string) {
  const { toast } = useToast();
  const [status, setStatus] = useState<MqttStatus>('Connecting');
  const [payload, setPayload] = useState<VitalSigns | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (clientRef.current) return;

    try {
      clientRef.current = mqtt.connect(brokerUrl, {
        reconnectPeriod: 1000, 
        connectTimeout: 30 * 1000,
      });
      const client = clientRef.current;

      client.on('connect', () => {
        setStatus('Connected');
        client.subscribe(topic, (err) => {
          if (err) {
            console.error('Subscription error:', err);
            setStatus('Error');
            toast({
              title: "MQTT Subscription Failed",
              description: `Could not subscribe to topic: ${topic}`,
              variant: "destructive",
            });
          }
        });
      });

      client.on('message', (_topic, message) => {
        try {
          // Only parse messages from the main vital-signs topic
          if (_topic === topic) {
            const parsedMessage = JSON.parse(message.toString());
            setPayload(parsedMessage);
          } else {
            // For other topics, we can just update with raw data if needed,
            // or create a separate state. For now, we'll just update the main payload
            // to show it on the publish screen.
             const rawMessage = message.toString();
             // A bit of a hack to display raw messages on the publish screen
             setPayload({ raw: rawMessage } as any);
          }
        } catch (e) {
          console.error('Failed to parse MQTT message:', e);
          // Only show toast if it's the main topic failing
          if (_topic === topic) {
            toast({
              title: "Data Error",
              description: "Received a malformed data packet.",
              variant: "destructive",
            });
          }
        }
      });

      client.on('error', (err) => {
        console.error('Connection error:', err);
        setStatus('Error');
        client.end();
      });

      client.on('reconnect', () => {
        setStatus('Connecting');
      });
      
      client.on('close', () => {
        setStatus('Disconnected');
      });

    } catch (err) {
      console.error('MQTT connection setup failed:', err);
      setStatus('Error');
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, [brokerUrl, topic, toast]);

  const publish = useCallback(
    (publishTopic: string, message: string, qos: 0 | 1 | 2) => {
      if (clientRef.current && clientRef.current.connected) {
        const options: IClientPublishOptions = { qos };
        clientRef.current.publish(publishTopic, message, options, (error) => {
          if (error) {
            console.error('Publish error: ', error);
          }
        });
      } else {
        console.error('MQTT client not connected. Cannot publish.');
        throw new Error('MQTT client not connected.');
      }
    },
    []
  );

  return { status, payload, publish };
}
