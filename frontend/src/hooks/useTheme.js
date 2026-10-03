import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const applyTheme = (targetTheme) => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (targetTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // System mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    // Dispatch custom event so all mounted components update instantly
    window.dispatchEvent(new CustomEvent('devflow-theme-change', { detail: newTheme }));
  };

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const currentStored = localStorage.getItem('theme') || 'dark';
      if (currentStored === 'system') {
        applyTheme('system');
      }
    };

    const handleThemeEvent = (e) => {
      if (e.detail && e.detail !== theme) {
        setTheme(e.detail);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.addEventListener('devflow-theme-change', handleThemeEvent);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('devflow-theme-change', handleThemeEvent);
    };
  }, [theme]);

  return { theme, setThemeMode };
}
