
'use client';

import { useState, useEffect } from 'react';
import { MqttProvider } from '@/context/mqtt-context';
import { Sidebar, type NavItem } from '@/components/sidebar';
import { Header } from '@/components/header';
import { RealTimeVitals } from '@/components/real-time-vitals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Siren, Pill, ShieldAlert, AlertTriangle, Send, Trash2 } from 'lucide-react';
import { useMqttContext } from '@/context/mqtt-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';
import { PublishPage } from '@/components/publish-page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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

const initialMedications = [
  { id: 1, title: 'Lisinopril', time: '08:00 AM', dose: '10mg' },
  { id: 2, title: 'Metformin', time: '08:00 AM', dose: '500mg' },
  { id: 3, title: 'Atorvastatin', time: '08:00 PM', dose: '20mg' },
  { id: 4, title: 'Amlodipine', time: '08:00 PM', dose: '5mg' },
  { id: 5, title: 'Omega-3', time: '12:00 PM', dose: '1000mg' },
];

function MedicationSchedule() {
  const [medications, setMedications] = useState(initialMedications);

  const handleMedicationTaken = (id: number) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Medication Schedule Management</CardTitle>
        <CardDescription>
          Check the box to mark a medication as taken and remove it from the list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Dose</TableHead>
              <TableHead className="text-right">Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.title}</TableCell>
                <TableCell>{med.time}</TableCell>
                <TableCell>{med.dose}</TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    onCheckedChange={() => handleMedicationTaken(med.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
             {medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  All medications taken for today!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function MedicationPage() {
  const { payload } = useMqttContext();
  const { toast } = useToast();
  const typedPayload = payload as any;
  const medicationTaken = typedPayload?.swallow_pill_today === true;

  useEffect(() => {
    let reminderInterval: NodeJS.Timeout | null = null;

    if (payload && !medicationTaken) {
      // Immediately show a reminder if medication is not taken
      toast({
        title: 'Medication Reminder',
        description: 'Please remember to take your medication.',
        action: <BellRing className="h-6 w-6 text-primary" />,
      });

      // Then set an interval to remind every 2 minutes
      reminderInterval = setInterval(() => {
        toast({
          title: 'Medication Reminder',
          description: 'It\'s time to take your medication.',
          action: <BellRing className="h-6 w-6 text-primary" />,
        });
      }, 2 * 60 * 1000); // 2 minutes
    }

    // Cleanup function to clear interval when component unmounts or medication is taken
    return () => {
      if (reminderInterval) {
        clearInterval(reminderInterval);
      }
    };
  }, [payload, medicationTaken, toast]);


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <MedicationSchedule />
      <div className="flex flex-col gap-8">
        <Card className="w-full max-w-sm">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medication Adherence
            </CardTitle>
            <Pill className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {typedPayload ? (
              <div
                className={cn(
                  'text-3xl font-bold',
                  medicationTaken ? 'text-green-500' : 'text-destructive'
                )}
              >
                {medicationTaken ? 'YES' : 'NO'}
              </div>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Pill swallowed today
            </p>
            {!medicationTaken && payload && (
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg flex items-center gap-3">
                <BellRing className="h-5 w-5 text-primary animate-pulse"/>
                <p className="text-sm text-primary-foreground">Awaiting medication confirmation. Reminders are active.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FallDetectionPage() {
  const { payload } = useMqttContext();
  const typedPayload = payload as any;

  const fallDetected = typedPayload?.fall_emergency === true;

  return (
    <div className="flex items-center justify-center h-full">
      <Card className={cn("w-full max-w-lg text-center transition-all duration-300", fallDetected ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20" : "")}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <ShieldAlert className={cn("h-8 w-8", fallDetected ? "text-red-500" : "text-muted-foreground")} />
            Fall Detection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payload ? (
            fallDetected ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2 rounded-lg bg-destructive/10 p-6">
                  <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
                  <p className="text-4xl font-bold text-destructive">
                    FALL DETECTED!
                  </p>
                  <p className="text-lg text-destructive-foreground">
                    An emergency alert has been triggered due to a potential fall.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  System detected a significant impact followed by a period of immobility.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-500">No Fall Detected</p>
                <p className="text-muted-foreground">System is actively monitoring for falls.</p>
              </div>
            )
          ) : (
             <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
          )}
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
      case 'Emergency Fall Detection':
        return <FallDetectionPage />;
      case 'Publish':
        return <PublishPage />;
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
