# Advanced SPA Architecture - Multi-Demo Interface

## Overview
A sophisticated single-page application showcasing 8 different gRPC communication patterns through real-world use cases, organized in a modern tabbed interface.

## UI Architecture

### Layout Structure
```
┌──────────────────────────────────────────────────────────────┐
│                         Header Bar                           │
│  Logo | Demo Selector | Connection Status | Settings | User  │
├───────┬───────────────────────────────────────────────────────┤
│       │                                                       │
│   V   │                     Main Content Area                │
│   e   │                                                       │
│   r   │   ┌─────────────────────────────────────────────┐   │
│   t   │   │                                             │   │
│   i   │   │         Active Demo Component               │   │
│   c   │   │                                             │   │
│   a   │   │   (IoT Monitor, Chat, Trading, etc.)       │   │
│   l   │   │                                             │   │
│       │   └─────────────────────────────────────────────┘   │
│   T   │                                                       │
│   a   │   ┌─────────────────────────────────────────────┐   │
│   b   │   │         Secondary Panel (Optional)          │   │
│   s   │   │     (Logs, Metrics, Code View, etc.)        │   │
│       │   └─────────────────────────────────────────────┘   │
├───────┴───────────────────────────────────────────────────────┤
│                      Status Bar                              │
│  Stream Status | Messages/sec | Latency | Memory | CPU       │
└───────────────────────────────────────────────────────────────┘
```

### Navigation Design

#### Vertical Tab System
```tsx
interface TabConfig {
  id: string;
  title: string;
  icon: ReactNode;
  pattern: 'unary' | 'server-stream' | 'client-stream' | 'bidi-stream';
  color: string;
  component: LazyExoticComponent<ComponentType>;
  description: string;
  badge?: string | number;
}

const demoTabs: TabConfig[] = [
  {
    id: 'iot',
    title: 'IoT Monitor',
    icon: <IoTIcon />,
    pattern: 'server-stream',
    color: '#10B981',
    component: lazy(() => import('./demos/IoTMonitor')),
    description: 'Real-time device telemetry streaming',
    badge: 'LIVE'
  },
  {
    id: 'trading',
    title: 'Trading Dashboard',
    icon: <ChartIcon />,
    pattern: 'server-stream',
    color: '#3B82F6',
    component: lazy(() => import('./demos/Trading')),
    description: 'Live market data and portfolio tracking'
  },
  {
    id: 'chat',
    title: 'Chat & Collab',
    icon: <ChatIcon />,
    pattern: 'bidi-stream',
    color: '#8B5CF6',
    component: lazy(() => import('./demos/Chat')),
    description: 'Real-time messaging and collaboration'
  },
  // ... more tabs
];
```

### Component Architecture

#### 1. App Shell Component
```tsx
// components/AppShell.tsx
export function AppShell() {
  const [activeDemo, setActiveDemo] = useState<string>('iot');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  return (
    <div className="app-shell">
      <Header>
        <Logo />
        <DemoSelector
          value={activeDemo}
          onChange={setActiveDemo}
        />
        <ConnectionIndicator />
        <ThemeToggle />
        <UserMenu />
      </Header>

      <div className="app-body">
        <VerticalTabs
          tabs={demoTabs}
          activeTab={activeDemo}
          onTabChange={setActiveDemo}
          collapsed={sidebarCollapsed}
        />

        <main className="demo-container">
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<DemoLoading />}>
              <DemoRouter activeDemo={activeDemo} />
            </Suspense>
          </ErrorBoundary>

          {showMetrics && (
            <MetricsPanel
              demo={activeDemo}
              onClose={() => setShowMetrics(false)}
            />
          )}
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
```

