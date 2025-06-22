/*
 * HydroScribe with AWS IoT Core Integration
 * Advanced Arduino Code with Real-time Cloud Data Transmission
 * 
 * This code connects to AWS IoT Core via MQTT and transmits
 * real-time sensor data for cloud processing and AI analysis.
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - PubSubClient
 * - ArduinoJson
 * 
 * Hardware Requirements:
 * - UDOO Dual/Quad Board with WiFi capability
 * - Water level sensor
 * - Temperature sensor (optional)
 * - pH sensor (optional)
 * - 2x LEDs for status indication
 * 
 * Author: HydroScribe Team
 * Version: 2.0
 * Date: 2024
 */

#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ====== CONFIGURATION SECTION ======
// WiFi credentials - REPLACE WITH YOUR VALUES
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// AWS IoT credentials - REPLACE WITH YOUR VALUES
const char* mqtt_server = "YOUR_AWS_IOT_ENDPOINT.iot.us-east-1.amazonaws.com";
const char* device_id = "HydroScribe_WaterSensor_01";
const char* topic = "hydroscribe/sensor_data";
const int mqtt_port = 8883;

// Hardware pin definitions
const int sensorPin = 22;       // Water level sensor
const int ledPin = 24;          // Status LED
const int criticalLedPin = 25;  // Critical alert LED
const int tempPin = A0;         // Temperature sensor
const int phPin = A1;           // pH sensor

// Timing configuration
const unsigned long SENSOR_INTERVAL = 10000;  // 10 seconds between readings
const unsigned long WIFI_TIMEOUT = 30000;     // 30 seconds WiFi connection timeout
const unsigned long MQTT_TIMEOUT = 10000;     // 10 seconds MQTT connection timeout

// ====== GLOBAL VARIABLES ======
WiFiClient wifiClient;
PubSubClient client(wifiClient);
unsigned long lastSensorReading = 0;
unsigned long lastWiFiCheck = 0;
bool systemActive = false;

// Data structure for sensor readings
struct WaterSensorData {
  String waterLevel;
  float temperature;
  float phLevel;
  float flowRate;
  String timestamp;
  float batteryLevel;
  int signalStrength;
};

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  delay(1000);
  
  Serial.println("========================================");
  Serial.println("HydroScribe AWS IoT System Starting...");
  Serial.println("========================================");
  
  // Initialize hardware pins
  initializeHardware();
  
  // Connect to WiFi
  if (connectToWiFi()) {
    // Initialize MQTT connection
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(mqttCallback);
    
    // Connect to AWS IoT
    if (connectToAWS()) {
      systemActive = true;
      Serial.println("System Status: FULLY OPERATIONAL");
      
      // Success indication - blink green LED
      for (int i = 0; i < 5; i++) {
        digitalWrite(ledPin, HIGH);
        delay(200);
        digitalWrite(ledPin, LOW);
        delay(200);
      }
    }
  }
  
  if (!systemActive) {
    Serial.println("System Status: LIMITED MODE - Data logging only");
    // Error indication - blink red LED
    for (int i = 0; i < 10; i++) {
      digitalWrite(criticalLedPin, HIGH);
      delay(100);
      digitalWrite(criticalLedPin, LOW);
      delay(100);
    }
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  // Maintain MQTT connection
  if (systemActive && !client.connected()) {
    Serial.println("MQTT connection lost. Attempting reconnection...");
    connectToAWS();
  }
  
  if (systemActive) {
    client.loop();
  }
  
  // Check WiFi connection periodically
  if (currentTime - lastWiFiCheck > 30000) {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi connection lost. Attempting reconnection...");
      connectToWiFi();
    } else {
      Serial.print("WiFi Status: Connected | Signal: ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");
    }
    lastWiFiCheck = currentTime;
  }
  
  // Read sensors and transmit data
  if (currentTime - lastSensorReading > SENSOR_INTERVAL) {
    WaterSensorData sensorData = readAllSensors();
    
    // Display local readings
    displaySensorData(sensorData);
    
    // Transmit to AWS if connected
    if (systemActive && client.connected()) {
      String jsonPayload = createJsonPayload(sensorData);
      
      if (client.publish(topic, jsonPayload.c_str())) {
        Serial.println("✓ Data transmitted to AWS IoT Core");
        digitalWrite(ledPin, HIGH);
        delay(100);
        digitalWrite(ledPin, LOW);
      } else {
        Serial.println("✗ Failed to transmit data to AWS IoT Core");
        digitalWrite(criticalLedPin, HIGH);
        delay(500);
        digitalWrite(criticalLedPin, LOW);
      }
    }
    
    // Control status LEDs
    updateStatusLEDs(sensorData);
    
    lastSensorReading = currentTime;
  }
  
  delay(100);  // Small delay to prevent overwhelming the processor
}

// ====== HARDWARE INITIALIZATION ======
void initializeHardware() {
  Serial.println("Initializing hardware...");
  
  // Configure pin modes
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(criticalLedPin, OUTPUT);
  pinMode(tempPin, INPUT);
  pinMode(phPin, INPUT);
  
  // Initial LED test
  digitalWrite(ledPin, HIGH);
  digitalWrite(criticalLedPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  digitalWrite(criticalLedPin, LOW);
  
  Serial.println("Hardware initialization complete");
}

// ====== WIFI CONNECTION ======
bool connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - startTime) < WIFI_TIMEOUT) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    return true;
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed!");
    return false;
  }
}

