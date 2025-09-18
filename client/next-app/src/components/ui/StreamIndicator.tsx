/**
 * @fileoverview StreamIndicator component for displaying real-time streaming status.
 * Provides an animated visual indicator with customizable size and labels
 * to show when data streams are active or inactive.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props interface for the StreamIndicator component.
 *
 * @interface StreamIndicatorProps
 */
interface StreamIndicatorProps {
  /** Whether the stream is currently active */
  active: boolean;
  /** Optional label text to display next to the indicator */
  label?: string;
  /** Size variant of the indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * StreamIndicator component that displays an animated dot to indicate streaming status.
 * Shows a pulsing green dot when active, gray dot when inactive.
 *
 * @component
 * @param {StreamIndicatorProps} props - The component props
 * @returns {JSX.Element} The rendered StreamIndicator component
 *
 * @example
 * ```typescript
 * <StreamIndicator
 *   active={isConnected}
 *   label="Data Stream"
 *   size="lg"
 * />
 * ```
 */
export function StreamIndicator({
  active,
  label = 'Streaming',
  size = 'md',
  className,
}: StreamIndicatorProps) {
  /** CSS classes for different indicator sizes */
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  /** CSS classes for different text sizes */
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active ? 'active' : 'inactive'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn('flex items-center gap-2', className)}
      >
        <div className="relative">
          <motion.div
            className={cn(
              'rounded-full',
              sizeClasses[size],
              active ? 'bg-green-500' : 'bg-gray-500'
            )}
            animate={
              active
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {active && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full bg-green-500',
                sizeClasses[size]
              )}
              animate={{
                scale: [1, 1.8, 2.5],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </div>
        {label && (
          <span
            className={cn(
              textSizes[size],
              active ? 'text-green-400' : 'text-gray-400'
            )}
          >
            {label}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}