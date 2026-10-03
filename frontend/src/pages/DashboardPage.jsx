import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  Plus, 
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const velocityData = [
  { sprint: 'Sprint 29', planned: 40, completed: 38 },
  { sprint: 'Sprint 30', planned: 45, completed: 42 },
  { sprint: 'Sprint 31', planned: 42, completed: 44 },
  { sprint: 'Sprint 32', planned: 50, completed: 48 },
  { sprint: 'Sprint 33', planned: 52, completed: 51 },
  { sprint: 'Sprint 34', planned: 55, completed: 54 },
];

const issueTypeDistribution = [
  { name: 'Features', value: 45, color: '#3b82f6' },
  { name: 'Bugs', value: 20, color: '#ef4444' },
  { name: 'Improvements', value: 25, color: '#10b981' },
  { name: 'Tasks', value: 10, color: '#8b5cf6' },
];

export default function DashboardPage() {
  const [filterPeriod, setFilterPeriod] = useState('This Sprint');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Engineering Velocity &amp; Sprint Health
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active Sprint: 34
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry sourced from DevFlow Spring Boot &amp; MySQL engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/issues"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            New Issue
          </Link>
          <Link
            to="/app/projects"
            className="px-4 py-2 rounded-lg glass-card text-slate-300 hover:text-white font-medium text-xs transition-all"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Backlog Items</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">128</span>
            <span className="text-xs text-emerald-400 font-medium">+8% from last week</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">In Progress / Code Review</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-300">19</span>
            <span className="text-xs text-slate-400 font-medium">Across 4 active repos</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sprint Resolution Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">96.4%</span>
            <span className="text-xs text-emerald-300 font-medium">On track for release</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Critical Blockers</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400">2</span>
            <span className="text-xs text-slate-400 font-medium">Assigned to Lead Architect</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Velocity Comparison */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Sprint Velocity: Planned vs Completed Story Points
              </h3>
              <p className="text-xs text-slate-400">Historical velocity over the last 6 sprints</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" /> Planned
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Completed
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="sprint" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="planned" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Type Pie Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Issue Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown by issue category in active sprint</p>
            
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
            {issueTypeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="text-slate-500 font-mono ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Git & Sprint Activity */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-indigo-400" />
          Recent Git Commits &amp; Linked Issue Lifecycles
        </h3>
        <div className="divide-y divide-slate-800">
          {[
            {
              id: 'DEV-108',
              title: 'Implement JWT Refresh Token Rotation and Redis Revocation',
              author: 'Alex Chen',
              branch: 'feature/jwt-rotation',
              time: '12m ago',
              status: 'MERGED',
            },
            {
              id: 'DEV-105',
              title: 'Optimize MySQL Hibernate indexes on project_id and status',
              author: 'Maria Garcia',
              branch: 'perf/db-indexing',
              time: '45m ago',
              status: 'IN REVIEW',
            },
            {
              id: 'DEV-99',
              title: 'Setup React Hook Form schema validation on Sprint Creation',
              author: 'Chaitanya K.',
              branch: 'fix/form-validation',
              time: '2h ago',
              status: 'RESOLVED',
            },
          ].map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  {item.id}
                </span>
                <span className="text-slate-200 font-medium">{item.title}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.branch}
                </span>
                <span>{item.author}</span>
                <span>{item.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'MERGED' ? 'bg-purple-500/20 text-purple-300' :
                  item.status === 'IN REVIEW' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
