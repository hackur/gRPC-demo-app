# gRPC Demo App - Design System

## Color Palette

### Primary Colors
```scss
// Base colors from the design
$colors: (
  // Background
  'bg-primary': #0A0B0D,      // Main dark background
  'bg-secondary': #141619,     // Card background
  'bg-tertiary': #1C1F23,      // Elevated surfaces
  'bg-accent': #252A2F,        // Hover states

  // Brand Colors
  'brand-orange': #FF6B35,     // Primary accent (Oblika orange)
  'brand-coral': #E85D3C,      // Secondary accent
  'brand-peach': #FFA07A,      // Light accent

  // Text
  'text-primary': #FFFFFF,      // Primary text
  'text-secondary': #9CA3AF,    // Secondary text
  'text-tertiary': #6B7280,     // Muted text
  'text-accent': #FF6B35,       // Accent text

  // UI Elements
  'border-primary': #2A2E34,    // Card borders
  'border-secondary': #1F2329,  // Subtle borders
  'border-accent': #FF6B35,     // Active borders

  // Status Colors
  'success': #10B981,           // Green
  'warning': #F59E0B,           // Amber
  'error': #EF4444,             // Red
  'info': #3B82F6,              // Blue

  // Gradients
  'gradient-orange': linear-gradient(135deg, #FF6B35 0%, #E85D3C 100%),
  'gradient-dark': linear-gradient(180deg, #141619 0%, #0A0B0D 100%),
  'gradient-glass': linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)
);
```

## Typography

### Font Stack
```scss
// Font families
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
$font-display: 'Manrope', 'Inter', sans-serif;

// Font sizes
$font-sizes: (
  'xs': 0.75rem,      // 12px
  'sm': 0.875rem,     // 14px
  'base': 1rem,       // 16px
  'lg': 1.125rem,     // 18px
  'xl': 1.25rem,      // 20px
  '2xl': 1.5rem,      // 24px
  '3xl': 1.875rem,    // 30px
  '4xl': 2.25rem,     // 36px
  '5xl': 3rem,        // 48px
);

// Font weights
$font-weights: (
  'light': 300,
  'regular': 400,
  'medium': 500,
  'semibold': 600,
  'bold': 700,
  'extrabold': 800,
);
```

## Component Styles

### Widget Card Component
```tsx
// components/ui/WidgetCard.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WidgetCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  glowColor?: 'orange' | 'blue' | 'green' | 'purple';
  size?: 'small' | 'medium' | 'large' | 'full';
  interactive?: boolean;
}

export function WidgetCard({
  title,
  subtitle,
  icon,
  children,
  className = '',
  glowColor,
  size = 'medium',
  interactive = false
}: WidgetCardProps) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-2',
    large: 'col-span-3 row-span-2',
    full: 'col-span-4 row-span-3'
  };

  const glowColors = {
    orange: 'hover:shadow-orange-glow',
    blue: 'hover:shadow-blue-glow',
    green: 'hover:shadow-green-glow',
    purple: 'hover:shadow-purple-glow'
  };

  return (
    <motion.div
      className={`
        widget-card
        ${sizeClasses[size]}
        ${interactive ? 'cursor-pointer' : ''}
        ${glowColor ? glowColors[glowColor] : ''}
        ${className}
      `}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="widget-card-inner">
        {(title || subtitle || icon) && (
          <div className="widget-header">
            {icon && <div className="widget-icon">{icon}</div>}
            <div className="widget-titles">
              {title && <h3 className="widget-title">{title}</h3>}
              {subtitle && <p className="widget-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="widget-content">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
```

### CSS Styles
```scss
// styles/components/widget-card.scss
.widget-card {
  @apply relative overflow-hidden rounded-2xl;
  background: linear-gradient(135deg, #141619 0%, #1C1F23 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(255, 107, 53, 0.3);
    transform: translateY(-2px);
  }

  &-inner {
    @apply p-6 h-full flex flex-col;
  }

  .widget-header {
    @apply flex items-start gap-4 mb-6;
  }

  .widget-icon {
    @apply w-10 h-10 rounded-xl flex items-center justify-center;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%);

    svg {
      @apply w-6 h-6 text-orange-400;
    }
  }

  .widget-title {
    @apply text-lg font-semibold text-white mb-1;
  }

  .widget-subtitle {
    @apply text-sm text-gray-500;
  }

  .widget-content {
    @apply flex-1;
  }

  // Glow effects
  &.hover\:shadow-orange-glow:hover {
    box-shadow:
      0 0 20px rgba(255, 107, 53, 0.3),
      0 0 40px rgba(255, 107, 53, 0.1),
      inset 0 0 20px rgba(255, 107, 53, 0.05);
  }
}
```

## Layout Structure