#### 2. Vertical Tabs Component
```tsx
// components/VerticalTabs.tsx
export function VerticalTabs({ tabs, activeTab, onTabChange, collapsed }) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <nav className={`vertical-tabs ${collapsed ? 'collapsed' : ''}`}>
      <div className="tabs-header">
        <h2>{!collapsed && 'Demos'}</h2>
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className="tabs-list">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            onHoverStart={() => setHoveredTab(tab.id)}
            onHoverEnd={() => setHoveredTab(null)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="tab-content">
              <span className="tab-icon" style={{ color: tab.color }}>
                {tab.icon}
              </span>

              {!collapsed && (
                <>
                  <div className="tab-text">
                    <span className="tab-title">{tab.title}</span>
                    <span className="tab-pattern">{tab.pattern}</span>
                  </div>

                  {tab.badge && (
                    <Badge variant="pulse">{tab.badge}</Badge>
                  )}
                </>
              )}
            </div>

            {collapsed && hoveredTab === tab.id && (
              <Tooltip side="right">
                <strong>{tab.title}</strong>
                <p>{tab.description}</p>
              </Tooltip>
            )}

            {activeTab === tab.id && (
              <motion.div
                className="active-indicator"
                layoutId="activeTab"
                style={{ backgroundColor: tab.color }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="tabs-footer">
        <button className="help-button">
          <HelpIcon />
          {!collapsed && 'Documentation'}
        </button>
      </div>
    </nav>
  );
}
```

### State Management Architecture

#### Global State (Zustand)
```typescript
// store/globalStore.ts
interface GlobalState {
  // Connection
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connectionLatency: number;

  // Active Demo
  activeDemo: string;
  demoStates: Map<string, any>;

  // Metrics
  messagesPerSecond: number;
  totalMessages: number;
  errorCount: number;

  // UI Preferences
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  metricsVisible: boolean;

  // Actions
  setActiveDemo: (demo: string) => void;
  updateConnectionStatus: (status: ConnectionStatus) => void;
  updateMetrics: (metrics: Partial<Metrics>) => void;
  toggleSidebar: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        connectionStatus: 'disconnected',
        connectionLatency: 0,
        activeDemo: 'iot',
        demoStates: new Map(),
        messagesPerSecond: 0,
        totalMessages: 0,
        errorCount: 0,
        theme: 'system',
        sidebarCollapsed: false,
        metricsVisible: true,

        setActiveDemo: (demo) => set({ activeDemo: demo }),

        updateConnectionStatus: (status) => set((state) => ({
          connectionStatus: status.connected ? 'connected' : 'disconnected',
          connectionLatency: status.latency,
        })),

        updateMetrics: (metrics) => set((state) => ({
          ...state,
          ...metrics,
        })),

        toggleSidebar: () => set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
      }),
      {
        name: 'grpc-demo-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          activeDemo: state.activeDemo,
        }),
      }
    )
  )
);
```

### Shared Components Library

#### 1. Connection Manager
```tsx
// components/shared/ConnectionManager.tsx
export function ConnectionManager({ children }: { children: ReactNode }) {
  const { updateConnectionStatus } = useGlobalStore();
  const [grpcClient, setGrpcClient] = useState<GrpcWebClient | null>(null);

  useEffect(() => {
    const client = new GrpcWebClient(GRPC_WEB_URL, {
      onConnect: () => updateConnectionStatus({ connected: true }),
      onDisconnect: () => updateConnectionStatus({ connected: false }),
      onError: (error) => console.error('gRPC error:', error),
    });

    setGrpcClient(client);

    return () => client.close();
  }, []);

  return (
    <GrpcContext.Provider value={grpcClient}>
      {children}
    </GrpcContext.Provider>
  );
}
```

#### 2. Stream Visualizer
```tsx
// components/shared/StreamVisualizer.tsx
export function StreamVisualizer({
  streamData,
  type = 'line',
  height = 300
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw visualization based on type
      switch (type) {
        case 'line':
          drawLineChart(ctx, streamData);
          break;
        case 'heatmap':
          drawHeatmap(ctx, streamData);
          break;
        case 'particles':
          drawParticles(ctx, streamData);
          break;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [streamData, type]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="stream-visualizer"
    />
  );
}
```

#### 3. Metrics Panel
```tsx
// components/shared/MetricsPanel.tsx
export function MetricsPanel({ demo, onClose }) {
  const metrics = useMetrics(demo);

  return (
    <motion.div
      className="metrics-panel"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="metrics-header">
        <h3>Performance Metrics</h3>
        <button onClick={onClose}><CloseIcon /></button>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Messages/sec"
          value={metrics.messagesPerSecond}
          trend={metrics.messageTrend}
          sparkline={metrics.messageHistory}
        />

        <MetricCard
          label="Latency"
          value={`${metrics.latency}ms`}
          trend={metrics.latencyTrend}
          threshold={{ warning: 100, critical: 500 }}
        />

        <MetricCard
          label="Memory Usage"
          value={`${metrics.memoryMB}MB`}
          trend={metrics.memoryTrend}
          max={500}
        />

        <MetricCard
          label="Error Rate"
          value={`${metrics.errorRate}%`}
          trend={metrics.errorTrend}
          threshold={{ warning: 1, critical: 5 }}
        />
      </div>

      <div className="metrics-charts">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={metrics.history}>
            <Area
              type="monotone"
              dataKey="messages"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
```

