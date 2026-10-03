import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ className = '', variant = 'dropdown' }) {
  const { theme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'segmented') {
    return (
      <div className={`grid grid-cols-3 p-1 rounded-2xl bg-slate-200/80 dark:bg-[#111827] border border-slate-300 dark:border-slate-800 shadow-inner ${className}`}>
        <button
          type="button"
          onClick={() => setThemeMode('light')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Light Mode"
        >
          <Sun className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-slate-500 dark:text-slate-400'}`} />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setThemeMode('dark')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Dark Mode"
        >
          <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-white fill-white/20' : 'text-slate-500 dark:text-slate-400'}`} />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setThemeMode('system')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            theme === 'system'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="System Preference"
        >
          <Monitor className={`h-3.5 w-3.5 ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
          <span>System</span>
        </button>
      </div>
    );
  }

  // Default: Dropdown trigger button
  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white/90 dark:bg-[#141B2D] hover:bg-slate-100 dark:hover:bg-[#1E273D] border border-slate-300 dark:border-slate-700 shadow-sm transition-all text-xs font-semibold cursor-pointer"
        title={`Theme: ${theme}`}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
        ) : theme === 'dark' ? (
          <Moon className="h-4 w-4 text-blue-400 fill-blue-400/20" />
        ) : (
          <Monitor className="h-4 w-4 text-indigo-500" />
        )}
        <span className="capitalize font-semibold text-slate-700 dark:text-slate-200">{theme}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1E2638] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setThemeMode('light');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left font-bold cursor-pointer ${
              theme === 'light'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D2D] hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto text-blue-600 dark:text-blue-400 font-bold">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('dark');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left font-bold cursor-pointer ${
              theme === 'dark'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D2D] hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-500 fill-blue-500/20' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto text-blue-600 dark:text-blue-400 font-bold">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('system');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left font-bold cursor-pointer ${
              theme === 'system'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D2D] hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Monitor className={`h-4 w-4 ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto text-blue-600 dark:text-blue-400 font-bold">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
