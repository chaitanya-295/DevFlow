import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  BarChart2,
  Folder,
  AlertCircle,
  Users,
  Bell,
  Rocket,
  Settings,
  ChevronRight,
  ChevronLeft,
  Target
} from 'lucide-react';
import { useGetDashboardMetricsQuery, useGetIssuesQuery } from '../api/devflowApi';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { data: metrics } = useGetDashboardMetricsQuery(undefined, { pollingInterval: 4000 });
  const { data: issues = [] } = useGetIssuesQuery(undefined, { pollingInterval: 4000 });

  const total = metrics?.totalIssues ?? issues.length;
  const done = metrics?.doneCount ?? issues.filter((i) => i.status === 'Done').length;
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

  // Nav icons accurately matching Jira's left rail:
  // 1. Grid (Dashboard / Boards overview)
  // 2. Bar chart / Velocity
  // 3. Folder (Projects)
  // 4. Alert Circle (Issues)
  // 5. Users (People / Teams)
  // 6. Bell (Notifications)
  // 7. Rocket (Releases)
  // 8. Settings (Settings)
  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutGrid },
    { label: 'Kanban Board', path: '/app/kanban', icon: BarChart2 },
    { label: 'Projects', path: '/app/projects', icon: Folder },
    { label: 'Issues', path: '/app/issues', icon: AlertCircle },
    { label: 'People', path: '/app/people', icon: Users },
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Releases', path: '/app/releases', icon: Rocket },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`
          ${mobileOpen ? 'fixed left-0 top-14 bottom-0 z-50 flex shadow-2xl' : 'hidden md:flex'}
          ${collapsed ? 'w-16' : 'w-56'}
          shrink-0 bg-white dark:bg-[#0B0F17] border-r border-slate-200 dark:border-[#1C2537] flex-col justify-between select-none h-full overflow-hidden transition-all duration-300
        `}
      >
        {/* Top items rail */}
        <div className="flex-1 flex flex-col pt-2 overflow-y-auto overflow-x-hidden">
          {/* Expand/Collapse Chevron Button */}
          <div className={`flex items-center px-3 py-1 mb-2 ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={() => {
                if (mobileOpen) setMobileOpen(false);
                else setCollapsed && setCollapsed(!collapsed);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative
                    ${collapsed ? 'justify-center px-0 w-11 mx-auto' : ''}
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/15 dark:text-blue-400 font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#151D2C]'
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate text-xs font-medium">{item.label}</span>
                  )}

                  {/* Tooltip in collapsed mode */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sprint Indicator matching screenshot */}
        <div className="border-t border-slate-200 dark:border-[#1C2537] p-2 bg-slate-50/50 dark:bg-[#070B13]/40">
          {collapsed ? (
            /* Icon view matching user image: Target icon, progress line, and "5d" remaining */
            <div
              className="flex flex-col items-center justify-center py-2 px-1 cursor-pointer group"
              title={`Active Sprint: ${progressPercent}% done (${done}/${total})`}
            >
              <div className="p-1 rounded-full text-blue-600 dark:text-blue-400">
                <Target className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="w-8 h-1 rounded-full bg-slate-200 dark:bg-[#1E293B] overflow-hidden my-1">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${Math.max(15, progressPercent)}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                5d
              </span>
            </div>
          ) : (
            /* Expanded Sprint Card */
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#091124] border border-slate-200 dark:border-[#1E2D4A] shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-100 mb-1.5">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                  <Target className="h-4 w-4" />
                  Active Sprint
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-mono font-bold text-[11px]">
                  {progressPercent}%
                </span>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 flex justify-between font-medium">
                <span>{done}/{total} done</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">5d left</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1E293B] overflow-hidden mb-1">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${Math.max(10, progressPercent)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
