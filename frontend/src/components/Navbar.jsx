import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Code2,
  LogOut,
  Github,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                DevFlow
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">v1.0</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Issue & Sprint Orchestration</span>
            </div>
          </Link>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle />

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800/60 rounded-xl transition-all border border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              title="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link
                  to="/app/dashboard"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/10"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/40 shadow-inner"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner select-none">
                      {(user?.name || user?.fullName || user?.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-200">{user?.name || user?.fullName || 'Developer'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{user?.role || 'MEMBER'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Theme Toggle & hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="pt-2 pb-1 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2 font-medium">Appearance</p>
            <ThemeToggle variant="segmented" className="w-full justify-center" />
          </div>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/app/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg bg-blue-600 text-white font-medium text-sm text-center justify-center shadow-md shadow-blue-600/30"
              >
                <Sparkles className="h-4 w-4" />
                Go to Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left py-2 px-3 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm">Sign Out</button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-slate-800 text-white font-medium">Sign In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
