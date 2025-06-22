'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Cpu, Cloud, Zap, ArrowRight, Shield, BarChart3, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState<'hardware' | 'software' | null>(null);
  const [selectedHosting, setSelectedHosting] = useState<'aws' | 'nvidia' | null>(null);
  
  // Use global dark mode
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleOptionSelect = (option: 'hardware' | 'software') => {
    setSelectedOption(option);
    setSelectedHosting(null); // Reset hosting selection when changing option
    
    // Auto-scroll to hosting selection
    setTimeout(() => {
      const hostingSection = document.getElementById('hosting-selection');
      if (hostingSection) {
        hostingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleHostingSelect = (hosting: 'aws' | 'nvidia') => {
    setSelectedHosting(hosting);
    
    // Auto-scroll to action button
    setTimeout(() => {
      const actionSection = document.getElementById('action-section');
      if (actionSection) {
        actionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const features = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "24/7 water level monitoring with instant alerts and notifications"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "AI-Powered Insights", 
      description: "Advanced AI models provide actionable water management recommendations"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Flood Prevention",
      description: "Advanced prediction algorithms to prevent flood damage and optimize response"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data Analytics",
      description: "Comprehensive analytics dashboard with historical trends and patterns"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>HydroScribe</h1>
              <p className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Intelligent Water Monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`flex items-center space-x-2 text-sm transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span>Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">AWS</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">NVIDIA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-5xl font-bold mb-6 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Next-Level Water
            <span className="text-blue-500"> Monitoring</span>
          </h2>
          <p className={`text-xl mb-8 max-w-3xl mx-auto transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Revolutionize your water management with AI-powered insights, real-time monitoring, 
            and predictive analytics. Choose your implementation approach below.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={`p-6 rounded-xl shadow-sm border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-blue-500' 
                  : 'bg-white border-gray-100 hover:shadow-lg hover:border-blue-200'
              }`}
            >
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className={`font-semibold mb-2 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{feature.title}</h3>
              <p className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Implementation Choice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className={`text-3xl font-bold mb-8 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Choose Your Implementation</h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hardware Option */}
            <motion.div
              whileHover={{ 
                scale: 1.02,
                x: 10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selectedOption === 'hardware' 
                  ? isDarkMode 
                    ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-500/20' 
                    : 'border-green-500 bg-green-50 shadow-lg'
                  : isDarkMode
                    ? 'border-gray-600 bg-gray-800 hover:border-green-400 hover:bg-green-900/10 hover:shadow-md'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
              onClick={() => handleOptionSelect('hardware')}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  selectedOption === 'hardware'
                    ? 'bg-green-500 text-white'
                    : isDarkMode
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-600'
                }`}>
                  <Cpu className="w-8 h-8" />
                </div>
                <h4 className={`text-2xl font-bold mb-3 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Hardware Integration</h4>
                <p className={`mb-6 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Complete IoT solution with UDOO Dual/Quad board, water sensors, 
                  and real-time data transmission to AWS IoT Core.
                </p>
                <ul className={`text-sm space-y-2 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li>✅ UDOO Board Configuration</li>
                  <li>✅ Sensor Integration Code</li>
                  <li>✅ AWS IoT MQTT Setup</li>
                  <li>✅ Hardware Assembly Guide</li>
                </ul>
              </div>
            </motion.div>

            {/* Software Option */}
            <motion.div
              whileHover={{ 
                scale: 1.02,
                x: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selectedOption === 'software' 
                  ? isDarkMode 
                    ? 'border-purple-400 bg-purple-900/20 shadow-lg shadow-purple-500/20' 
                    : 'border-purple-500 bg-purple-50 shadow-lg'
                  : isDarkMode
                    ? 'border-gray-600 bg-gray-800 hover:border-purple-400 hover:bg-purple-900/10 hover:shadow-md'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
              onClick={() => handleOptionSelect('software')}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  selectedOption === 'software'
                    ? 'bg-purple-500 text-white'
                    : isDarkMode
                      ? 'bg-purple-900/30 text-purple-400'
                      : 'bg-purple-100 text-purple-600'
                }`}>
                  <Cloud className="w-8 h-8" />
                </div>
                <h4 className={`text-2xl font-bold mb-3 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Software Demo</h4>
                <p className={`mb-6 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Experience the full dashboard with simulated data, AI insights, 
                  and ThingSpeak integration without physical hardware.
                </p>
                <ul className={`text-sm space-y-2 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li>✅ Live Dashboard Demo</li>
                  <li>✅ AI Insights Generation</li>
                  <li>✅ ThingSpeak Integration</li>
                  <li>✅ Real-time Simulations</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hosting Services Selection */}
        <AnimatePresence>
          {selectedOption && (
            <motion.div
              id="hosting-selection"
              initial={{ opacity: 0, y: 50, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -50, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`rounded-2xl p-8 shadow-lg border max-w-4xl mx-auto mb-12 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h4 className={`text-2xl font-bold mb-6 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Select Hosting Service Provider</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleHostingSelect('aws')}
                  className={`p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    selectedHosting === 'aws'
                      ? isDarkMode
                        ? 'border-orange-400 bg-orange-900/20 shadow-lg shadow-orange-500/20'
                        : 'border-orange-400 bg-orange-50 shadow-lg'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-orange-400 hover:bg-orange-900/10'
                        : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      selectedHosting === 'aws'
                        ? 'bg-orange-500 text-white'
                        : isDarkMode
                          ? 'bg-orange-900/30 text-orange-400'
                          : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className={`font-bold transition-colors ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>AWS Infrastructure</h5>
                      <p className={`text-sm transition-colors ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Amazon Web Services hosting</p>
                    </div>
                  </div>
                  <ul className={`text-sm space-y-1 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• AWS IoT Core integration</li>
                    <li>• Enterprise-grade reliability</li>
                    <li>• Mistral & Gemini AI models</li>
                    <li>• Scalable cloud infrastructure</li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    x: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleHostingSelect('nvidia')}
                  className={`p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    selectedHosting === 'nvidia'
                      ? isDarkMode
                        ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-500/20'
                        : 'border-green-400 bg-green-50 shadow-lg'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-green-400 hover:bg-green-900/10'
                        : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      selectedHosting === 'nvidia'
                        ? 'bg-green-500 text-white'
                        : isDarkMode
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-green-100 text-green-600'
                    }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className={`font-bold transition-colors ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>NVIDIA Infrastructure</h5>
                      <p className={`text-sm transition-colors ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>NVIDIA&apos;s AI inference platform</p>
                    </div>
                  </div>
                  <ul className={`text-sm space-y-1 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• Advanced flood prediction</li>
                    <li>• Edge AI processing</li>
                    <li>• High-performance computing</li>
                    <li>• Mistral & Gemini AI models</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button Section */}
        <AnimatePresence>
          {selectedOption && selectedHosting && (
            <motion.div
              id="action-section"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="text-center"
            >
              <Link href={selectedOption === 'hardware' ? `/hardware?hosting=${selectedHosting}` : `/dashboard?hosting=${selectedHosting}`}>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDarkMode 
                      ? "0 20px 40px rgba(59, 130, 246, 0.3)" 
                      : "0 20px 40px rgba(59, 130, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-12 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 mx-auto transition-all duration-300 ${
                    selectedOption === 'hardware'
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
                  }`}
                >
                  <span>
                    {selectedOption === 'hardware' ? 'Get Started with Hardware' : 'Launch Dashboard Demo'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <p className={`mt-4 text-sm transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {selectedOption === 'hardware' 
                  ? `Complete IoT setup with ${selectedHosting.toUpperCase()} hosting`
                  : `Experience the full dashboard with ${selectedHosting.toUpperCase()} infrastructure`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className={`container mx-auto px-4 py-8 mt-16 border-t transition-colors ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className={`text-center transition-colors ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>Built for Amazon Hackathon 2025 | Demonstrating AI-Powered Water Management Solutions</p>
          <p className="text-sm mt-2">Real-world impact through intelligent IoT monitoring and predictive analytics</p>
        </div>
      </footer>
    </div>
  );
}
