// components/theme-provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  initialDarkMode: boolean;
  children: ReactNode;
}

export function ThemeProvider({ initialDarkMode, children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        return true;
      }
      if (storedTheme === 'light') {
        return false;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    }
    return initialDarkMode;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    root.style.transition = 'none';
    const timer = setTimeout(() => {
      root.style.transition = 'color 0.3s ease, background-color 0.3s ease';
    }, 50);

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
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