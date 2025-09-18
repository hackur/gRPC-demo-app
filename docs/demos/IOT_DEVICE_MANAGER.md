# IoT Device Manager - Detailed Implementation Plan

## Overview
A comprehensive IoT device management system demonstrating **server streaming RPC** pattern for real-time device telemetry, status updates, and alerts.

## Core Features
- Real-time device telemetry streaming
- Device health monitoring and alerts
- Command execution and control
- Historical data visualization
- Device grouping and filtering
- Alert management system
- Firmware update management

## Technical Architecture

### gRPC Service Definition
```protobuf
syntax = "proto3";
package iot;

service IoTDeviceService {
  // Server streaming - Real-time telemetry
  rpc StreamDeviceTelemetry(DeviceStreamRequest) returns (stream TelemetryData);

  // Server streaming - Device status updates
  rpc StreamDeviceStatus(StatusStreamRequest) returns (stream DeviceStatus);

  // Server streaming - Alert notifications
  rpc StreamAlerts(AlertStreamRequest) returns (stream Alert);

  // Unary - Device management operations
  rpc GetDevice(GetDeviceRequest) returns (Device);
  rpc ListDevices(ListDevicesRequest) returns (DeviceList);
  rpc UpdateDevice(UpdateDeviceRequest) returns (Device);
  rpc SendCommand(CommandRequest) returns (CommandResponse);
  rpc GetDeviceHistory(HistoryRequest) returns (HistoryResponse);

  // Unary - Device grouping
  rpc CreateDeviceGroup(CreateGroupRequest) returns (DeviceGroup);
  rpc UpdateDeviceGroup(UpdateGroupRequest) returns (DeviceGroup);

  // Client streaming - Batch device registration
  rpc RegisterDevices(stream Device) returns (RegistrationSummary);
}

// Message definitions
message Device {
  string id = 1;
  string name = 2;
  DeviceType type = 3;
  string location = 4;
  string firmware_version = 5;
  ConnectionStatus connection_status = 6;
  map<string, string> metadata = 7;
  int64 last_seen = 8;
  repeated string group_ids = 9;
}

message TelemetryData {
  string device_id = 1;
  int64 timestamp = 2;
  map<string, SensorReading> sensors = 3;
  DeviceMetrics metrics = 4;
}

message SensorReading {
  double value = 1;
  string unit = 2;
  SensorStatus status = 3;
  double min_threshold = 4;
  double max_threshold = 5;
}

message DeviceMetrics {
  double cpu_usage = 1;
  double memory_usage = 2;
  double disk_usage = 3;
  double battery_level = 4;
  int32 network_latency = 5;
  double temperature = 6;
}

message Alert {
  string id = 1;
  string device_id = 2;
  AlertSeverity severity = 3;
  string title = 4;
  string message = 5;
  int64 timestamp = 6;
  AlertType type = 7;
  map<string, string> context = 8;
}

enum DeviceType {
  DEVICE_TYPE_UNSPECIFIED = 0;
  SENSOR = 1;
  ACTUATOR = 2;
  GATEWAY = 3;
  CAMERA = 4;
  THERMOSTAT = 5;
  SMART_LOCK = 6;
  INDUSTRIAL_SENSOR = 7;
}

enum ConnectionStatus {
  CONNECTION_STATUS_UNSPECIFIED = 0;
  ONLINE = 1;
  OFFLINE = 2;
  CONNECTING = 3;
  ERROR = 4;
}

enum AlertSeverity {
  ALERT_SEVERITY_UNSPECIFIED = 0;
  INFO = 1;
  WARNING = 2;
  ERROR = 3;
  CRITICAL = 4;
}
```

### Frontend Architecture

#### Component Structure
```
iot-device-manager/
├── components/
│   ├── DeviceList/
│   │   ├── DeviceCard.tsx
│   │   ├── DeviceGrid.tsx
│   │   └── DeviceFilters.tsx
│   ├── Telemetry/
│   │   ├── TelemetryChart.tsx
│   │   ├── MetricsDisplay.tsx
│   │   └── SensorGauge.tsx
│   ├── Alerts/
│   │   ├── AlertFeed.tsx
│   │   ├── AlertNotification.tsx
│   │   └── AlertHistory.tsx
│   ├── Controls/
│   │   ├── CommandPanel.tsx
│   │   ├── DeviceActions.tsx
│   │   └── GroupManager.tsx
│   └── Visualization/
│       ├── DeviceMap.tsx
│       ├── NetworkTopology.tsx
│       └── HistoricalChart.tsx
├── hooks/
│   ├── useDeviceStream.ts
│   ├── useTelemetry.ts
│   ├── useAlerts.ts
│   └── useDeviceControl.ts
├── store/
│   ├── deviceStore.ts
│   ├── telemetryStore.ts
│   └── alertStore.ts
└── utils/
    ├── streamManager.ts
    ├── dataAggregator.ts
    └── alertProcessor.ts
```