### Main Dashboard Layout
```tsx
// app/dashboard/layout.tsx
export function DashboardLayout() {
  return (
    <div className="dashboard-container">
      {/* Sidebar with logo badges like in the screenshot */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Logo />
        </div>

        <nav className="sidebar-nav">
          <AppBadge
            icon={<IoTIcon />}
            label="IoT Monitor"
            active
            color="orange"
          />
          <AppBadge
            icon={<ChartIcon />}
            label="Trading"
            color="blue"
          />
          <AppBadge
            icon={<ChatIcon />}
            label="Chat"
            color="purple"
          />
        </nav>
      </aside>

      {/* Main content area with widget grid */}
      <main className="main-content">
        <div className="widget-grid">
          {/* Widgets arranged in a responsive grid */}
        </div>
      </main>
    </div>
  );
}
```

### Widget Grid System
```scss
// styles/layouts/widget-grid.scss
.widget-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 1536px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
```

## Component Library

### 1. Stats Widget
```tsx
// components/widgets/StatsWidget.tsx
export function StatsWidget({
  title,
  value,
  change,
  trend,
  icon,
  color = 'orange'
}) {
  return (
    <WidgetCard size="small" glowColor={color}>
      <div className="stats-widget">
        <div className="stats-header">
          <span className="stats-title">{title}</span>
          {icon}
        </div>

        <div className="stats-value">
          {value}
        </div>

        <div className="stats-footer">
          <TrendIndicator value={change} direction={trend} />
          <SparklineChart data={recentData} color={color} />
        </div>
      </div>
    </WidgetCard>
  );
}
```

### 2. Chart Widget
```tsx
// components/widgets/ChartWidget.tsx
export function ChartWidget({
  title,
  data,
  type = 'area',
  height = 300
}) {
  return (
    <WidgetCard title={title} size="large">
      <div className="chart-widget">
        <div className="chart-controls">
          <TimeRangeSelector />
          <ChartTypeToggle />
        </div>

        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FF6B35"
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
```

### 3. Data Table Widget
```tsx
// components/widgets/DataTableWidget.tsx
export function DataTableWidget({
  title,
  columns,
  data,
  onRowClick
}) {
  return (
    <WidgetCard title={title} size="large">
      <div className="data-table-widget">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {columns.map(col => (
                <th key={col.key} className="text-left text-gray-400 font-medium py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <motion.tr
                key={idx}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                onClick={() => onRowClick?.(row)}
                whileHover={{ x: 4 }}
              >
                {columns.map(col => (
                  <td key={col.key} className="py-3 text-gray-300">
                    {row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
```

### 4. Live Stream Widget
```tsx
// components/widgets/LiveStreamWidget.tsx
export function LiveStreamWidget({
  title,
  streamData,
  visualization = 'waveform'
}) {
  return (
    <WidgetCard
      title={title}
      size="medium"
      glowColor="green"
      icon={<PulseIcon className="animate-pulse" />}
    >
      <div className="stream-widget">
        <StreamStatus connected={isConnected} />

        <div className="stream-visualization">
          {visualization === 'waveform' && (
            <WaveformVisualizer data={streamData} />
          )}
          {visualization === 'particles' && (
            <ParticleFlow data={streamData} />
          )}
        </div>

        <div className="stream-stats">
          <StatBadge label="msg/s" value={messagesPerSecond} />
          <StatBadge label="latency" value={`${latency}ms`} />
        </div>
      </div>
    </WidgetCard>
  );
}
```

## Animations

### Framer Motion Variants
```typescript
// utils/animations.ts
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
    },
  },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'loop',
  },
};

export const glowAnimation = {
  boxShadow: [
    '0 0 20px rgba(255, 107, 53, 0)',
    '0 0 40px rgba(255, 107, 53, 0.3)',
    '0 0 20px rgba(255, 107, 53, 0)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};
```

## Global Styles

### Base Styles
```scss
// styles/globals.scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #0A0B0D;
  --bg-secondary: #141619;
  --bg-tertiary: #1C1F23;
  --brand-orange: #FF6B35;
  --brand-coral: #E85D3C;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-primary);
  color: #FFFFFF;
  line-height: 1.6;
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 4px;

  &:hover {
    background: var(--brand-orange);
  }
}
```

## Responsive Utilities

### Breakpoint Mixins
```scss
// styles/mixins.scss
@mixin mobile {
  @media (max-width: 640px) { @content; }
}

@mixin tablet {
  @media (min-width: 641px) and (max-width: 1024px) { @content; }
}

@mixin laptop {
  @media (min-width: 1025px) and (max-width: 1536px) { @content; }
}

@mixin desktop {
  @media (min-width: 1537px) { @content; }
}
```

## Icon System

### Custom Icon Components
```tsx
// components/icons/index.tsx
export const IoTIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StreamIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path
      d="M5 12H19M5 6H19M5 18H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
  </svg>
);
```