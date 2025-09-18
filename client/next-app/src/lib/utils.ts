/**
 * @fileoverview Utility functions for the gRPC demo application.
 * Provides common utility functions for CSS class management,
 * number formatting, and data visualization helpers.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and optimizes CSS class names using clsx and tailwind-merge.
 * Merges Tailwind CSS classes intelligently, removing conflicts and duplicates.
 *
 * @param {...ClassValue[]} inputs - Class values to combine
 * @returns {string} Optimized class string
 *
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-4', 'bg-blue-500') // Returns: 'py-1 px-4 bg-blue-500'
 * cn('text-center', false && 'text-left', 'font-bold') // Returns: 'text-center font-bold'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers using compact notation for better readability.
 * Converts large numbers to K, M, B notation.
 *
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1234) // Returns: '1.2K'
 * formatNumber(1234567) // Returns: '1.2M'
 * formatNumber(1234567890) // Returns: '1.2B'
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Formats byte values into human-readable file sizes.
 * Converts bytes to appropriate units (KB, MB, GB, TB).
 *
 * @param {number} bytes - The byte value to format
 * @returns {string} Formatted byte string with appropriate unit
 *
 * @example
 * ```typescript
 * formatBytes(1024) // Returns: '1 KB'
 * formatBytes(1048576) // Returns: '1 MB'
 * formatBytes(1073741824) // Returns: '1 GB'
 * ```
 */
export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formats latency values into appropriate time units.
 * Displays microseconds, milliseconds, or seconds based on magnitude.
 *
 * @param {number} ms - The latency value in milliseconds
 * @returns {string} Formatted latency string with appropriate unit
 *
 * @example
 * ```typescript
 * formatLatency(0.5) // Returns: '500µs'
 * formatLatency(150) // Returns: '150ms'
 * formatLatency(2500) // Returns: '2.50s'
 * ```
 */
export function formatLatency(ms: number): string {
  if (ms < 1) return `${Math.round(ms * 1000)}µs`;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}