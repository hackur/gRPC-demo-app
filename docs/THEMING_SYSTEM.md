# Advanced Theming System

## Theme Architecture

### Core Theme Structure
```typescript
// client/web-app/src/lib/themes/types.ts
export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: ColorPalette;
  typography: Typography;
  spacing: SpacingScale;
  borderRadius: RadiusScale;
  shadows: ShadowScale;
  animations: AnimationConfig;
}

export interface ColorPalette {
  // Base colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
  };

  // Foreground colors
  foreground: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };

  // Brand colors
  brand: {
    primary: string;
    secondary: string;
    tertiary: string;
    gradient: string;
  };

  // Semantic colors
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Chart colors
  chart: string[];

  // Special effects
  effects: {
    glow: string;
    glass: string;
    border: string;
    shadow: string;
  };
}
```

## Predefined Themes

### 1. Oblika Dark (Default)
```typescript
// client/web-app/src/lib/themes/oblika-dark.ts
export const oblikaDark: Theme = {
  id: 'oblika-dark',
  name: 'Oblika Dark',
  mode: 'dark',
  colors: {
    background: {
      primary: '#0A0B0D',
      secondary: '#141619',
      tertiary: '#1C1F23',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    foreground: {
      primary: '#FFFFFF',
      secondary: '#9CA3AF',
      tertiary: '#6B7280',
      muted: '#4B5563',
    },
    brand: {
      primary: '#FF6B35',
      secondary: '#E85D3C',
      tertiary: '#FFA07A',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #E85D3C 100%)',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    chart: [
      '#FF6B35', '#3B82F6', '#10B981', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F59E0B', '#6366F1'
    ],
    effects: {
      glow: 'rgba(255, 107, 53, 0.4)',
      glass: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
      display: 'Manrope, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px var(--glow-color)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ease: 'ease',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};
```

### 2. Oblika Light
```typescript
// client/web-app/src/lib/themes/oblika-light.ts
export const oblikaLight: Theme = {
  id: 'oblika-light',
  name: 'Oblika Light',
  mode: 'light',
  colors: {
    background: {
      primary: '#FAF9F6',
      secondary: '#FFFFFF',
      tertiary: '#F3F4F6',
      overlay: 'rgba(0, 0, 0, 0.1)',
    },
    foreground: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      muted: '#9CA3AF',
    },
    brand: {
      primary: '#E85D3C',
      secondary: '#FF6B35',
      tertiary: '#FFA07A',
      gradient: 'linear-gradient(135deg, #E85D3C 0%, #FF6B35 100%)',
    },
    semantic: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
    chart: [
      '#E85D3C', '#2563EB', '#059669', '#7C3AED',
      '#DB2777', '#0891B2', '#D97706', '#4F46E5'
    ],
    effects: {
      glow: 'rgba(232, 93, 60, 0.2)',
      glass: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },
  // ... rest of theme config
};
```

### 3. Midnight Blue
```typescript
// client/web-app/src/lib/themes/midnight-blue.ts
export const midnightBlue: Theme = {
  id: 'midnight-blue',
  name: 'Midnight Blue',
  mode: 'dark',
  colors: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      overlay: 'rgba(15, 23, 42, 0.8)',
    },
    brand: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      tertiary: '#93C5FD',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    },
    // ... rest of colors
  },
};
```

### 4. Forest Green
```typescript
// client/web-app/src/lib/themes/forest-green.ts
export const forestGreen: Theme = {
  id: 'forest-green',
  name: 'Forest Green',
  mode: 'dark',
  colors: {
    background: {
      primary: '#0A1F0A',
      secondary: '#14291A',
      tertiary: '#1E3A2E',
      overlay: 'rgba(10, 31, 10, 0.8)',
    },
    brand: {
      primary: '#10B981',
      secondary: '#34D399',
      tertiary: '#6EE7B7',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    },
    // ... rest of colors
  },
};
```

### 5. Purple Haze
```typescript
// client/web-app/src/lib/themes/purple-haze.ts
export const purpleHaze: Theme = {
  id: 'purple-haze',
  name: 'Purple Haze',
  mode: 'dark',
  colors: {
    background: {
      primary: '#1A0B2E',
      secondary: '#2B1656',
      tertiary: '#3D2070',
      overlay: 'rgba(26, 11, 46, 0.8)',
    },
    brand: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      tertiary: '#C4B5FD',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    },
    // ... rest of colors
  },
};
```

