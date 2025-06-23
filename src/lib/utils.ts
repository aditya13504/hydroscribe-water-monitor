import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function generateMockSensorData() {
  const waterLevels = ['HIGH', 'LOW', 'CRITICAL'] as const;
  const functionalSensors = [
    {
      id: 'main-reservoir-monitor',
      name: 'Main Reservoir Monitor',
      location: { latitude: 40.7128, longitude: -74.0060 }
    },
    {
      id: 'irrigation-intake-sensor',
      name: 'Irrigation Intake Sensor',
      location: { latitude: 40.7150, longitude: -74.0080 }
    },
    {
      id: 'flood-warning-detector',
      name: 'Flood Warning Detector',
      location: { latitude: 40.7100, longitude: -74.0040 }
    },
    {
      id: 'groundwater-level-probe',
      name: 'Groundwater Level Probe',
      location: { latitude: 40.7160, longitude: -74.0100 }
    },
    {
      id: 'distribution-flow-monitor',
      name: 'Distribution Flow Monitor',
      location: { latitude: 40.7140, longitude: -74.0070 }
    },
    {
      id: 'overflow-safety-sensor',
      name: 'Overflow Safety Sensor',
      location: { latitude: 40.7120, longitude: -74.0050 }
    },
    {
      id: 'treatment-plant-inlet',
      name: 'Treatment Plant Inlet',
      location: { latitude: 40.7170, longitude: -74.0090 }
    },
    {
      id: 'agricultural-field-monitor',
      name: 'Agricultural Field Monitor',
      location: { latitude: 40.7110, longitude: -74.0030 }
    },
    {
      id: 'emergency-backup-gauge',
      name: 'Emergency Backup Gauge',
      location: { latitude: 40.7180, longitude: -74.0110 }
    },
    {
      id: 'quality-control-station',
      name: 'Quality Control Station',
      location: { latitude: 40.7090, longitude: -74.0020 }
    }
  ];
  
  const selectedSensor = functionalSensors[Math.floor(Math.random() * functionalSensors.length)];
  
  return {
    device_id: selectedSensor.id,
    device_name: selectedSensor.name,
    water_level: waterLevels[Math.floor(Math.random() * waterLevels.length)],
    timestamp: new Date().toISOString(),
    location: {
      latitude: selectedSensor.location.latitude + (Math.random() - 0.5) * 0.001,
      longitude: selectedSensor.location.longitude + (Math.random() - 0.5) * 0.001
    },
    temperature: 18 + Math.random() * 20, // 18-38°C range
    ph_level: 6.0 + Math.random() * 2.5, // 6.0-8.5 pH range
    flow_rate: Math.random() * 150 // 0-150 L/min
  };
}

export function getWaterLevelColor(level: string): string {
  switch (level) {
    case 'HIGH':
      return 'text-blue-600';
    case 'LOW':
      return 'text-yellow-600';
    case 'CRITICAL':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