#### Key React Components

##### 1. Main Dashboard Component
```tsx
// components/IoTDashboard.tsx
export function IoTDashboard() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [timeRange, setTimeRange] = useState<TimeRange>({ start: -3600, end: 0 });

  return (
    <div className="iot-dashboard">
      <Header>
        <DeviceStats />
        <AlertSummary />
        <ConnectionStatus />
      </Header>

      <div className="dashboard-grid">
        <aside className="device-sidebar">
          <DeviceFilters />
          <DeviceGroups />
          <QuickActions />
        </aside>

        <main className="device-content">
          <ViewModeSelector value={viewMode} onChange={setViewMode} />

          {viewMode === 'grid' && <DeviceGrid devices={devices} />}
          {viewMode === 'list' && <DeviceList devices={devices} />}
          {viewMode === 'map' && <DeviceMap devices={devices} />}

          <TelemetryPanel selectedDevices={selectedDevices} />
        </main>

        <aside className="alert-sidebar">
          <AlertFeed />
          <SystemHealth />
        </aside>
      </div>
    </div>
  );
}
```

##### 2. Real-time Telemetry Display
```tsx
// components/Telemetry/TelemetryPanel.tsx
export function TelemetryPanel({ deviceIds }: { deviceIds: string[] }) {
  const { telemetryData, isStreaming } = useTelemetryStream(deviceIds);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');

  return (
    <div className="telemetry-panel">
      <div className="telemetry-header">
        <h3>Real-time Telemetry</h3>
        <StreamingIndicator active={isStreaming} />
        <ChartTypeSelector value={chartType} onChange={setChartType} />
      </div>

      <div className="metrics-grid">
        {telemetryData.map(device => (
          <DeviceMetrics key={device.id} data={device} />
        ))}
      </div>

      <div className="charts-container">
        <ResponsiveChart
          data={telemetryData}
          type={chartType}
          streaming={isStreaming}
        />
      </div>

      <div className="sensor-gauges">
        {telemetryData.flatMap(d => d.sensors).map(sensor => (
          <SensorGauge
            key={sensor.id}
            sensor={sensor}
            animated={isStreaming}
          />
        ))}
      </div>
    </div>
  );
}
```

##### 3. Stream Management Hook
```tsx
// hooks/useTelemetryStream.ts
export function useTelemetryStream(deviceIds: string[]) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<grpc.ClientReadableStream<TelemetryData> | null>(null);

  useEffect(() => {
    if (deviceIds.length === 0) return;

    const startStream = async () => {
      setIsStreaming(true);

      const request = new DeviceStreamRequest();
      request.setDeviceIdsList(deviceIds);
      request.setIncludeMetrics(true);

      streamRef.current = grpcClient.streamDeviceTelemetry(request);

      streamRef.current.on('data', (data: TelemetryData) => {
        setTelemetryData(prev => {
          // Keep last 100 data points per device
          const updated = [...prev, data];
          return updated.slice(-100 * deviceIds.length);
        });
      });

      streamRef.current.on('error', (err) => {
        console.error('Stream error:', err);
        setIsStreaming(false);
        // Implement reconnection logic
        setTimeout(startStream, 5000);
      });

      streamRef.current.on('end', () => {
        setIsStreaming(false);
      });
    };

    startStream();

    return () => {
      streamRef.current?.cancel();
    };
  }, [deviceIds]);

  return { telemetryData, isStreaming };
}
```