// ====== AWS IOT CONNECTION ======
bool connectToAWS() {
  Serial.println("Connecting to AWS IoT Core...");
  
  unsigned long startTime = millis();
  while (!client.connected() && (millis() - startTime) < MQTT_TIMEOUT) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect(device_id)) {
      Serial.println(" connected!");
      
      // Subscribe to command topic for remote control
      String commandTopic = "hydroscribe/commands/" + String(device_id);
      client.subscribe(commandTopic.c_str());
      Serial.println("Subscribed to command topic: " + commandTopic);
      
      return true;
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 2 seconds");
      delay(2000);
    }
  }
  
  Serial.println("Failed to connect to AWS IoT Core");
  return false;
}

// ====== MQTT CALLBACK ======
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.println("Message: " + message);
  
  // Parse commands (example: {"command": "calibrate"} or {"command": "reset"})
  StaticJsonDocument<200> doc;
  deserializeJson(doc, message);
  
  String command = doc["command"];
  
  if (command == "calibrate") {
    Serial.println("Remote calibration command received");
    // Implement calibration routine
  } else if (command == "reset") {
    Serial.println("Remote reset command received");
    ESP.restart();  // Reset the device
  }
}

// ====== SENSOR READING ======
WaterSensorData readAllSensors() {
  WaterSensorData data;
  
  // Read water level sensor
  int waterState = digitalRead(sensorPin);
  if (waterState == HIGH) {
    data.waterLevel = "HIGH";
  } else {
    data.waterLevel = "LOW";
  }
  
  // Read temperature sensor
  int tempReading = analogRead(tempPin);
  data.temperature = (tempReading * 5.0 / 1024.0 - 0.5) * 100.0;
  
  // Read pH sensor
  int phReading = analogRead(phPin);
  data.phLevel = map(phReading, 0, 1023, 0, 1400) / 100.0;  // Convert to pH scale
  
  // Simulate flow rate based on water level and some randomness
  if (data.waterLevel == "HIGH") {
    data.flowRate = random(50, 100);
  } else {
    data.flowRate = random(0, 30);
  }
  
  // System information
  data.timestamp = String(millis());
  data.batteryLevel = 85.5;  // Simulated - replace with actual battery reading
  data.signalStrength = WiFi.RSSI();
  
  return data;
}

// ====== JSON PAYLOAD CREATION ======
String createJsonPayload(WaterSensorData data) {
  StaticJsonDocument<400> doc;
  
  doc["device_id"] = device_id;
  doc["water_level"] = data.waterLevel;
  doc["temperature"] = data.temperature;
  doc["ph_level"] = data.phLevel;
  doc["flow_rate"] = data.flowRate;
  doc["timestamp"] = data.timestamp;
  doc["battery_level"] = data.batteryLevel;
  doc["signal_strength"] = data.signalStrength;
  
  // Location data (replace with GPS coordinates if available)
  doc["location"]["latitude"] = 40.7128;
  doc["location"]["longitude"] = -74.0060;
  
  // System status
  doc["system_status"] = systemActive ? "operational" : "limited";
  doc["firmware_version"] = "2.0";
  
  String jsonString;
  serializeJson(doc, jsonString);
  return jsonString;
}

// ====== DISPLAY FUNCTIONS ======
void displaySensorData(WaterSensorData data) {
  Serial.println("=== CURRENT SENSOR READINGS ===");
  Serial.println("Device ID: " + String(device_id));
  Serial.println("Water Level: " + data.waterLevel);
  Serial.println("Temperature: " + String(data.temperature) + "°C");
  Serial.println("pH Level: " + String(data.phLevel));
  Serial.println("Flow Rate: " + String(data.flowRate) + " L/min");
  Serial.println("Battery: " + String(data.batteryLevel) + "%");
  Serial.println("Signal: " + String(data.signalStrength) + " dBm");
  Serial.println("Timestamp: " + data.timestamp);
  Serial.println("===============================");
}

// ====== LED STATUS CONTROL ======
void updateStatusLEDs(WaterSensorData data) {
  // Normal operation LED
  if (systemActive && client.connected()) {
    digitalWrite(ledPin, data.waterLevel == "HIGH" ? HIGH : LOW);
  }
  
  // Critical alert LED
  if (data.waterLevel == "HIGH" && data.temperature > 35.0) {
    // Critical condition: high water + high temperature
    digitalWrite(criticalLedPin, HIGH);
  } else if (data.phLevel < 6.0 || data.phLevel > 8.5) {
    // pH out of safe range
    digitalWrite(criticalLedPin, HIGH);
  } else {
    digitalWrite(criticalLedPin, LOW);
  }
}

// ====== UTILITY FUNCTIONS ======
void performSystemDiagnostic() {
  Serial.println("=== SYSTEM DIAGNOSTIC ===");
  Serial.println("WiFi Status: " + String(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected"));
  Serial.println("MQTT Status: " + String(client.connected() ? "Connected" : "Disconnected"));
  Serial.println("Free Memory: " + String(ESP.getFreeHeap()) + " bytes");
  Serial.println("Uptime: " + String(millis() / 1000) + " seconds");
  Serial.println("========================");
}
