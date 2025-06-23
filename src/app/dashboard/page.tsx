'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Thermometer,
  Gauge,
  MapPin,
  Clock,
  Brain,
  Zap,
  Cloud,
  RefreshCw,
  Settings,
  MessageCircle,
  Send,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { WaterSensorData, AIInsight, DashboardMetrics } from '@/types';
import { formatTimestamp, getWaterLevelColor, getSeverityColor, generateMockSensorData } from '@/lib/utils';
import { mistralAIService } from '@/lib/mistral-ai';
import { geminiAIService } from '@/lib/gemini-ai';
import { novaLiteAI } from '@/lib/nova-lite-ai';
import { thingSpeakService } from '@/lib/thingspeak';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const hostingProvider = searchParams.get('hosting') || 'aws';
  const [selectedAIModel, setSelectedAIModel] = useState<'mistral' | 'gemini' | 'nova-lite'>('mistral');
  const [sensorData, setSensorData] = useState<WaterSensorData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_sensors: 10,
    active_alerts: 0,
    data_points_today: 0,
    average_water_level: 0,
    system_uptime: 99.8
  });const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [question, setQuestion] = useState('');  const [answer, setAnswer] = useState('');  const [isAnswering, setIsAnswering] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showAlertConfig, setShowAlertConfig] = useState(false);  const [showAllSensors, setShowAllSensors] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    criticalThreshold: 80,
    warningThreshold: 60
  });
  // Use global dark mode
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Generate insights callback
  const generateInsights = useCallback(async (data: WaterSensorData[]) => {
    try {
      let newInsights: AIInsight[];
      
      if (selectedAIModel === 'gemini') {
        newInsights = await geminiAIService.generateWaterInsights(data);
      } else if (selectedAIModel === 'nova-lite') {
        newInsights = await novaLiteAI.generateWaterInsights(data);
      } else {
        newInsights = await mistralAIService.generateWaterInsights(data);
      }
      
      setInsights(prev => [...newInsights, ...prev.slice(0, 5)]);
    } catch (insightError) {
      console.error('Error generating insights:', insightError);
    }
  }, [selectedAIModel]);

  // Real-time visualization data
  const [realtimeData, setRealtimeData] = useState<Array<{
    time: string;
    waterLevel: number;
    temperature: number;
    ph: number;
  }>>([]);
  const [sensorStatusData, setSensorStatusData] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);
  const [temperatureTrendData, setTemperatureTrendData] = useState<Array<{
    time: string;
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
  }>>([]);

  // Real-time data simulation
  useEffect(() => {    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load data from ThingSpeak or generate mock data for all 10 sensors
        let data;
        try {
          data = await thingSpeakService.getDemoChannelData();        } catch {
          console.log('Using mock data for all sensors');
          // Generate initial data for all 10 sensors
          data = Array.from({ length: 25 }, () => generateMockSensorData());
        }
        
        setSensorData(data);
        
        // Calculate metrics based on unique sensors
        const uniqueSensors = [...new Set(data.map(d => d.device_id))];
        const alertCount = data.filter(d => d.water_level === 'CRITICAL').length;
        const avgLevel = data.reduce((acc, d) => {
          const level = d.water_level === 'CRITICAL' ? 100 : d.water_level === 'HIGH' ? 75 : 25;
          return acc + level;
        }, 0) / data.length;

        setMetrics(prev => ({
          ...prev,
          total_sensors: Math.max(uniqueSensors.length, 10),
          active_alerts: alertCount,
          data_points_today: data.length,
          average_water_level: avgLevel
        }));        // Generate AI insights
        await generateInsights(data);
      } catch (loadError) {
        console.error('Error loading data:', loadError);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();    // Set up real-time updates every 30 seconds
    const interval = setInterval(async () => {
      const newData = generateMockSensorData();
      let currentSensorData: WaterSensorData[] = [];
      
      setSensorData(prev => {
        currentSensorData = prev;
        return [newData, ...prev.slice(0, 19)];
      });
      
      setLastUpdate(new Date());
      
      // Update real-time visualization data
      updateVisualizationData(newData);
      
      // Periodically regenerate insights
      if (Math.random() < 0.3) {
        await generateInsights([newData, ...currentSensorData.slice(0, 4)]);
      }
    }, 5000);return () => clearInterval(interval);
  }, [generateInsights]);  // Regenerate insights when AI model changes
  useEffect(() => {
    setSensorData(currentData => {
      if (currentData.length > 0) {
        generateInsights(currentData.slice(0, 5));
      }
      return currentData;
    });
  }, [selectedAIModel, generateInsights]);

  // Update visualization data
  const updateVisualizationData = (newSensorData: WaterSensorData) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });    // Update realtime line chart data
    setRealtimeData(prev => {
      // Extract numeric value from water level (e.g., "HIGH" -> generate realistic value, "75%" -> 75)
      let waterLevelValue = 0;
      if (newSensorData.water_level.includes('%')) {
        waterLevelValue = parseFloat(newSensorData.water_level.replace('%', ''));
      } else {
        // Generate realistic values based on status
        switch (newSensorData.water_level.toUpperCase()) {
          case 'CRITICAL':
            waterLevelValue = Math.random() * 20 + 80; // 80-100
            break;
          case 'HIGH':
            waterLevelValue = Math.random() * 20 + 60; // 60-80
            break;
          case 'NORMAL':
            waterLevelValue = Math.random() * 20 + 40; // 40-60
            break;
          case 'LOW':
            waterLevelValue = Math.random() * 20 + 20; // 20-40
            break;
          default:
            waterLevelValue = Math.random() * 60 + 20; // 20-80
        }
      }
      
      const newPoint = {
        time: currentTime,
        waterLevel: parseFloat(waterLevelValue.toFixed(1)),
        temperature: newSensorData.temperature || 0,
        ph: newSensorData.ph_level || 7
      };
      return [...prev.slice(-14), newPoint]; // Keep last 15 points
    });    // Update sensor status pie chart data with percentages
    setSensorStatusData(() => {
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
      const total = 100;
      
      // Generate realistic distribution that adds up to 100%
      const critical = Math.floor(Math.random() * 10) + 5; // 5-15%
      const warning = Math.floor(Math.random() * 15) + 10; // 10-25%
      const optimal = Math.floor(Math.random() * 20) + 15; // 15-35%
      const normal = total - critical - warning - optimal; // Rest
      
      return [
        { name: 'Critical', value: critical, color: colors[0] },
        { name: 'Warning', value: warning, color: colors[1] },
        { name: 'Normal', value: Math.max(normal, 0), color: colors[2] },
        { name: 'Optimal', value: optimal, color: colors[3] }
      ];
    });

    // Update temperature trend area chart data
    setTemperatureTrendData(prev => {
      const newTempPoint = {
        time: currentTime,
        avgTemp: (newSensorData.temperature || 20) + (Math.random() - 0.5) * 4,
        minTemp: (newSensorData.temperature || 20) - Math.random() * 5,
        maxTemp: (newSensorData.temperature || 20) + Math.random() * 5
      };
      return [...prev.slice(-11), newTempPoint]; // Keep last 12 points
    });
  };

  // Initialize visualization data
  useEffect(() => {
    if (sensorData.length > 0) {
      updateVisualizationData(sensorData[0]);
    }  }, [sensorData]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAnswering(true);
    setAnswer('');
    
    try {
      const response = await fetch(`/api/insights/${selectedAIModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          sensorData: sensorData.slice(0, 5) // Include recent sensor data for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer(data.answer || 'I apologize, but I could not process your question at the moment.');
      } else {
        setAnswer('There was an error processing your question. Please try again.');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('There was an error processing your question. Please try again.');
    } finally {
      setIsAnswering(false);
    }
  };  const refreshData = async () => {
    setIsLoading(true);
    // Generate new data from multiple sensors for better diversity
    const newData = Array.from({ length: 8 }, () => generateMockSensorData());
    setSensorData(prev => [...newData, ...prev.slice(0, 17)]);
    
    // Update metrics
    const alertCount = newData.filter(d => d.water_level === 'CRITICAL').length;
    
    setMetrics(prev => ({
      ...prev,
      active_alerts: prev.active_alerts + alertCount,
      data_points_today: prev.data_points_today + newData.length
    }));
    
    await generateInsights(newData);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // Handle generating new insights
  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      // Generate fresh sensor data
      const newData = Array.from({ length: 3 }, () => generateMockSensorData());
      setSensorData(prev => [...newData, ...prev.slice(0, 17)]);
      
      // Generate new insights
      await generateInsights(newData);
      setLastUpdate(new Date());
      
      // Show success feedback
      setTimeout(() => {
        setIsGeneratingInsights(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating insights:', error);
      setIsGeneratingInsights(false);
    }
  };

  // Handle alert configuration
  const handleConfigureAlerts = () => {
    setShowAlertConfig(!showAlertConfig);
  };
  // Handle saving alert settings
  const handleSaveAlertSettings = () => {    // In a real app, this would save to backend
    console.log('Saving alert settings:', alertSettings);
    setShowAlertConfig(false);
    
    // Show success message (you could add a toast notification here)
    alert('Alert settings saved successfully!');
  };
  // Prepare chart data
  const chartData = sensorData.slice(0, 10).reverse().map((data) => ({
    time: new Date(data.timestamp).toLocaleTimeString(),
    waterLevel: data.water_level === 'CRITICAL' ? 100 : data.water_level === 'HIGH' ? 75 : 25,
    temperature: data.temperature || 0,
    phLevel: data.ph_level || 7,
    flowRate: data.flow_rate || 0
  }));  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      hostingProvider === 'nvidia'
        ? (isDarkMode 
          ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-green-800' 
          : 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100')
        : (isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50')
    }`}>
      {/* Header */}
      <header className={`shadow-lg border-b transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
          : 'bg-white/80 backdrop-blur-sm border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                }`}>
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>HydroScribe Dashboard</h1>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Real-time Water Monitoring</p>
                </div>
              </Link>
            </div>              <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span>Hosting:</span>
                <div className="flex items-center space-x-1">
                  {hostingProvider === 'nvidia' ? (
                    <>
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-green-100 text-green-800'
                      }`}>NVIDIA</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4 text-orange-500" />
                      <span className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-orange-500/20 text-orange-400' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>AWS</span>
                    </>
                  )}
                </div>
              </div>
              
              <button
                onClick={refreshData}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:bg-gray-800/90' 
                : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-blue-600/20 hover:bg-blue-600/30' 
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}>
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{metrics.total_sensors}</span>
            </div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Active Sensors</h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Monitoring water levels</p>
          </motion.div>          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:bg-gray-800/90' 
                : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-red-600/20 hover:bg-red-600/30' 
                  : 'bg-red-100 hover:bg-red-200'
              }`}>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{metrics.active_alerts}</span>
            </div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Active Alerts</h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Critical conditions</p>
          </motion.div>          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:bg-gray-800/90' 
                : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-green-600/20 hover:bg-green-600/30' 
                  : 'bg-green-100 hover:bg-green-200'
              }`}>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{metrics.data_points_today}</span>
            </div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Data Points</h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Collected today</p>
          </motion.div>          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:bg-gray-800/90' 
                : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-purple-600/20 hover:bg-purple-600/30' 
                  : 'bg-purple-100 hover:bg-purple-200'
              }`}>
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{metrics.system_uptime}%</span>
            </div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>System Uptime</h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Last 30 days</p>
          </motion.div></div>        {/* UDOO Hardware Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl shadow-lg border mb-8 transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-800/90 to-slate-800/90 border-gray-700 backdrop-blur-sm' 
              : 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-200 backdrop-blur-sm'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-6 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                }`}>
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>UDOO Hardware Platform</h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>Powering HydroScribe Water Monitoring</p>
                </div>
              </div>
                <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>What is UDOO?</h4>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    UDOO is a powerful single-board computer that combines ARM and x86 architectures, 
                    providing both Arduino compatibility and full PC capabilities in one compact device.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>ARM Cortex-A9 quad-core processor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Arduino-compatible I/O pins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Built-in WiFi & Bluetooth connectivity</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Why UDOO for Water Monitoring?</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Droplets className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Real-time Processing</p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Process sensor data locally with low latency</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Zap className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Low Power Consumption</p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Ideal for remote monitoring locations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Cloud className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>IoT Connectivity</p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Seamless cloud integration for data transmission</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Settings className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Expandable Design</p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Easy to add more sensors and modules</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`mt-4 p-3 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-900/30 border border-blue-500/20' : 'bg-blue-100'
              }`}>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  <strong>Current Configuration:</strong> UDOO Quad with 4 water level sensors, 
                  temperature monitoring, and real-time data transmission to {hostingProvider.toUpperCase()} cloud services.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Water Level Trends</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {formatTimestamp(lastUpdate.toISOString())}</span>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="waterLevel" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Current Sensors Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-sm border mt-6"
            >              <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Sensor Readings</h3>
              <div className="space-y-4">
                {sensorData.slice(0, 5).map((sensor, index) => (
                  <div key={sensor.device_id + index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {sensor.device_name || sensor.device_id}
                        </h4>
                        <p className="text-sm text-gray-600">{formatTimestamp(sensor.timestamp)}</p>
                        <p className="text-xs text-gray-500">ID: {sensor.device_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getWaterLevelColor(sensor.water_level)}`}>
                          {sensor.water_level}
                        </div>
                        <div className="text-xs text-gray-600">Water Level</div>
                      </div>
                      
                      {sensor.temperature && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold">{sensor.temperature.toFixed(1)}°C</span>
                          </div>
                          <div className="text-xs text-gray-600">Temperature</div>
                        </div>
                      )}
                      
                      {sensor.ph_level && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Gauge className="w-4 h-4 text-green-500" />
                            <span className="font-semibold">{sensor.ph_level.toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-gray-600">pH Level</div>
                        </div>
                      )}
                    </div>
                  </div>                ))}
              </div>              
              {/* View All Sensors Button */}
              {sensorData.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllSensors(!showAllSensors)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{showAllSensors ? 'Show Less' : `View All ${sensorData.length} Sensors`}</span>
                  </button>
                </div>
              )}

              {/* All Sensors Expandable Section */}
              {showAllSensors && sensorData.length > 8 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 border-t pt-6"
                >
                  <h4 className="text-md font-semibold text-gray-900 mb-4">All Active Sensors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-thin">
                    {/* Group sensors by their functional category */}
                    {sensorData.slice(0, 20).map((sensor, index) => (
                      <div key={sensor.device_id + '-all-' + index} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <MapPin className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">
                              {sensor.device_name || sensor.device_id}
                            </h5>
                            <p className="text-xs text-gray-500">ID: {sensor.device_id}</p>
                          </div>
                          <div className={`text-sm font-semibold ${getWaterLevelColor(sensor.water_level)}`}>
                            {sensor.water_level}
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          {sensor.temperature && (
                            <div className="text-center">
                              <div className="font-medium">{sensor.temperature.toFixed(1)}°C</div>
                              <div className="text-gray-500">Temp</div>
                            </div>
                          )}
                          {sensor.ph_level && (
                            <div className="text-center">
                              <div className="font-medium">{sensor.ph_level.toFixed(1)}</div>
                              <div className="text-gray-500">pH</div>
                            </div>
                          )}
                          {sensor.flow_rate && (
                            <div className="text-center">
                              <div className="font-medium">{sensor.flow_rate.toFixed(1)}</div>
                              <div className="text-gray-500">L/min</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>                </motion.div>
              )}
            </motion.div>

            {/* Real-time Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Real-time Water Levels Line Chart */}              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Water Levels</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        fontSize={12}
                        stroke="#666"
                      />
                      <YAxis 
                        fontSize={12} 
                        stroke="#666"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px' 
                        }}                        formatter={(value: number) => [
                          `${value}%`, 
                          'Water Level'
                        ]}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="waterLevel" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sensor Status Distribution Pie Chart */}              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sensor Status</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sensorStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >                        {sensorStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px' 
                        }}
                        formatter={(value: number, name: string) => [`${value}%`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {sensorStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-xs text-gray-600">{entry.name} ({entry.value}%)</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Temperature Trend Area Chart */}              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Temperature Trends</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={temperatureTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        fontSize={12}
                        stroke="#666"
                      />
                      <YAxis 
                        fontSize={12} 
                        stroke="#666"
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px' 
                        }}                        formatter={(value: number, name: string) => [
                          `${value.toFixed(1)}°C`, 
                          name === 'avgTemp' ? 'Average' : 
                          name === 'minTemp' ? 'Minimum' : 'Maximum'
                        ]}
                      />                      <Area 
                        type="monotone" 
                        dataKey="avgTemp" 
                        stroke="#f59e0b" 
                        fill="#fbbf24" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                </div>
                  {/* AI Model Selector */}                <select
                  value={selectedAIModel}
                  onChange={(e) => setSelectedAIModel(e.target.value as 'mistral' | 'gemini' | 'nova-lite')}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="mistral">🟣 Mistral AI</option>
                  <option value="gemini">🔵 Gemini 2.5 Pro</option>
                  <option value="nova-lite">🟠 Amazon Nova Lite</option>
                </select>
              </div>              <div className="space-y-4">
                {insights.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Loading AI insights...</p>
                  </div>
                )}
                  {/* Show first 3 insights directly */}
                {insights.slice(0, 3).map((insight, index) => (
                  <div
                    key={`main-${insight.id}-${index}`}
                    className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {insight.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs opacity-75">
                        {Math.round(insight.confidence_score * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm">{insight.message}</p>
                    <div className="text-xs opacity-75 mt-2">
                      {formatTimestamp(insight.timestamp)}
                    </div>
                  </div>
                ))}{/* Scrollable container for additional insights */}
                {insights.length > 3 && (
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Previous Insights ({insights.length - 3} more)</span>
                      </h4>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Scroll to view all ↓
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin border border-gray-200 rounded-lg p-3 bg-gray-50">                      {insights.slice(3).map((insight, index) => (
                        <motion.div
                          key={`scroll-${insight.id}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border ${getSeverityColor(insight.severity)} bg-white shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              {insight.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs opacity-75">
                              {Math.round(insight.confidence_score * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm">{insight.message}</p>
                          <div className="text-xs opacity-75 mt-2">
                            {formatTimestamp(insight.timestamp)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white p-6 rounded-xl shadow-sm border mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>              <div className="space-y-3">
                <button 
                  onClick={handleGenerateInsights}
                  disabled={isGeneratingInsights}
                  className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    {isGeneratingInsights ? (
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-sm font-medium text-blue-900">
                      {isGeneratingInsights ? 'Generating Insights...' : 'Generate New Insights'}
                    </span>
                  </div>
                </button>
                
                <button 
                  onClick={handleConfigureAlerts}
                  className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Configure Alerts</span>
                  </div>
                </button><Link href="/hardware">
                  <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-purple-900">UDOO Hardware Setup</div>
                        <div className="text-xs text-purple-700">Configure sensors & connectivity</div>
                      </div>
                    </div>
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* AI Q&A Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white p-6 rounded-xl shadow-sm border mt-6"
            >              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Ask AI Expert</h3>                {selectedAIModel === 'gemini' ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">GEMINI</span>
                ) : selectedAIModel === 'nova-lite' ? (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">NOVA LITE</span>
                ) : (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">MISTRAL</span>
                )}
              </div>              <div className="space-y-4">
                {/* Sample Questions */}
                {!answer && !isAnswering && question.trim() === '' && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "What's the current water quality status?",
                        "Are there any flood risks in my area?",
                        "How can I optimize irrigation scheduling?",
                        "What maintenance is needed for my sensors?",
                        "Analyze the recent water level trends",
                        "Should I be concerned about the pH levels?"
                      ].map((sampleQuestion, index) => (
                        <button
                          key={index}
                          onClick={() => setQuestion(sampleQuestion)}
                          className="text-left p-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-200"                        >
                          &quot;{sampleQuestion}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about water management, flood risks, irrigation, or system insights..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    disabled={isAnswering}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={isAnswering || !question.trim()}
                    className="relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isAnswering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Thinking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-medium">Ask AI</span>
                      </>
                    )}
                    {!isAnswering && (
                      <div className="absolute inset-0 bg-white opacity-20 rounded-lg animate-pulse"></div>
                    )}
                  </button>
                </div>                {answer && (
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      {selectedAIModel === 'gemini' ? (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                      )}                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedAIModel === 'gemini' ? 'Gemini 2.5 Pro' : 
                           selectedAIModel === 'nova-lite' ? 'Amazon Nova Lite' : 'Mistral AI'} Response
                        </span>
                        <div className="text-xs text-gray-500">
                          Powered by {selectedAIModel === 'gemini' ? 'Google AI' : 
                                     selectedAIModel === 'nova-lite' ? 'Amazon Bedrock' : 'Mistral AI'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                      {answer}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {setAnswer(''); setQuestion('');}}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Ask another question</span>
                      </button>
                    </div>
                  </div>
                )}{!answer && !isAnswering && question.trim() !== '' && (
                  <div className="text-center py-8">
                    <div className="animate-bounce">
                      {selectedAIModel === 'gemini' ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>                    <p className="text-sm text-gray-500">
                      {selectedAIModel === 'gemini' ? 'Gemini AI' : 
                       selectedAIModel === 'nova-lite' ? 'Amazon Nova Lite' : 'Mistral AI'} is ready to help with your water management questions
                    </p>
                  </div>
                )}
                
                {!answer && !isAnswering && question.trim() === '' && (
                  <div className="text-center py-4">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Ask any question about water management, current sensor readings, or system optimization</p>
                  </div>
                )}
              </div>            </motion.div>
          </div>
        </div>
      </div>

      {/* Alert Configuration Modal */}
      {showAlertConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 m-4 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Alert Configuration</h3>              <button
                onClick={() => setShowAlertConfig(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive alerts via email</p>
                </div>
                <button
                  onClick={() => setAlertSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    alertSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      alertSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">SMS Alerts</label>
                  <p className="text-xs text-gray-500">Receive critical alerts via SMS</p>
                </div>
                <button
                  onClick={() => setAlertSettings(prev => ({ ...prev, smsAlerts: !prev.smsAlerts }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    alertSettings.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      alertSettings.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Critical Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Critical Water Level Threshold: {alertSettings.criticalThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={alertSettings.criticalThreshold}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, criticalThreshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Warning Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Warning Water Level Threshold: {alertSettings.warningThreshold}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={alertSettings.warningThreshold}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, warningThreshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAlertConfig(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAlertSettings}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
