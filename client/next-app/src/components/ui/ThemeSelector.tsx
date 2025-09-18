'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Moon, Sun } from 'lucide-react';

export function ThemeSelector() {
  const { themeColor, themeMode, setThemeColor, toggleMode, availableColors } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
        aria-label="Toggle dark/light mode"
      >
        {themeMode === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Color Selector */}
      <div className="relative group">
        <button
          className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          aria-label="Select theme color"
        >
          <Palette className="w-5 h-5" />
        </button>
        
        <div className="absolute right-0 mt-2 p-2 rounded-lg bg-black/90 backdrop-blur-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  themeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
                style={{
                  backgroundColor: getColorValue(color),
                }}
                aria-label={`Select ${color} theme`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    orange: '#FF6B35',
    blue: '#3B82F6',
    purple: '#A855F7',
    green: '#10B981',
    red: '#EF4444',
    teal: '#14B8A6',
  };
  return colors[color] || '#FF6B35';
}