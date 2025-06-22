// Core types for HydroScribe Water Monitoring System

export interface WaterSensorData {
  device_id: string;
  device_name?: string;
  water_level: 'HIGH' | 'LOW' | 'CRITICAL';
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  temperature?: number;
  ph_level?: number;
  flow_rate?: number;
}

export interface AIInsight {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  type: 'flood_warning' | 'irrigation_advice' | 'maintenance_alert' | 'quality_concern';
  confidence_score: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: 'aws' | 'nvidia';
  services: string[];
  description: string;
  icon: string;
}

export interface HardwareConfig {
  board_type: 'udoo_dual' | 'udoo_quad' | 'simulation';
  sensors: {
    water_level: boolean;
    temperature: boolean;
    ph: boolean;
    flow_rate: boolean;
  };
  connectivity: {
    wifi: boolean;
    cellular: boolean;
    lora: boolean;
  };
}

export interface DashboardMetrics {
  total_sensors: number;
  active_alerts: number;
  data_points_today: number;
  average_water_level: number;
  system_uptime: number;
}

export interface ThingSpeakData {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: Array<{
    created_at: string;
    entry_id: number;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
  }>;
}

export interface NvidiaAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface AWSBedrockRequest {
  modelId: string;
  contentType: string;
  accept: string;
  body: string;
}

export interface MistralAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface GeminiAIRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
    topP: number;
    topK: number;
  };
  systemInstruction?: {
    parts: Array<{
      text: string;
    }>;
  };
}

export interface NovaLiteAIRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: Array<{
      text: string;
    }>;
  }>;
  inferenceConfig: {
    maxTokens: number;
    temperature?: number;
    topP?: number;
  };
}

export interface AIProvider {
  id: 'mistral' | 'gemini' | 'nova-lite';
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}
