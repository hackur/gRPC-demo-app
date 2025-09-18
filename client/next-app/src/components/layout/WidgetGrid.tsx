/**
 * @fileoverview WidgetGrid component for responsive dashboard layouts.
 * Provides a configurable CSS Grid container with animation support
 * for organizing widgets in structured dashboard layouts.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * Props interface for the WidgetGrid component.
 *
 * @interface WidgetGridProps
 */
interface WidgetGridProps {
  /** Child elements to render in the grid */
  children: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
  /** Number of columns in the grid */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Whether to animate children on mount */
  animate?: boolean;
}

/**
 * WidgetGrid component for creating responsive dashboard layouts.
 * Supports configurable columns, gaps, and optional stagger animations.
 *
 * @component
 * @param {WidgetGridProps} props - The component props
 * @returns {JSX.Element} The rendered WidgetGrid component
 *
 * @example
 * ```typescript
 * <WidgetGrid columns={3} gap="lg" animate={true}>
 *   <WidgetCard title="Metric 1">Content 1</WidgetCard>
 *   <WidgetCard title="Metric 2">Content 2</WidgetCard>
 *   <WidgetCard title="Metric 3">Content 3</WidgetCard>
 * </WidgetGrid>
 * ```
 */
export function WidgetGrid({
  children,
  className,
  columns = 4,
  gap = 'md',
  animate = true,
}: WidgetGridProps) {
  /** CSS classes for different column counts */
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  /** CSS classes for different gap sizes */
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  /** Animation variants for staggered child animations */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (animate) {
    return (
      <motion.div
        className={cn(
          'grid',
          columnClasses[columns],
          gapClasses[gap],
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}