'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeDemo: string;
  onDemoChange: (demo: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  demos: Record<string, { name: string; icon: string; color: string; description: string }>;
}

export function Sidebar({
  activeDemo,
  onDemoChange,
  collapsed,
  onCollapsedChange,
  demos,
}: SidebarProps) {
  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#141619] border-r border-gray-800 transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapse Button */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-[#1C1F23] border border-gray-700 rounded-full flex items-center justify-center hover:bg-[#252A2F] transition-colors"
      >
        <svg
          className={cn('w-3 h-3 transition-transform', collapsed ? 'rotate-180' : '')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-white">gRPC Demo</h2>
              <p className="text-xs text-gray-400">Widget Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {!collapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Demos
          </h3>
        )}

        <div className="space-y-2">
          {Object.entries(demos).map(([key, demo]) => (
            <motion.button
              key={key}
              onClick={() => onDemoChange(key)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
                activeDemo === key
                  ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30'
                  : 'hover:bg-gray-800/50'
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{demo.icon}</span>
              {!collapsed && (
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{demo.name}</p>
                  <p className="text-xs text-gray-400">{demo.description}</p>
                </div>
              )}

              {/* Active indicator */}
              {activeDemo === key && (
                <motion.div
                  className="absolute left-0 w-1 h-8 bg-orange-500 rounded-r"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected to server</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}