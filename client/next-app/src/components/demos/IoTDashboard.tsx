'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { useGrpcConnection } from '@/hooks/useGrpcConnection';
import useAppStore, { useIoTData } from '@/store/appStore';

interface ChartData {
  time: string;
  value: number;
}

export function IoTDashboard() {
  const { services } = useGrpcConnection();
  const { telemetryData, alerts, addTelemetryData, addAlert, setSelectedDevices } = useAppStore();
  const iotData = useIoTData();
  const [temperatureHistory, setTemperatureHistory] = useState<ChartData[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<ChartData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('device-1');

  useEffect(() => {
    if (!services?.iot) return;

    // Subscribe to device telemetry
    const devices = ['device-1', 'device-2', 'device-3'];
    setSelectedDevices(devices);

    const unsubscribeTelemetry = services.iot.streamDeviceTelemetry(
      { deviceIds: devices },
      (data) => {
        addTelemetryData(data);
        
        // Update history for charts
        if (data.deviceId === selectedDevice) {
          const time = new Date(data.timestamp).toLocaleTimeString();
          
          setTemperatureHistory(prev => [...prev.slice(-20), { 
            time, 
            value: data.metrics.temperature 
          }]);
          
          setHumidityHistory(prev => [...prev.slice(-20), { 
            time, 
            value: data.metrics.humidity 
          }]);
        }
      }
    );

    const unsubscribeAlerts = services.iot.streamAlerts(
      {},
      (alert) => {
        addAlert(alert);
      }
    );

    return () => {
      unsubscribeTelemetry();
      unsubscribeAlerts();
    };
  }, [services, selectedDevice, addTelemetryData, addAlert, setSelectedDevices]);

  const currentData = telemetryData.get(selectedDevice);

  return (
    <div className="space-y-6">
      {/* Device Selector */}
      <div className="flex gap-2">
        {['device-1', 'device-2', 'device-3'].map(deviceId => (
          <button
            key={deviceId}
            onClick={() => setSelectedDevice(deviceId)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedDevice === deviceId 
                ? 'bg-[var(--primary)] text-white' 
                : 'bg-[var(--surface)] hover:bg-[var(--surface)]/80'
            }`}
          >
            {deviceId}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          title="Temperature"
          subtitle="Current reading"
          icon={<Thermometer />}
          size="small"
          glowColor="var(--primary)"
        >
          <div className="text-3xl font-bold">
            {currentData?.metrics.temperature?.toFixed(1) || '--'}°C
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {currentData?.status || 'offline'}
          </div>
        </WidgetCard>

        <WidgetCard
          title="Humidity"
          subtitle="Current reading"
          icon={<Droplets />}
          size="small"
          glowColor="var(--secondary)"
        >
          <div className="text-3xl font-bold">
            {currentData?.metrics.humidity?.toFixed(1) || '--'}%
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {currentData?.status || 'offline'}
          </div>
        </WidgetCard>

        <WidgetCard
          title="Pressure"
          subtitle="Current reading"
          icon={<Wind />}
          size="small"
          glowColor="var(--accent)"
        >
          <div className="text-3xl font-bold">
            {currentData?.metrics.pressure?.toFixed(0) || '--'} hPa
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {currentData?.status || 'offline'}
          </div>
        </WidgetCard>

        <WidgetCard
          title="Active Alerts"
          subtitle="Last 24 hours"
          icon={<AlertTriangle />}
          size="small"
          glowColor={alerts.length > 0 ? '#EF4444' : 'var(--primary)'}
        >
          <div className="text-3xl font-bold">
            {alerts.filter(a => a.deviceId === selectedDevice).length}
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {alerts.filter(a => a.severity === 'critical').length} critical
          </div>
        </WidgetCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetCard
          title="Temperature Trend"
          subtitle={`Device: ${selectedDevice}`}
          icon={<Activity />}
          size="medium"
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={temperatureHistory}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--primary)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--primary)" 
                fillOpacity={1} 
                fill="url(#tempGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </WidgetCard>

        <WidgetCard
          title="Humidity Trend"
          subtitle={`Device: ${selectedDevice}`}
          icon={<Activity />}
          size="medium"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={humidityHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--secondary)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--secondary)" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </WidgetCard>
      </div>

      {/* Alerts List */}
      <WidgetCard
        title="Recent Alerts"
        subtitle="All devices"
        icon={<AlertTriangle />}
        size="large"
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.severity === 'critical' 
                  ? 'border-red-500 bg-red-500/10' 
                  : alert.severity === 'warning'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-blue-500 bg-blue-500/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{alert.deviceId}</span>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {alert.message}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500 text-white' 
                    : alert.severity === 'warning'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-blue-500 text-white'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center text-[var(--text-muted)] py-8">
              No alerts yet
            </div>
          )}
        </div>
      </WidgetCard>
    </div>
  );
}