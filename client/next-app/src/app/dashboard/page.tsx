'use client';

import { useState } from 'react';
import { WidgetGrid } from '@/components/layout/WidgetGrid';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { StreamIndicator } from '@/components/ui/StreamIndicator';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { motion } from 'framer-motion';

// Demo configurations
const demoConfigs = {
  iot: {
    name: 'IoT Device Manager',
    icon: '🔌',
    color: 'orange',
    description: 'Real-time device telemetry and control',
  },
  trading: {
    name: 'Trading Dashboard',
    icon: '📈',
    color: 'blue',
    description: 'Live market data and portfolio tracking',
  },
  chat: {
    name: 'Chat Application',
    icon: '💬',
    color: 'purple',
    description: 'Real-time messaging with presence',
  },
  files: {
    name: 'File Manager',
    icon: '📁',
    color: 'green',
    description: 'Upload and download with progress tracking',
  },
  analytics: {
    name: 'Analytics Dashboard',
    icon: '📊',
    color: 'orange',
    description: 'Business metrics with caching',
  },
};

export default function DashboardPage() {
  const [activeDemo, setActiveDemo] = useState<keyof typeof demoConfigs>('iot');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentDemo = demoConfigs[activeDemo];

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeDemo={activeDemo}
          onDemoChange={setActiveDemo}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          demos={demoConfigs}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          <div className="p-6">
            {/* Demo Header */}
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="text-4xl">{currentDemo.icon}</span>
                    {currentDemo.name}
                  </h1>
                  <p className="text-gray-400 mt-1">{currentDemo.description}</p>
                </div>
                <StreamIndicator active={isStreaming} size="lg" />
              </div>
            </motion.div>

            {/* Widget Grid based on active demo */}
            {activeDemo === 'iot' && <IoTDemoWidgets />}
            {activeDemo === 'trading' && <TradingDemoWidgets />}
            {activeDemo === 'chat' && <ChatDemoWidgets />}
            {activeDemo === 'files' && <FilesDemoWidgets />}
            {activeDemo === 'analytics' && <AnalyticsDemoWidgets />}
          </div>
        </main>
      </div>
    </div>
  );
}

