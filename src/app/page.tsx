import { Dashboard } from "@/components/dashboard";
import { Header } from "@/components/header";
import { MqttProvider } from "@/context/mqtt-context";

export default function Home() {
  return (
    <MqttProvider>
      <div className="min-h-screen w-full bg-background font-body">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <Dashboard />
        </main>
      </div>
    </MqttProvider>
  );
}
