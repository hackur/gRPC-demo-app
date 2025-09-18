/**
 * @fileoverview Theme Context Provider for gRPC Demo Application
 *
 * This module provides a comprehensive theming system with:
 * - 6 color themes (orange, blue, purple, green, red, teal)
 * - 2 modes (dark, light) for a total of 12 theme combinations
 * - Automatic CSS variable updates for real-time theme switching
 * - localStorage persistence for user preferences
 * - System preference detection for initial theme selection
 *
 * @author gRPC Demo App
 * @version 1.0.0
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/** Available theme color options */
export type ThemeColor = 'orange' | 'blue' | 'purple' | 'green' | 'red' | 'teal';

/** Available theme mode options */
export type ThemeMode = 'dark' | 'light';

/**
 * Complete theme configuration interface
 * @interface Theme
 */
interface Theme {
  /** Human-readable theme name */
  name: string;
  /** Theme color identifier */
  color: ThemeColor;
  /** Theme mode (dark/light) */
  mode: ThemeMode;
  /** Primary brand color (hex) */
  primary: string;
  /** Secondary brand color (hex) */
  secondary: string;
  /** Accent color for highlights (hex) */
  accent: string;
  /** Background color (hex) */
  background: string;
  /** Surface/card background color (hex) */
  surface: string;
  /** Text color variations */
  text: {
    /** Primary text color */
    primary: string;
    /** Secondary text color */
    secondary: string;
    /** Muted/disabled text color */
    muted: string;
  };
  /** Glow effect configurations for glass-morphic design */
  glow: {
    /** Primary glow effect CSS box-shadow value */
    primary: string;
    /** Secondary glow effect CSS box-shadow value */
    secondary: string;
  };
}

const themes: Record<`${ThemeColor}-${ThemeMode}`, Theme> = {
  'orange-dark': {
    name: 'Orange Dark',
    color: 'orange',
    mode: 'dark',
    primary: '#FF6B35',
    secondary: '#FF8C42',
    accent: '#FFB366',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(255, 107, 53, 0.5)',
      secondary: '0 0 20px rgba(255, 107, 53, 0.3)',
    },
  },
  'orange-light': {
    name: 'Orange Light',
    color: 'orange',
    mode: 'light',
    primary: '#FF6B35',
    secondary: '#FF8C42',
    accent: '#FFB366',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(255, 107, 53, 0.3)',
      secondary: '0 0 15px rgba(255, 107, 53, 0.2)',
    },
  },
  'blue-dark': {
    name: 'Blue Dark',
    color: 'blue',
    mode: 'dark',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(59, 130, 246, 0.5)',
      secondary: '0 0 20px rgba(59, 130, 246, 0.3)',
    },
  },
  'blue-light': {
    name: 'Blue Light',
    color: 'blue',
    mode: 'light',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(59, 130, 246, 0.3)',
      secondary: '0 0 15px rgba(59, 130, 246, 0.2)',
    },
  },
  'purple-dark': {
    name: 'Purple Dark',
    color: 'purple',
    mode: 'dark',
    primary: '#A855F7',
    secondary: '#C084FC',
    accent: '#D8B4FE',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(168, 85, 247, 0.5)',
      secondary: '0 0 20px rgba(168, 85, 247, 0.3)',
    },
  },
  'purple-light': {
    name: 'Purple Light',
    color: 'purple',
    mode: 'light',
    primary: '#A855F7',
    secondary: '#C084FC',
    accent: '#D8B4FE',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(168, 85, 247, 0.3)',
      secondary: '0 0 15px rgba(168, 85, 247, 0.2)',
    },
  },
  'green-dark': {
    name: 'Green Dark',
    color: 'green',
    mode: 'dark',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#6EE7B7',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(16, 185, 129, 0.5)',
      secondary: '0 0 20px rgba(16, 185, 129, 0.3)',
    },
  },
  'green-light': {
    name: 'Green Light',
    color: 'green',
    mode: 'light',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#6EE7B7',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(16, 185, 129, 0.3)',
      secondary: '0 0 15px rgba(16, 185, 129, 0.2)',
    },
  },
  'red-dark': {
    name: 'Red Dark',
    color: 'red',
    mode: 'dark',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#FCA5A5',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(239, 68, 68, 0.5)',
      secondary: '0 0 20px rgba(239, 68, 68, 0.3)',
    },
  },
  'red-light': {
    name: 'Red Light',
    color: 'red',
    mode: 'light',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#FCA5A5',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(239, 68, 68, 0.3)',
      secondary: '0 0 15px rgba(239, 68, 68, 0.2)',
    },
  },
  'teal-dark': {
    name: 'Teal Dark',
    color: 'teal',
    mode: 'dark',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#5EEAD4',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      muted: '#999999',
    },
    glow: {
      primary: '0 0 40px rgba(20, 184, 166, 0.5)',
      secondary: '0 0 20px rgba(20, 184, 166, 0.3)',
    },
  },
  'teal-light': {
    name: 'Teal Light',
    color: 'teal',
    mode: 'light',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#5EEAD4',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#666666',
    },
    glow: {
      primary: '0 0 30px rgba(20, 184, 166, 0.3)',
      secondary: '0 0 15px rgba(20, 184, 166, 0.2)',
    },
  },
};

interface ThemeContextValue {
  theme: Theme;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  availableColors: ThemeColor[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>('orange');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor') as ThemeColor;
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    
    if (savedColor && Object.keys(themes).some(key => key.startsWith(savedColor))) {
      setThemeColorState(savedColor);
    }
    
    if (savedMode && ['dark', 'light'].includes(savedMode)) {
      setThemeModeState(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = themes[`${themeColor}-${themeMode}`];
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--text-primary', theme.text.primary);
    root.style.setProperty('--text-secondary', theme.text.secondary);
    root.style.setProperty('--text-muted', theme.text.muted);
    root.style.setProperty('--glow-primary', theme.glow.primary);
    root.style.setProperty('--glow-secondary', theme.glow.secondary);
    
    // Apply dark/light mode class
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeColor, themeMode]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  };

  const toggleMode = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const value: ThemeContextValue = {
    theme: themes[`${themeColor}-${themeMode}`],
    themeColor,
    themeMode,
    setThemeColor,
    setThemeMode,
    toggleMode,
    availableColors: ['orange', 'blue', 'purple', 'green', 'red', 'teal'],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}