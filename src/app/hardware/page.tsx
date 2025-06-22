'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Wifi, 
  Zap, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Code,
  Wrench,
  Play,
  Moon,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function HardwarePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setZoomLevel(1);
    setRotation(0);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const baseArduinoCode = `// HydroScribe Water Monitoring System
// Base Arduino Code for UDOO Dual/Quad Board
// Compatible with soil moisture sensors and LED indicators

const int sensorPin = 22;  // Digital pin for soil moisture sensor output
const int ledPin = 24;     // Digital pin for LED control
const int tempPin = A0;    // Analog pin for temperature sensor (optional)

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(tempPin, INPUT);
  
  Serial.begin(9600);     // Initialize Serial communication
  Serial.println("HydroScribe Water Monitoring System Started");
  Serial.println("========================================");
}

void loop() {
  // Read water level sensor
  int sensorState = digitalRead(sensorPin);
  
  // Read temperature sensor (optional)
  int tempReading = analogRead(tempPin);
  float temperature = (tempReading * 5.0 / 1024.0 - 0.5) * 100.0;
  
  // Print sensor data
  Serial.print("Timestamp: ");
  Serial.println(millis());
  Serial.print("Water Level: ");
  Serial.println(sensorState == HIGH ? "HIGH" : "LOW");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  Serial.println("---");
  
  // Control LED based on water level
  if (sensorState == HIGH) {
    digitalWrite(ledPin, HIGH);  // Turn LED on if water is detected
    Serial.println("Status: Water detected - LED ON");
  } else {
    digitalWrite(ledPin, LOW);   // Turn LED off if no water is detected
    Serial.println("Status: No water detected - LED OFF");
  }

  delay(5000);  // Check sensor state every 5 seconds
}`;

  const awsIoTCode = `// HydroScribe with AWS IoT Core Integration
// Advanced Arduino Code with AWS MQTT Connection

#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// AWS IoT credentials
const char* mqtt_server = "YOUR_AWS_IOT_ENDPOINT.iot.us-east-1.amazonaws.com";
const char* device_id = "HydroScribe_WaterSensor_01";
const char* topic = "hydroscribe/sensor_data";
const int mqtt_port = 8883;

// Hardware pins
const int sensorPin = 22;  
const int ledPin = 24;
const int tempPin = A0;
const int phPin = A1;

WiFiClient wifiClient;
PubSubClient client(wifiClient);

void setup() {
  // Initialize pins
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(tempPin, INPUT);
  pinMode(phPin, INPUT);
  
  Serial.begin(9600);
  Serial.println("HydroScribe AWS IoT System Starting...");
  
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  
  Serial.println("System ready for data transmission");
}

void loop() {
  // Ensure MQTT connection
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Read all sensors
  WaterData data = readSensors();
  
  // Create JSON payload
  String payload = createJsonPayload(data);
  
  // Publish to AWS IoT
  if (client.publish(topic, payload.c_str())) {
    Serial.println("Data sent to AWS IoT Core successfully");
    Serial.println("Payload: " + payload);
  } else {
    Serial.println("Failed to send data to AWS IoT Core");
  }
  
  // Control LED
  digitalWrite(ledPin, data.waterLevel == "HIGH" ? HIGH : LOW);
  
  delay(10000); // Send data every 10 seconds
}`;

  const nvidiaIntegrationCode = `// HydroScribe with NVIDIA Edge AI Processing
// Enhanced Arduino Code with Local AI Processing

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// NVIDIA NIM API configuration
const char* nvidia_api_url = "https://integrate.api.nvidia.com/v1/chat/completions";
const char* nvidia_api_key = "YOUR_NVIDIA_API_KEY";

// Hardware configuration
const int sensorPin = 22;
const int ledPin = 24;
const int tempPin = A0;
const int phPin = A1;
const int criticalLedPin = 25;  // Additional LED for critical alerts

void setup() {
  // Initialize hardware
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(criticalLedPin, OUTPUT);
  pinMode(tempPin, INPUT);
  pinMode(phPin, INPUT);
  
  Serial.begin(9600);
  Serial.println("HydroScribe NVIDIA AI System Starting...");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println("System ready for AI-enhanced monitoring");
}`;

  const components = [
    {
      name: "UDOO Dual/Quad Board",
      description: "Main microcontroller with ARM Cortex-A9 processor",
      required: true
    },
    {
      name: "Soil Moisture Sensor",
      description: "Digital water level detection sensor",
      required: true
    },
    {
      name: "LED Indicators",
      description: "Visual status indicators (2x LEDs recommended)",
      required: true
    },
    {
      name: "Temperature Sensor",
      description: "LM35 or similar analog temperature sensor",
      required: false
    },
    {
      name: "pH Sensor",
      description: "Analog pH measurement sensor",
      required: false
    },
    {
      name: "Breadboard & Jumper Wires",
      description: "For prototyping connections",
      required: true
    },
    {
      name: "Resistors",
      description: "220Ω resistors for LED current limiting",
      required: true
    },
    {
      name: "Power Supply",
      description: "5V power supply for the UDOO board",
      required: true
    }
  ];

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className={`shadow-sm border-b transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Cpu className="w-8 h-8 text-blue-600" />
              </motion.div>
              <span className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                HydroScribe Hardware
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              <Link href="/dashboard" className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Hardware Overview */}
        <motion.div
          variants={cardVariants}
          className={`rounded-xl shadow-sm border p-8 mb-8 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <motion.h2 
            className={`text-2xl font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hardware Setup Overview
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <motion.h3 
                className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Required Components
              </motion.h3>
              <div className="space-y-3">
                {components.map((component, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(243, 244, 246, 0.5)'
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      x: 5,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {component.required ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </motion.div>
                    <div>
                      <div className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{component.name}</div>
                      <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{component.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              className={`p-6 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Connection Diagram</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water Sensor:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Digital Pin 22</span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status LED:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Digital Pin 24</span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Critical LED:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Digital Pin 25</span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Temperature:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Analog Pin A0</span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>pH Sensor:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Analog Pin A1</span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Power:</span>
                  <span className={`font-mono transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>5V & GND</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hardware Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl shadow-sm border p-8 mb-8 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Wrench className="w-6 h-6 text-blue-600" />
            <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step-by-Step Installation Guide</h2>
          </div>
          <p className={`mb-8 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Follow these detailed steps to set up your HydroScribe water monitoring system with UDOO board and sensors.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}            <motion.div 
              className={`rounded-xl p-6 border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-800' 
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0, type: "spring", stiffness: 100, damping: 10 }}
              whileHover="hover"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🚀 Getting Started</h3>
              </div>              <motion.img 
                src="/picture1.png" 
                alt="UDOO board unboxing and initial setup" 
                className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => openImageModal('/picture1.png')}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }
                }}
              />
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unbox your UDOO Dual/Quad board and familiarize yourself with the pin layout and connectivity options.</p>
            </motion.div>

            {/* Step 2 */}            <motion.div 
              className={`rounded-xl p-6 border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 10 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔧 Component Layout</h3>
              </div>              <motion.img 
                src="/picture2.png" 
                alt="All components laid out for water monitoring system" 
                className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => openImageModal('/picture2.png')}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }
                }}
              />
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Organize all your components: UDOO board, sensors, LEDs, resistors, and cables for easy access.</p>
            </motion.div>

            {/* Step 3 */}            <motion.div 
              className={`rounded-xl p-6 border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-purple-800' 
                  : 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100'
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 10 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Power Connection</h3>
              </div>              <motion.img 
                src="/picture3.png" 
                alt="Connecting 12V power supply to UDOO board" 
                className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => openImageModal('/picture3.png')}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }
                }}
              />
              <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Connect the 12V/2A power adapter to the UDOO board&apos;s power jack. Ensure stable power supply.</p>
            </motion.div>

            {/* Step 4-18 */}
            {[
              {
                num: 4, title: "💾 MicroSD Setup", image: "/picture4.png", 
                desc: "Insert the prepared microSD card with UDOO operating system into the board's card slot.",
                colors: isDarkMode ? "from-orange-900/50 to-amber-900/50 border-orange-800" : "from-orange-50 to-amber-50 border-orange-100"
              },
              {
                num: 5, title: "🌐 WiFi Antenna", image: "/picture5.png", 
                desc: "Attach the external WiFi antenna to improve connectivity, especially for remote monitoring locations.",
                colors: isDarkMode ? "from-cyan-900/50 to-sky-900/50 border-cyan-800" : "from-cyan-50 to-sky-50 border-cyan-100"
              },
              {
                num: 6, title: "🔌 GPIO Preparation", image: "/picture6.png", 
                desc: "Identify the GPIO pins on the UDOO board that will be used for sensor connections and LED indicators.",
                colors: isDarkMode ? "from-red-900/50 to-rose-900/50 border-red-800" : "from-red-50 to-rose-50 border-red-100"
              },
              {
                num: 7, title: "💧 Water Sensor Prep", image: "/picture7.png", 
                desc: "Prepare the JSN-SR04T waterproof ultrasonic sensor for water level detection with proper cable connections.",
                colors: isDarkMode ? "from-teal-900/50 to-emerald-900/50 border-teal-800" : "from-teal-50 to-emerald-50 border-teal-100"
              },
              {
                num: 8, title: "🌡️ Temperature Sensor", image: "/picture8.png", 
                desc: "Connect the DS18B20 waterproof temperature sensor to analog pin A0 for water temperature monitoring.",
                colors: isDarkMode ? "from-indigo-900/50 to-blue-900/50 border-indigo-800" : "from-indigo-50 to-blue-50 border-indigo-100"
              },
              {
                num: 9, title: "⚗️ pH Sensor Setup", image: "/picture9.png", 
                desc: "Set up the pH 4502C sensor module for water quality monitoring, connecting to analog pin A1.",
                colors: isDarkMode ? "from-pink-900/50 to-rose-900/50 border-pink-800" : "from-pink-50 to-rose-50 border-pink-100"
              },
              {
                num: 10, title: "🌱 Soil Moisture Sensor", image: "/picture10.png", 
                desc: "Install the capacitive soil moisture sensor as a secondary water detection method for redundancy.",
                colors: isDarkMode ? "from-emerald-900/50 to-green-900/50 border-emerald-800" : "from-emerald-50 to-green-50 border-emerald-100"
              },
              {
                num: 11, title: "💡 LED Indicators", image: "/picture11.png", 
                desc: "Connect RGB LEDs with 220Ω resistors to pins 24 and 25 for system status indication.",
                colors: isDarkMode ? "from-violet-900/50 to-purple-900/50 border-violet-800" : "from-violet-50 to-purple-50 border-violet-100"
              },
              {
                num: 12, title: "🔗 Main Connections", image: "/picture12.png", 
                desc: "Complete the main sensor connections to digital pin 22 and verify all wiring is secure.",
                colors: isDarkMode ? "from-amber-900/50 to-yellow-900/50 border-amber-800" : "from-amber-50 to-yellow-50 border-amber-100"
              },
              {
                num: 13, title: "🔌 Power Distribution", image: "/picture13.png", 
                desc: "Distribute 5V power and ground connections to all sensors using proper gauge wires.",
                colors: isDarkMode ? "from-lime-900/50 to-green-900/50 border-lime-800" : "from-lime-50 to-green-50 border-lime-100"
              },
              {
                num: 14, title: "🧪 System Testing", image: "/picture14.png", 
                desc: "Test each sensor individually using the serial monitor to verify proper readings and connections.",
                colors: isDarkMode ? "from-sky-900/50 to-cyan-900/50 border-sky-800" : "from-sky-50 to-cyan-50 border-sky-100"
              },
              {
                num: 15, title: "📡 WiFi Configuration", image: "/picture15.png", 
                desc: "Configure WiFi credentials and test network connectivity for cloud data transmission.",
                colors: isDarkMode ? "from-fuchsia-900/50 to-pink-900/50 border-fuchsia-800" : "from-fuchsia-50 to-pink-50 border-fuchsia-100"
              },
              {
                num: 16, title: "🏠 Weatherproof Enclosure", image: "/picture16.png", 
                desc: "Mount the complete system in an IP65 rated enclosure for outdoor protection and longevity.",
                colors: isDarkMode ? "from-stone-900/50 to-gray-900/50 border-stone-800" : "from-stone-50 to-gray-50 border-stone-100"
              },
              {
                num: 17, title: "🌊 Field Deployment", image: "/picture17.png", 
                desc: "Deploy the system at your water monitoring location, ensuring sensors are properly positioned.",
                colors: isDarkMode ? "from-emerald-900/50 to-teal-900/50 border-emerald-800" : "from-emerald-50 to-teal-50 border-emerald-100"
              },
              {
                num: 18, title: "✅ Live Monitoring", image: "/picture18.png", 
                desc: "System is now operational! Monitor real-time data through the HydroScribe dashboard and AI insights.",
                colors: isDarkMode ? "from-green-900/50 to-emerald-900/50 border-green-800" : "from-green-50 to-emerald-50 border-green-100"
              }
            ].map((step) => (              <motion.div 
                key={step.num} 
                className={`bg-gradient-to-br ${step.colors} rounded-xl p-6 border transition-colors duration-200`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.num * 0.05, type: "spring", stiffness: 100, damping: 10 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                    step.num <= 6 ? 'bg-blue-600' : 
                    step.num <= 12 ? 'bg-green-600' : 
                    'bg-purple-600'
                  }`}>{step.num}</div>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                </div>                <motion.img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity" 
                  onClick={() => openImageModal(step.image)}
                  whileHover={{
                    scale: 1.05,
                    rotateZ: 1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                />
                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className={`mt-8 p-6 rounded-xl border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-800' 
                : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Installation Complete!</h3>
            </div>
            <p className={`mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Congratulations! Your HydroScribe water monitoring system is now fully installed and operational. 
              The system will continuously monitor water levels, temperature, and quality parameters while providing 
              real-time insights through AI analysis.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link href="/dashboard" className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>View Live Dashboard</span>
                </Link>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a href="#arduino-code" className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Code className="w-4 h-4" />
                  <span>See Arduino Code</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Arduino Code Sections */}
        <div className="space-y-8" id="arduino-code">
          {/* Base Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl shadow-sm border transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`p-6 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Base Arduino Code</h3>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Basic water monitoring functionality</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(baseArduinoCode, 'base')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {copiedCode === 'base' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                  <span className="text-sm">{copiedCode === 'base' ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
            </div>
            <div className="p-6">
              <pre className={`p-4 rounded-lg overflow-x-auto text-sm transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-900 text-gray-100'
              }`}>
                <code>{baseArduinoCode}</code>
              </pre>
            </div>
          </motion.div>

          {/* AWS IoT Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl shadow-sm border transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`p-6 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AWS IoT Integration</h3>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cloud connectivity with MQTT</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(awsIoTCode, 'aws')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {copiedCode === 'aws' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                  <span className="text-sm">{copiedCode === 'aws' ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
            </div>
            <div className="p-6">
              <div className={`mb-4 p-4 border rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-orange-900/20 border-orange-800' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <h4 className={`font-semibold mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-orange-300' : 'text-orange-900'
                }`}>⚠️ Setup Required</h4>
                <p className={`text-sm transition-colors duration-200 ${
                  isDarkMode ? 'text-orange-200' : 'text-orange-800'
                }`}>Configure your AWS IoT Core endpoint and certificates before using this code.</p>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{awsIoTCode}</code>
              </pre>
            </div>
          </motion.div>

          {/* NVIDIA Integration Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-xl shadow-sm border transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`p-6 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>NVIDIA AI Integration</h3>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Edge AI processing with real-time analysis</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(nvidiaIntegrationCode, 'nvidia')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {copiedCode === 'nvidia' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                  <span className="text-sm">{copiedCode === 'nvidia' ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
            </div>
            <div className="p-6">
              <div className={`mb-4 p-4 border rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-green-900/20 border-green-800' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`font-semibold mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-green-300' : 'text-green-900'
                }`}>🚀 AI-Enhanced Features</h4>
                <p className={`text-sm transition-colors duration-200 ${
                  isDarkMode ? 'text-green-200' : 'text-green-800'
                }`}>This version includes real-time AI analysis of sensor data with critical alert detection.</p>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{nvidiaIntegrationCode}</code>
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`rounded-xl p-8 mt-8 text-white transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-800 to-purple-800' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <motion.a
              href="https://www.arduino.cc/en/software"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Download className="w-5 h-5" />
              <div>
                <div className="font-semibold">Download Arduino IDE</div>
                <div className="text-sm opacity-75">Get the development environment</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </motion.a>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/dashboard" className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Play className="w-5 h-5" />
                <div>
                  <div className="font-semibold">View Live Dashboard</div>
                  <div className="text-sm opacity-75">See the system in action</div>
                </div>
              </Link>
            </motion.div>

            <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg">
              <Wrench className="w-5 h-5" />
              <div>
                <div className="font-semibold">Need Help?</div>
                <div className="text-sm opacity-75">Check our documentation</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-full max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Control buttons */}
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <motion.button
                  onClick={handleZoomOut}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  disabled={zoomLevel <= 0.5}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ZoomOut className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={handleZoomIn}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  disabled={zoomLevel >= 3}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ZoomIn className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={handleRotate}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={closeImageModal}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center max-w-[90vw] max-h-[90vh] overflow-hidden">
                <motion.img
                  src={selectedImage}
                  alt="Hardware installation step"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                  }}
                  animate={{
                    scale: zoomLevel,
                    rotate: rotation,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              </div>

              {/* Zoom level indicator */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