// IoT Demo Widgets
function IoTDemoWidgets() {
  return (
    <WidgetGrid columns={4} gap="md">
      {/* Device Status Overview */}
      <WidgetCard
        title="Device Status"
        subtitle="Real-time monitoring"
        size="medium"
        glowColor="orange"
      >
        <div className="space-y-4">
          <MetricBadge
            label="Online Devices"
            value="42"
            trend="up"
            trendValue="+5"
            color="success"
          />
          <MetricBadge
            label="Offline Devices"
            value="3"
            trend="down"
            trendValue="-2"
            color="error"
          />
          <MetricBadge
            label="Alerts"
            value="7"
            trend="stable"
            color="warning"
          />
        </div>
      </WidgetCard>

      {/* Telemetry Stream */}
      <WidgetCard
        title="Live Telemetry"
        subtitle="Streaming data"
        size="large"
        glowColor="green"
      >
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">
            <StreamIndicator active={true} label="Receiving telemetry..." />
            <div className="mt-4 text-center">
              <p className="text-2xl font-mono">23.5°C</p>
              <p className="text-sm text-gray-400">Temperature</p>
            </div>
          </div>
        </div>
      </WidgetCard>

      {/* Device List */}
      <WidgetCard
        title="Device List"
        size="medium"
      >
        <div className="space-y-2">
          {['Device-001', 'Device-002', 'Device-003'].map((device) => (
            <div
              key={device}
              className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{device}</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Control Panel */}
      <WidgetCard
        title="Device Control"
        size="small"
        interactive
        glowColor="orange"
      >
        <div className="space-y-3">
          <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 rounded-lg transition-colors">
            Start All
          </button>
          <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 rounded-lg transition-colors">
            Stop All
          </button>
          <button className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors">
            Restart
          </button>
        </div>
      </WidgetCard>
    </WidgetGrid>
  );
}

// Trading Demo Widgets
function TradingDemoWidgets() {
  return (
    <WidgetGrid columns={4} gap="md">
      <WidgetCard
        title="Portfolio Value"
        size="small"
        glowColor="blue"
      >
        <div className="text-center">
          <p className="text-3xl font-bold">$125,432</p>
          <p className="text-sm text-green-400 mt-2">+2.4% today</p>
        </div>
      </WidgetCard>

      <WidgetCard
        title="Market Data"
        subtitle="Live prices"
        size="large"
      >
        <div className="h-64 flex items-center justify-center text-gray-500">
          Price chart will appear here
        </div>
      </WidgetCard>

      <WidgetCard
        title="Order Book"
        size="medium"
      >
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-red-400">45,234.50</span>
            <span>0.5 BTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">45,233.00</span>
            <span>1.2 BTC</span>
          </div>
          <div className="border-t border-gray-700 my-2"></div>
          <div className="flex justify-between">
            <span className="text-green-400">45,230.00</span>
            <span>0.8 BTC</span>
          </div>
        </div>
      </WidgetCard>
    </WidgetGrid>
  );
}

// Chat Demo Widgets
function ChatDemoWidgets() {
  return (
    <WidgetGrid columns={3} gap="md">
      <WidgetCard
        title="Chat Rooms"
        size="small"
      >
        <div className="space-y-2">
          {['General', 'Tech', 'Random'].map((room) => (
            <div key={room} className="p-2 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70">
              {room}
            </div>
          ))}
        </div>
      </WidgetCard>

      <WidgetCard
        title="Messages"
        size="large"
        glowColor="purple"
      >
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chat messages will stream here
        </div>
      </WidgetCard>

      <WidgetCard
        title="Online Users"
        size="small"
      >
        <div className="space-y-2">
          {['Alice', 'Bob', 'Charlie'].map((user) => (
            <div key={user} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm">{user}</span>
            </div>
          ))}
        </div>
      </WidgetCard>
    </WidgetGrid>
  );
}

// Files Demo Widgets
function FilesDemoWidgets() {
  return (
    <WidgetGrid columns={3} gap="md">
      <WidgetCard
        title="Upload Progress"
        size="medium"
        glowColor="green"
      >
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>document.pdf</span>
              <span>45%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div className="w-[45%] h-full bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </WidgetCard>

      <WidgetCard
        title="File List"
        size="large"
      >
        <div className="space-y-2">
          {['document.pdf', 'image.png', 'data.xlsx'].map((file) => (
            <div key={file} className="p-3 bg-gray-800/50 rounded flex justify-between items-center">
              <span className="text-sm">{file}</span>
              <button className="text-xs text-blue-400 hover:text-blue-300">Download</button>
            </div>
          ))}
        </div>
      </WidgetCard>
    </WidgetGrid>
  );
}

// Analytics Demo Widgets
function AnalyticsDemoWidgets() {
  return (
    <WidgetGrid columns={4} gap="md">
      <WidgetCard
        title="Revenue"
        size="small"
        glowColor="orange"
      >
        <div className="text-center">
          <p className="text-3xl font-bold">$125K</p>
          <p className="text-sm text-gray-400 mt-2">This month</p>
        </div>
      </WidgetCard>

      <WidgetCard
        title="Active Users"
        size="small"
      >
        <div className="text-center">
          <p className="text-3xl font-bold">4,523</p>
          <p className="text-sm text-green-400 mt-2">+12% from last week</p>
        </div>
      </WidgetCard>

      <WidgetCard
        title="Performance Metrics"
        size="large"
      >
        <div className="h-48 flex items-center justify-center text-gray-500">
          Analytics chart will appear here
        </div>
      </WidgetCard>

      <WidgetCard
        title="System Health"
        size="medium"
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">CPU Usage</span>
            <span className="text-sm">45%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Memory</span>
            <span className="text-sm">2.3 GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Uptime</span>
            <span className="text-sm text-green-400">99.98%</span>
          </div>
        </div>
      </WidgetCard>
    </WidgetGrid>
  );
}