/**
 * @fileoverview WidgetCard component for displaying dashboard widgets.
 * A versatile card component with glass morphism effects, animations,
 * and multiple size options for creating responsive dashboard layouts.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the WidgetCard component.
 *
 * @interface WidgetCardProps
 */
interface WidgetCardProps {
  /** Optional card title displayed in the header */
  title?: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Optional icon element displayed in the header */
  icon?: ReactNode;
  /** Child content to render inside the card */
  children: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
  /** Glow color effect on hover */
  glowColor?: 'orange' | 'blue' | 'green' | 'purple';
  /** Card size affecting grid layout */
  size?: 'small' | 'medium' | 'large' | 'full';
  /** Whether the card should respond to hover interactions */
  interactive?: boolean;
  /** Whether to apply glass morphism effect */
  glass?: boolean;
}

/**
 * A flexible widget card component with glass morphism effects and animations.
 * Supports various sizes, glow effects, and interactive states for dashboard layouts.
 *
 * @component
 * @param {WidgetCardProps} props - The component props
 * @returns {JSX.Element} The rendered WidgetCard component
 *
 * @example
 * ```typescript
 * <WidgetCard
 *   title="System Status"
 *   subtitle="Real-time monitoring"
 *   icon={<StatusIcon />}
 *   size="medium"
 *   glowColor="green"
 *   interactive
 * >
 *   <StatusDisplay />
 * </WidgetCard>
 * ```
 */
export function WidgetCard({
  title,
  subtitle,
  icon,
  children,
  className = '',
  glowColor,
  size = 'medium',
  interactive = false,
  glass = true,
}: WidgetCardProps) {
  /** CSS Grid classes for different card sizes */
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-2',
    large: 'col-span-3 row-span-2',
    full: 'col-span-4 row-span-3',
  };

  /** Shadow styles for different glow colors */
  const glowStyles = {
    orange: 'hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]',
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    green: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  };

  return (
    <motion.div
      className={cn(
        'widget-card relative overflow-hidden rounded-2xl border transition-all duration-300',
        glass && 'backdrop-blur-xl',
        interactive && 'cursor-pointer',
        glowColor && glowStyles[glowColor],
        sizeClasses[size],
        className
      )}
      style={{
        background: glass
          ? 'linear-gradient(135deg, rgba(20, 22, 25, 0.9) 0%, rgba(28, 31, 35, 0.8) 100%)'
          : 'linear-gradient(135deg, #141619 0%, #1C1F23 100%)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }}
      whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect overlay */}
      {glowColor && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${
              glowColor === 'orange'
                ? 'rgba(255,107,53,0.1)'
                : glowColor === 'blue'
                ? 'rgba(59,130,246,0.1)'
                : glowColor === 'green'
                ? 'rgba(16,185,129,0.1)'
                : 'rgba(139,92,246,0.1)'
            } 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 flex h-full flex-col p-6">
        {(title || subtitle || icon) && (
          <div className="mb-4 flex items-start gap-4">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </motion.div>
  );
}