### 6. Solar Flare (High Contrast)
```typescript
// client/web-app/src/lib/themes/solar-flare.ts
export const solarFlare: Theme = {
  id: 'solar-flare',
  name: 'Solar Flare',
  mode: 'light',
  colors: {
    background: {
      primary: '#FFFEF7',
      secondary: '#FFF9E6',
      tertiary: '#FFF3CC',
      overlay: 'rgba(255, 244, 204, 0.8)',
    },
    brand: {
      primary: '#F59E0B',
      secondary: '#FBD04',
      tertiary: '#FDE68A',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBD04 100%)',
    },
    // ... rest of colors
  },
};
```

## Theme Provider Implementation

### Theme Context
```tsx
// client/web-app/src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/lib/themes/types';
import { themes } from '@/lib/themes';

interface ThemeContextValue {
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  customTheme: Theme | null;
  createCustomTheme: (theme: Partial<Theme>) => void;
  resetTheme: () => void;
  systemPreference: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState('oblika-dark');
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme-id');
    const savedCustomTheme = localStorage.getItem('custom-theme');

    if (savedCustomTheme) {
      setCustomTheme(JSON.parse(savedCustomTheme));
    }
    if (savedTheme) {
      setThemeId(savedTheme);
    }

    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const theme = customTheme || themes[themeId] || themes['oblika-dark'];
    applyThemeToDOM(theme);

    // Save preference
    localStorage.setItem('theme-id', themeId);
    if (customTheme) {
      localStorage.setItem('custom-theme', JSON.stringify(customTheme));
    }
  }, [themeId, customTheme]);

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors.background).forEach(([key, value]) => {
      root.style.setProperty(`--color-bg-${key}`, value);
    });

    Object.entries(theme.colors.foreground).forEach(([key, value]) => {
      root.style.setProperty(`--color-fg-${key}`, value);
    });

    Object.entries(theme.colors.brand).forEach(([key, value]) => {
      root.style.setProperty(`--color-brand-${key}`, value);
    });

    // Apply typography
    Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Set theme mode
    root.setAttribute('data-theme', theme.mode);
    root.setAttribute('data-theme-id', theme.id);
  };

  const createCustomTheme = (partial: Partial<Theme>) => {
    const baseTheme = themes[themeId] || themes['oblika-dark'];
    const newTheme: Theme = {
      ...baseTheme,
      ...partial,
      id: 'custom',
      name: 'Custom Theme',
    };
    setCustomTheme(newTheme);
  };

  const resetTheme = () => {
    setCustomTheme(null);
    localStorage.removeItem('custom-theme');
  };

  const value: ThemeContextValue = {
    theme: customTheme || themes[themeId] || themes['oblika-dark'],
    themeId,
    setTheme: setThemeId,
    customTheme,
    createCustomTheme,
    resetTheme,
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## Theme Switcher Component

```tsx
// client/web-app/src/components/ui/ThemeSwitcher.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/lib/themes';

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeId, setTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <motion.button
        className="theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="theme-preview"
          style={{
            background: theme.colors.brand.gradient,
          }}
        />
        <span>{theme.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="theme-grid">
              {Object.values(themes).map((t) => (
                <ThemeOption
                  key={t.id}
                  theme={t}
                  isActive={t.id === themeId}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="theme-actions">
              <button onClick={() => setIsOpen(false)}>
                Custom Theme Builder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeOption({ theme, isActive, onClick }) {
  return (
    <motion.button
      className={`theme-option ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="theme-preview-grid">
        <div
          className="color-swatch"
          style={{ background: theme.colors.background.primary }}
        />
        <div
          className="color-swatch"
          style={{ background: theme.colors.brand.primary }}
        />
        <div
          className="color-swatch"
          style={{ background: theme.colors.brand.secondary }}
        />
        <div
          className="color-swatch"
          style={{ background: theme.colors.semantic.success }}
        />
      </div>
      <span className="theme-name">{theme.name}</span>
      {theme.mode === 'dark' ? '🌙' : '☀️'}
    </motion.button>
  );
}
```

## Custom Theme Builder

```tsx
// client/web-app/src/components/ui/ThemeBuilder.tsx
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeBuilder() {
  const { theme, createCustomTheme } = useTheme();
  const [colors, setColors] = useState(theme.colors);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const handleColorChange = (category: string, key: string, value: string) => {
    setColors(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const applyTheme = () => {
    createCustomTheme({
      ...theme,
      colors,
      id: 'custom',
      name: 'Custom Theme',
    });
  };

  return (
    <div className="theme-builder">
      <div className="builder-header">
        <h2>Theme Builder</h2>
        <button onClick={applyTheme}>Apply Theme</button>
      </div>

      <div className="builder-sections">
        <section>
          <h3>Background Colors</h3>
          <div className="color-grid">
            {Object.entries(colors.background).map(([key, value]) => (
              <ColorInput
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleColorChange('background', key, v)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3>Brand Colors</h3>
          <div className="color-grid">
            {Object.entries(colors.brand).map(([key, value]) => (
              <ColorInput
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleColorChange('brand', key, v)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3>Live Preview</h3>
          <div className="preview-container">
            <WidgetCard
              title="Sample Widget"
              subtitle="Preview your theme"
              glowColor="primary"
            >
              <div className="preview-content">
                <button className="preview-button">Action Button</button>
                <div className="preview-stats">
                  <span className="stat-value">42</span>
                  <span className="stat-label">Active</span>
                </div>
              </div>
            </WidgetCard>
          </div>
        </section>
      </div>
    </div>
  );
}
```

## CSS Variables Implementation

```scss
// client/web-app/src/styles/themes.scss
:root {
  // Colors
  --color-bg-primary: #0A0B0D;
  --color-bg-secondary: #141619;
  --color-bg-tertiary: #1C1F23;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);

  --color-fg-primary: #FFFFFF;
  --color-fg-secondary: #9CA3AF;
  --color-fg-tertiary: #6B7280;
  --color-fg-muted: #4B5563;

  --color-brand-primary: #FF6B35;
  --color-brand-secondary: #E85D3C;
  --color-brand-tertiary: #FFA07A;
  --color-brand-gradient: linear-gradient(135deg, #FF6B35 0%, #E85D3C 100%);

  // Typography
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Manrope', sans-serif;

  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  // Transitions
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

// Automatic color adaptation
[data-theme="light"] {
  --color-bg-primary: #FAF9F6;
  --color-bg-secondary: #FFFFFF;
  --color-bg-tertiary: #F3F4F6;

  --color-fg-primary: #111827;
  --color-fg-secondary: #4B5563;
  --color-fg-tertiary: #6B7280;

  --color-brand-primary: #E85D3C;
  --color-brand-secondary: #FF6B35;
}

// Theme-specific overrides
[data-theme-id="midnight-blue"] {
  --color-brand-primary: #3B82F6;
  --color-brand-secondary: #60A5FA;
  --color-brand-gradient: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
}

[data-theme-id="forest-green"] {
  --color-brand-primary: #10B981;
  --color-brand-secondary: #34D399;
  --color-brand-gradient: linear-gradient(135deg, #10B981 0%, #34D399 100%);
}
```

## Theme Persistence

```typescript
// client/web-app/src/lib/theme-persistence.ts
export class ThemePersistence {
  private static STORAGE_KEY = 'app-theme-preferences';

  static savePreferences(preferences: ThemePreferences) {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }

  static loadPreferences(): ThemePreferences | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  static saveCustomTheme(theme: Theme) {
    localStorage.setItem(
      'custom-theme',
      JSON.stringify(theme)
    );
  }

  static loadCustomTheme(): Theme | null {
    const saved = localStorage.getItem('custom-theme');
    return saved ? JSON.parse(saved) : null;
  }

  static exportTheme(theme: Theme) {
    const blob = new Blob(
      [JSON.stringify(theme, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.id}-theme.json`;
    a.click();
  }

  static async importTheme(file: File): Promise<Theme> {
    const text = await file.text();
    return JSON.parse(text);
  }
}
```

## Accessibility Features

```typescript
// client/web-app/src/lib/themes/accessibility.ts
export function ensureContrast(
  foreground: string,
  background: string,
  minRatio = 4.5
): string {
  const ratio = getContrastRatio(foreground, background);

  if (ratio < minRatio) {
    return adjustColorForContrast(foreground, background, minRatio);
  }

  return foreground;
}

export function getHighContrastTheme(baseTheme: Theme): Theme {
  return {
    ...baseTheme,
    id: `${baseTheme.id}-high-contrast`,
    name: `${baseTheme.name} (High Contrast)`,
    colors: {
      ...baseTheme.colors,
      foreground: {
        primary: ensureContrast(
          baseTheme.colors.foreground.primary,
          baseTheme.colors.background.primary,
          7.0
        ),
        // ... adjust other colors
      },
    },
  };
}
```

## Theme Animation Effects

```tsx
// client/web-app/src/components/ui/ThemeTransition.tsx
export function ThemeTransition({ children }) {
  const { themeId } = useTheme();

  return (
    <motion.div
      key={themeId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}