### State Management (Zustand)
```typescript
// store/deviceStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DeviceState {
  devices: Map<string, Device>;
  selectedDevices: Set<string>;
  telemetryBuffer: Map<string, TelemetryData[]>;
  alerts: Alert[];

  // Actions
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  selectDevice: (id: string) => void;
  deselectDevice: (id: string) => void;
  addTelemetryData: (deviceId: string, data: TelemetryData) => void;
  addAlert: (alert: Alert) => void;
  clearOldTelemetry: (maxAge: number) => void;
}

export const useDeviceStore = create<DeviceState>()(
  devtools(
    persist(
      (set, get) => ({
        devices: new Map(),
        selectedDevices: new Set(),
        telemetryBuffer: new Map(),
        alerts: [],

        addDevice: (device) => set((state) => {
          const devices = new Map(state.devices);
          devices.set(device.id, device);
          return { devices };
        }),

        addTelemetryData: (deviceId, data) => set((state) => {
          const buffer = new Map(state.telemetryBuffer);
          const deviceData = buffer.get(deviceId) || [];
          deviceData.push(data);

          // Keep only last 1000 points
          if (deviceData.length > 1000) {
            deviceData.shift();
          }

          buffer.set(deviceId, deviceData);
          return { telemetryBuffer: buffer };
        }),

        // ... other actions
      }),
      {
        name: 'iot-device-store',
        partialize: (state) => ({
          devices: Array.from(state.devices.entries()),
          selectedDevices: Array.from(state.selectedDevices),
        }),
      }
    )
  )
);
```

### UI Features

#### 1. Device Grid View
- Card-based layout with device status
- Real-time status indicators
- Quick actions menu
- Mini telemetry sparklines

#### 2. Real-time Telemetry Visualization
- Multi-series line charts
- Gauge displays for critical metrics
- Heat maps for sensor arrays
- Time-series data with zoom/pan

#### 3. Alert Management
- Toast notifications for critical alerts
- Alert timeline view
- Alert filtering and search
- Acknowledgment workflow

#### 4. Device Control Panel
- Command execution interface
- Firmware update management
- Configuration editor
- Batch operations

#### 5. Analytics Dashboard
- Device uptime statistics
- Performance metrics aggregation
- Predictive maintenance indicators
- Historical trend analysis

### Performance Optimizations

#### 1. Data Management
```typescript
// Efficient telemetry data buffering
class TelemetryBuffer {
  private buffer: Map<string, CircularBuffer<TelemetryData>>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.buffer = new Map();
    this.maxSize = maxSize;
  }

  add(deviceId: string, data: TelemetryData) {
    if (!this.buffer.has(deviceId)) {
      this.buffer.set(deviceId, new CircularBuffer(this.maxSize));
    }
    this.buffer.get(deviceId)!.push(data);
  }

  getRecent(deviceId: string, count: number): TelemetryData[] {
    return this.buffer.get(deviceId)?.getRecent(count) || [];
  }
}
```

#### 2. Stream Reconnection
```typescript
class StreamManager {
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  async connectWithRetry() {
    let attempts = 0;

    while (true) {
      try {
        await this.connect();
        this.reconnectDelay = 1000; // Reset on success
        break;
      } catch (error) {
        attempts++;
        const delay = Math.min(
          this.reconnectDelay * Math.pow(2, attempts),
          this.maxReconnectDelay
        );
        await sleep(delay);
      }
    }
  }
}
```

### Testing Strategy

#### Unit Tests
```typescript
describe('TelemetryStream', () => {
  test('handles stream data correctly', async () => {
    const mockStream = createMockStream();
    const handler = new TelemetryHandler();

    mockStream.emit('data', mockTelemetryData);

    expect(handler.getLatest()).toEqual(mockTelemetryData);
  });

  test('reconnects on stream error', async () => {
    // Test reconnection logic
  });
});
```

#### Integration Tests
- Test gRPC streaming with mock server
- Verify data flow from server to UI
- Test alert triggering and display
- Validate command execution flow

### Deployment Considerations

1. **WebSocket fallback** for environments without gRPC-Web support
2. **Data persistence** for offline scenarios
3. **Progressive Web App** features for mobile access
4. **Multi-tenant** support for enterprise deployments
5. **Horizontal scaling** for handling thousands of devices

### Implementation Timeline

**Week 1: Core Infrastructure**
- Set up gRPC service definitions
- Implement basic streaming endpoints
- Create device data models

**Week 2: UI Foundation**
- Build component library
- Implement device grid/list views
- Set up state management

**Week 3: Real-time Features**
- Implement telemetry streaming
- Add real-time charts
- Create alert system

**Week 4: Advanced Features**
- Add device control panel
- Implement analytics dashboard
- Add filtering and search

**Week 5: Polish & Testing**
- Performance optimization
- Comprehensive testing
- Documentation

## Success Metrics

- Handle 10,000+ concurrent device streams
- < 100ms UI update latency
- 99.9% stream uptime
- < 1% CPU usage per 100 devices
- Support 60fps chart animations