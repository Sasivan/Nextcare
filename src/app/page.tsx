
'use client';

import { useState } from 'react';
import { MqttProvider } from '@/context/mqtt-context';
import { Sidebar, type NavItem } from '@/components/sidebar';
import { Header } from '@/components/header';
import { RealTimeVitals } from '@/components/real-time-vitals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Siren, Pill, HeartPulse } from 'lucide-react';
import { useMqttContext } from '@/context/mqtt-context';
import { Skeleton } from '@/components/ui/skeleton';

function SOSAlertPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-6 w-6 text-destructive" />
            Manual SOS Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Press the button below to send an immediate SOS alert to the system.
            This action should only be taken in a real emergency.
          </p>
          <Button variant="destructive" size="lg" className="w-full">
            Send SOS Alert
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MedicationPage() {
    const { payload } = useMqttContext();
    const typedPayload = payload as any;
    
  return (
    <div className="flex items-center justify-center h-full">
        <Card>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
                Medication Adherence
            </CardTitle>
            <Pill className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            {typedPayload ? (
            <div className={`text-3xl font-bold ${typedPayload.swallow_pill_today ? 'text-green-500' : 'text-destructive'}`}>
                {typedPayload.swallow_pill_today ? 'YES' : 'NO'}
            </div>
            ) : (
            <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-muted-foreground mt-2">Pill swallowed today</p>
            </CardContent>
        </Card>
    </div>
  );
}


export default function Home() {
  const [activePage, setActivePage] = useState<NavItem>('Real-time Vitals');

  const renderContent = () => {
    switch (activePage) {
      case 'Real-time Vitals':
        return <RealTimeVitals />;
      case 'SOS Alert':
        return <SOSAlertPage />;
      case 'Medication':
        return <MedicationPage />;
      default:
        return <RealTimeVitals />;
    }
  };

  return (
    <MqttProvider>
      <div className="min-h-screen w-full bg-background font-body">
        <Header />
        <div className="flex">
          <Sidebar activeItem={activePage} setActiveItem={setActivePage} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderContent()}</main>
        </div>
      </div>
    </MqttProvider>
  );
}
