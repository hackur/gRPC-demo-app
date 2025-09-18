/**
 * @fileoverview Header component for the application layout.
 * Displays the app logo, current gRPC pattern, connection status,
 * theme selector, and settings button with smooth animations.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { motion } from 'framer-motion';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { useConnectionStatus } from '@/store/appStore';

/**
 * Header component that provides the main navigation and status bar.
 * Features animated entrance, connection status indicator, and theme controls.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component
 *
 * @example
 * ```typescript
 * // Basic usage in a layout
 * <Header />
 * ```
 */
export function Header() {
  /** Current gRPC connection status from global store */
  const connectionStatus = useConnectionStatus();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-16 bg-[#0A0B0D] border-b border-gray-800 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-semibold text-lg">gRPC Demo</span>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gray-800/50 rounded-lg text-sm">
            <span className="text-gray-400">Pattern:</span>{' '}
            <span className="text-orange-400 font-medium">Server Streaming</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500 animate-pulse'
                : connectionStatus === 'connecting' || connectionStatus === 'reconnecting'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-400 capitalize">
              {connectionStatus}
            </span>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Settings */}
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}