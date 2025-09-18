'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string | number;
  icon?: ReactNode;
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
  const colorClasses = {
    default: 'bg-gray-800/50 border-gray-700',
    success: 'bg-green-900/20 border-green-800/50',
    warning: 'bg-yellow-900/20 border-yellow-800/50',
    error: 'bg-red-900/20 border-red-800/50',
    info: 'bg-blue-900/20 border-blue-800/50',
  };

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400',
  };

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