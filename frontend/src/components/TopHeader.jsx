import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Search, Plus, Bell, Monitor, Sun, Moon, User, Settings, LogOut, Bug, FolderPlus, Users } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function TopHeader({ 
  onQuickCreate, 
  onOpenCreateIssue, 
  onOpenCreateProject, 
  onOpenCreateTeam,
  onToggleMobileSidebar 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const { theme, setThemeMode } = useTheme();
  const dropdownRef = useRef(null);
  const createMenuRef = useRef(null);
  const themeMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
    setThemeMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setCreateMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setThemeMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('devflow_token');
    localStorage.removeItem('devflow_user');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-[#090D16] border-b border-[#1C2537] px-3 sm:px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Hamburger + Brand icon + Name */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
          title="Toggle Navigation Menu"
        >
          <span className="text-xl leading-none">☰</span>
        </button>

        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/25 text-base shrink-0 select-none">
          J
        </div>
        <Link to="/app/dashboard" className="font-bold text-base sm:text-lg text-slate-100 hover:text-white flex items-center gap-2">
          Jira Clone
        </Link>
      </div>

      {/* Global Search Bar (hidden on extra small screens) */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden sm:block">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, issues, people..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Action buttons & Avatar */}
      <div className="flex items-center gap-3">
        {/* Create Button with Dropdown */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>

          {createMenuOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 rounded-xl bg-[#0E131F] border border-[#1E2638] shadow-2xl py-1.5 text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(false);
                  if (onOpenCreateIssue) onOpenCreateIssue();
                  else if (onQuickCreate) onQuickCreate();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-white transition-colors text-left font-medium"
              >
                <Bug className="h-4 w-4 text-slate-300" />
                <span>New Issue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(false);
                  if (onOpenCreateProject) onOpenCreateProject();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-white transition-colors text-left font-medium"
              >
                <FolderPlus className="h-4 w-4 text-slate-300" />
                <span>New Project</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(false);
                  if (onOpenCreateTeam) onOpenCreateTeam();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-white transition-colors text-left font-medium"
              >
                <Users className="h-4 w-4 text-slate-300" />
                <span>New Team</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative" ref={themeMenuRef}>
          <button 
            type="button"
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Switch theme"
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : theme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1E2638] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
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
                onClick={() => handleThemeChange('dark')}
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
                onClick={() => handleThemeChange('system')}
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

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            type="button"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 sm:right-[-20px] mt-2 w-76 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1E2638] shadow-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="px-4 py-3.5 border-b border-slate-200 dark:border-[#1A2234] flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Notifications</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-[#182338] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700/60 font-mono">
                  3 unread
                </span>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#161E30] text-xs">
                {/* Item 1: Deadline */}
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#12192A] transition-colors flex items-start gap-3 cursor-pointer">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white leading-snug">Project deadline approaching</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Marketing Site Redesign is due in 2 days</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-0.5">2 hours ago</p>
                  </div>
                </div>

                {/* Item 2: New Issue */}
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#12192A] transition-colors flex items-start gap-3 cursor-pointer">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white leading-snug">New issue assigned to you</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Fix broken login redirect flow</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-0.5">4 hours ago</p>
                  </div>
                </div>

                {/* Item 3: Comment */}
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#12192A] transition-colors flex items-start gap-3 cursor-pointer">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white leading-snug">Comment on your issue</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Miles Parker commented on your issue</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-0.5">6 hours ago</p>
                  </div>
                </div>

                {/* Item 4: Code review */}
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#12192A] transition-colors flex items-start gap-3 cursor-pointer">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white leading-snug">Code review requested</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Implement JWT Refresh Token Rotation</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-0.5">8 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Footer View All Notifications */}
              <div className="p-2.5 border-t border-slate-200 dark:border-[#1A2234] bg-slate-50 dark:bg-[#090D16] text-center">
                <Link
                  to="/app/notifications"
                  onClick={() => setNotifMenuOpen(false)}
                  className="block w-full py-1.5 text-xs font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User avatar with dropdown */}
        <div className="relative pl-1 border-l border-slate-800" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/40 hover:ring-blue-400 cursor-pointer transition-all"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/40 hover:ring-blue-400 cursor-pointer">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0E131F] border border-[#1E2638] shadow-2xl py-1 text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* User header info */}
              <div className="px-4 py-3 border-b border-[#1A2234]">
                <p className="text-sm font-bold text-white leading-tight">
                  {user?.name || 'Developer'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {user?.email || 'user@devflow.io'}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  to="/app/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-white transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/app/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Log out action */}
              <div className="border-t border-[#1A2234] py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-[#151D2D] hover:text-rose-400 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-slate-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
