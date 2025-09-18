/**
 * @fileoverview MetricBadge component for displaying key performance indicators.
 * Provides an animated badge with support for metrics, trends, icons,
 * and various color schemes for dashboard and analytics displays.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * Props interface for the MetricBadge component.
 *
 * @interface MetricBadgeProps
 */
interface MetricBadgeProps {
  /** Label text for the metric */
  label: string;
  /** Primary metric value to display */
  value: string | number;
  /** Optional trend direction indicator */
  trend?: 'up' | 'down' | 'stable';
  /** Optional trend value to display with the trend */
  trendValue?: string | number;
  /** Optional icon element to display */
  icon?: ReactNode;
  /** Color scheme for the badge */
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Size variant of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * MetricBadge component for displaying metrics with optional trend indicators.
 * Features animated backgrounds and hover effects for enhanced user experience.
 *
 * @component
 * @param {MetricBadgeProps} props - The component props
 * @returns {JSX.Element} The rendered MetricBadge component
 *
 * @example
 * ```typescript
 * <MetricBadge
 *   label="Revenue"
 *   value="$12,345"
 *   trend="up"
 *   trendValue="+15%"
 *   color="success"
 *   size="lg"
 * />
 * ```
 */
export function MetricBadge({
  label,
  value,
  trend,
  trendValue,
  icon,
  color = 'default',
  size = 'md',
  className,
}: MetricBadgeProps) {
  /** CSS classes for different color schemes */
  const colorClasses = {
    default: 'bg-gray-800/50 border-gray-700',
    success: 'bg-green-900/20 border-green-800/50',
    warning: 'bg-yellow-900/20 border-yellow-800/50',
    error: 'bg-red-900/20 border-red-800/50',
    info: 'bg-blue-900/20 border-blue-800/50',
  };

  /** CSS classes for different sizes */
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  /** CSS classes for trend colors */
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400',
  };

  /** Unicode icons for trend indicators */
  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-sm',
        colorClasses[color],
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">{label}</span>
          {icon && <div className="text-gray-500">{icon}</div>}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {trend && trendValue && (
            <span className={cn('text-sm', trendColors[trend])}>
              {trendIcons[trend]} {trendValue}
            </span>
          )}
        </div>
      </div>

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(255,107,53,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(255,107,53,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(255,107,53,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}