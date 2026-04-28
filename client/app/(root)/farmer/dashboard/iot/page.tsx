import type { Metadata } from "next";
import SensorDashboard from "@/components/IoT/SensorDashboard";

export const metadata: Metadata = {
  title: "IoT Sensors | AgriGov",
  description: "Real-time temperature, humidity, and soil moisture monitoring.",
};

export default function IoTPage() {
  return <SensorDashboard />;
}