### Performance Optimizations

#### 1. Code Splitting
```typescript
// Route-based code splitting
const demos = {
  iot: lazy(() => import('./demos/IoTMonitor')),
  trading: lazy(() => import('./demos/Trading')),
  chat: lazy(() => import('./demos/Chat')),
  files: lazy(() => import('./demos/FileManager')),
  analytics: lazy(() => import('./demos/Analytics')),
  video: lazy(() => import('./demos/VideoProcessor')),
  game: lazy(() => import('./demos/GameLobby')),
  editor: lazy(() => import('./demos/CodeEditor')),
};
```

#### 2. Virtual Scrolling
```tsx
// For large lists and data tables
import { VirtualList } from '@tanstack/react-virtual';

export function VirtualDataTable({ data, columns }) {
  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="virtual-table">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <DataRow
            key={virtualRow.index}
            data={data[virtualRow.index]}
            columns={columns}
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3. Web Workers for Heavy Processing
```typescript
// workers/dataProcessor.worker.ts
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'PROCESS_TELEMETRY':
      const processed = processTelemetryData(data);
      self.postMessage({ type: 'TELEMETRY_PROCESSED', data: processed });
      break;

    case 'AGGREGATE_METRICS':
      const aggregated = aggregateMetrics(data);
      self.postMessage({ type: 'METRICS_AGGREGATED', data: aggregated });
      break;
  }
});
```

### Responsive Design

#### Breakpoints
```scss
// styles/breakpoints.scss
$breakpoints: (
  mobile: 640px,
  tablet: 768px,
  laptop: 1024px,
  desktop: 1280px,
  wide: 1536px
);

@mixin responsive($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

#### Mobile Layout
```tsx
// Adaptive layout for mobile
export function MobileLayout() {
  const [activeDemo, setActiveDemo] = useState('iot');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mobile-layout">
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />

      <SwipeableDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <DemoList
          onSelect={(demo) => {
            setActiveDemo(demo);
            setDrawerOpen(false);
          }}
        />
      </SwipeableDrawer>

      <main className="mobile-content">
        <DemoRouter activeDemo={activeDemo} />
      </main>

      <BottomNavigation value={activeDemo} onChange={setActiveDemo} />
    </div>
  );
}
```

### Testing Strategy

#### Component Testing
```tsx
// __tests__/VerticalTabs.test.tsx
describe('VerticalTabs', () => {
  test('renders all demo tabs', () => {
    render(<VerticalTabs tabs={demoTabs} activeTab="iot" />);

    expect(screen.getByText('IoT Monitor')).toBeInTheDocument();
    expect(screen.getByText('Trading Dashboard')).toBeInTheDocument();
  });

  test('switches active tab on click', () => {
    const onChange = jest.fn();
    render(
      <VerticalTabs
        tabs={demoTabs}
        activeTab="iot"
        onTabChange={onChange}
      />
    );

    fireEvent.click(screen.getByText('Chat & Collab'));
    expect(onChange).toHaveBeenCalledWith('chat');
  });
});
```

## Deployment Configuration

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    optimizeCss: true,
  },

  images: {
    domains: ['localhost', 'api.example.com'],
  },

  async rewrites() {
    return [
      {
        source: '/grpc/:path*',
        destination: `${process.env.NEXT_PUBLIC_GRPC_WEB_URL}/:path*`,
      },
    ];
  },
};
```

## Success Metrics

- **Performance**: Lighthouse score > 95
- **Bundle Size**: < 250KB initial JS
- **Time to Interactive**: < 2s
- **Stream Latency**: < 50ms
- **Memory Usage**: < 100MB baseline
- **60fps**: Smooth animations
- **Accessibility**: WCAG 2.1 AA compliant