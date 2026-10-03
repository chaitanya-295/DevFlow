import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Search, 
  ChevronDown, 
  Filter, 
  User, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { useGetIssuesQuery, useGetProjectsQuery } from '../api/devflowApi';

export default function NotificationsPage() {
  const { data: issues = [] } = useGetIssuesQuery(undefined, { pollingInterval: 4000 });
  const { data: projects = [] } = useGetProjectsQuery(undefined, { pollingInterval: 4000 });

  // Generate real-time live alerts based on backend data
  const dynamicLiveNotifications = [
    ...issues.slice(0, 8).map((issue, idx) => ({
      id: issue.id || `issue-${idx}`,
      title: issue.status === 'Done' ? `Resolved: ${issue.title}` : `Issue update: ${issue.title}`,
      message: `Project ${issue.project || 'General'} • Priority: ${issue.priority || 'Medium'} • Assigned to ${issue.assignee || 'Unassigned'}`,
      priority: (issue.priority || 'medium').toLowerCase(),
      priorityColor: issue.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#991B1B]/40 dark:text-rose-300 dark:border-rose-800/40' :
                     issue.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/40' :
                     issue.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/40' :
                     'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/40',
      time: issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '2/10/2026',
      unread: issue.status !== 'Done',
      dotColor: issue.priority === 'Critical' ? 'bg-rose-500' : 'bg-blue-500'
    })),
    ...projects.slice(0, 3).map((proj, idx) => ({
      id: proj.id || `proj-${idx}`,
      title: `Project Status: ${proj.title}`,
      message: `Current status is ${proj.status || 'Active'} led by ${proj.lead || 'Owen Scott'}.`,
      priority: 'low',
      priorityColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
      time: 'Live',
      unread: false,
      dotColor: 'bg-emerald-500'
    }))
  ];

  const [dismissedIds, setDismissedIds] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Unread', value: 'Unread' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
  ];

  const notifications = dynamicLiveNotifications
    .filter(n => !dismissedIds.includes(n.id))
    .map(n => ({
      ...n,
      unread: readIds.includes(n.id) ? false : n.unread
    }));

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const handleToggleRead = (id) => {
    setReadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = (id) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                          (filterType === 'Unread' && n.unread) ||
                          (filterType === n.priority);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Stay updated with your project activities
          </p>
        </div>

        {/* Unread badge & Mark all read button */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
            {unreadCount} unread
          </span>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 dark:bg-white dark:hover:bg-slate-100 text-slate-800 dark:text-slate-900 font-semibold text-xs border border-slate-200 dark:border-transparent shadow-sm transition-all"
          >
            <Check className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Subheader Toolbar: All Notifications label + Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Bell className="h-4 w-4 text-slate-400" />
          <span>All Notifications</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all"
            >
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="capitalize">{filterOptions.find(o => o.value === filterType)?.label || filterType}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilterType(opt.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                        filterType === opt.value
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filterType === opt.value && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List Stack */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No notifications match your current filter.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-4 transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow-md group"
            >
              {/* Left Column: Dot Indicator + Avatar + Title & Description */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Dot */}
                <div className="pt-2">
                  <span className={`block h-2 w-2 rounded-full ${n.unread ? n.dotColor : 'bg-transparent'}`} />
                </div>

                {/* Avatar Icon */}
                <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-[#182338] border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <User className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {n.message}
                  </p>

                  {/* Priority tag & Timestamp */}
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${n.priorityColor}`}>
                      {n.priority}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {n.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Icons: Mark Read & Delete */}
              <div className="flex items-center gap-3 shrink-0 pl-2">
                <button
                  onClick={() => handleToggleRead(n.id)}
                  title={n.unread ? "Mark as read" : "Mark as unread"}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Check className={`h-4 w-4 ${!n.unread ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  title="Delete notification"
                  className="p-1.5 text-rose-500/80 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
