'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WidgetCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  glowColor?: 'orange' | 'blue' | 'green' | 'purple';
  size?: 'small' | 'medium' | 'large' | 'full';
  interactive?: boolean;
  glass?: boolean;
}

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
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-2',
    large: 'col-span-3 row-span-2',
    full: 'col-span-4 row-span-3',
  };

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