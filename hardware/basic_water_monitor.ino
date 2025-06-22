/*
 * HydroScribe Water Monitoring System
 * Base Arduino Code for UDOO Dual/Quad Board
 * 
 * This code provides basic water level monitoring functionality
 * with LED indicators and serial output for debugging.
 * 
 * Hardware Requirements:
 * - UDOO Dual/Quad Board
 * - Soil moisture sensor (digital output)
 * - 2x LEDs with 220Ω resistors
 * - Temperature sensor (optional)
 * - pH sensor (optional)
 * 
 * Pin Configuration:
 * - Water sensor: Digital pin 22
 * - Status LED: Digital pin 24
 * - Temperature: Analog pin A0 (optional)
 * 
 * Author: HydroScribe Team
 * Version: 1.0
 * Date: 2024
 */

const int sensorPin = 22;  // Digital pin for soil moisture sensor output
const int ledPin = 24;     // Digital pin for LED control
const int tempPin = A0;    // Analog pin for temperature sensor (optional)

void setup() {
  // Initialize pin modes
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(tempPin, INPUT);
  
  // Initialize serial communication
  Serial.begin(9600);
  
  // Startup message
  Serial.println("=====================================");
  Serial.println("HydroScribe Water Monitoring System");
  Serial.println("=====================================");
  Serial.println("System Status: INITIALIZING...");
  
  // LED test sequence
  for (int i = 0; i < 3; i++) {
    digitalWrite(ledPin, HIGH);
    delay(200);
    digitalWrite(ledPin, LOW);
    delay(200);
  }
  
  Serial.println("System Status: READY");
  Serial.println("=====================================");
}

void loop() {
  // Read water level sensor
  int sensorState = digitalRead(sensorPin);
  
  // Read temperature sensor (optional)
  int tempReading = analogRead(tempPin);
  float temperature = (tempReading * 5.0 / 1024.0 - 0.5) * 100.0;
  
  // Create timestamp
  unsigned long timestamp = millis();
  
  // Print sensor data in structured format
  Serial.println("--- SENSOR READING ---");
  Serial.print("Timestamp: ");
  Serial.println(timestamp);
  
  Serial.print("Water Level: ");
  if (sensorState == HIGH) {
    Serial.println("HIGH");
    Serial.println("Status: Water detected");
  } else {
    Serial.println("LOW");
    Serial.println("Status: No water detected");
  }
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  Serial.println("----------------------");
  
  // Control LED based on water level
  if (sensorState == HIGH) {
    digitalWrite(ledPin, HIGH);  // Turn LED on if water is detected
  } else {
    digitalWrite(ledPin, LOW);   // Turn LED off if no water is detected
  }

  // Wait 5 seconds before next reading
  delay(5000);
}

/*
 * Additional Functions for Enhanced Monitoring
 */

// Function to calibrate sensors (call during setup if needed)
void calibrateSensors() {
  Serial.println("Starting sensor calibration...");
  
  // Calibration sequence for water sensor
  Serial.println("Please ensure water sensor is in DRY condition");
  delay(5000);
  
  int dryReading = digitalRead(sensorPin);
  Serial.print("Dry reading: ");
  Serial.println(dryReading);
  
  Serial.println("Please place water sensor in WET condition");
  delay(5000);
  
  int wetReading = digitalRead(sensorPin);
  Serial.print("Wet reading: ");
  Serial.println(wetReading);
  
  Serial.println("Calibration complete!");
}

// Function to check system health
bool systemHealthCheck() {
  // Check if sensors are responding
  int sensorTest = digitalRead(sensorPin);
  int tempTest = analogRead(tempPin);
  
  if (tempTest > 0 && tempTest < 1023) {
    Serial.println("System Health: OK");
    return true;
  } else {
    Serial.println("System Health: WARNING - Check sensor connections");
    return false;
  }
}
