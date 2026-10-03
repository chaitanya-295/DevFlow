import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Layers,
  ShieldCheck,
  Zap,
  Terminal,
  Users,
  BarChart,
  Cpu,
  Database,
  Container,
  Flame,
  Clock,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockChartData = [
  { day: 'Mon', completed: 12, open: 28 },
  { day: 'Tue', completed: 19, open: 24 },
  { day: 'Wed', completed: 27, open: 20 },
  { day: 'Thu', completed: 35, open: 15 },
  { day: 'Fri', completed: 48, open: 9 },
  { day: 'Sat', completed: 52, open: 6 },
  { day: 'Sun', completed: 58, open: 4 },
];

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div className="relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[400px] right-[-100px] w-[500px] h-[300px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner shadow-blue-500/10">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          Production-Ready Architecture · Spring Boot + React + Docker
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Build faster with <span className="glow-text">DevFlow</span>.
          <br />
          Enterprise Issue & Sprint Intelligence.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          The unified developer workstation for engineering teams. Manage issues, track sprint velocity, automate Git lifecycles, and govern microservices with Spring Boot 3 &amp; React.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/app/dashboard"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 group"
              >
                <LayoutDashboard className="h-5 w-5" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/app/kanban"
                className="px-8 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-semibold text-base hover:bg-slate-800/60 transition-all border border-slate-700 hover:border-slate-500 flex items-center gap-2"
              >
                <Terminal className="h-4 w-4 text-emerald-400" />
                Open Kanban Board
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/app/dashboard"
                className="px-8 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-semibold text-base hover:bg-slate-800/60 transition-all border border-slate-700 hover:border-slate-500 flex items-center gap-2"
              >
                <Terminal className="h-4 w-4 text-emerald-400" />
                Live Interactive Demo
              </Link>
            </>
          )}
        </div>

        {/* App Showcase Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-6xl rounded-2xl p-2 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent border border-white/10 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800/80 p-6 text-left shadow-2xl">
            {/* Mock Topbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-400 truncate">devflow://workspace/sprint-34/velocity</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 shrink-0">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 whitespace-nowrap font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  Live Sync (RTK Query Active)
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px] whitespace-nowrap">Sprint #34</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Sprint Burndown</p>
                <h3 className="text-2xl font-bold text-white mt-1">94.2%</h3>
                <span className="text-xs text-emerald-400 font-medium">+14% velocity</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Active Issues</p>
                <h3 className="text-2xl font-bold text-white mt-1">42</h3>
                <span className="text-xs text-blue-400 font-medium">8 in code review</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Critical Bugs</p>
                <h3 className="text-2xl font-bold text-rose-400 mt-1">2</h3>
                <span className="text-xs text-slate-400 font-medium">Avg resolution 1.2h</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Active Contributors</p>
                <h3 className="text-2xl font-bold text-indigo-300 mt-1">18 Devs</h3>
                <span className="text-xs text-purple-400 font-medium">Multi-tenant sync</span>
              </div>
            </div>

            {/* Chart + Kanban peek */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-blue-400" />
                    Weekly Issue Velocity &amp; Burnup (Recharts)
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 shadow-xl text-left">
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1.5">
                                  <span>completed :</span>
                                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{payload[0].value}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Kanban column preview */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">In Progress (3)</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Sprint #34</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-400">DEV-108</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">CRITICAL</span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 mt-1">Implement JWT Refresh Token Rotation</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Backend/Security</span>
                        <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">CK</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-blue-400">DEV-114</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">FEATURE</span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 mt-1">RTK Query Cache Invalidation on Mutations</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Frontend/State</span>
                        <span className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white">AL</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                  <Link to="/app/issues" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-center gap-1">
                    Open Kanban Board <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Modern Developer Teams
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Eliminate communication gaps between product backlogs and active Git branches with real-time issue lifecycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Redux Toolkit &amp; RTK Query</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Zero-effort caching, optimistic updates, and automatic cache invalidation for snappy task dragging and real-time state sync.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Spring Security &amp; JWT</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stateless role-based access control with BCrypt password hashing, granular API endpoints, and safe multi-tenant project separation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Container className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dockerized Architecture</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Reproducible multi-container Docker Compose setup for instant orchestration across frontend, backend, and MySQL database.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-blue-500/30 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to upgrade your team's sprint agility?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base">
            Experience DevFlow today. Track tasks, measure velocity, and deliver on time with high-velocity collaboration.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/app/dashboard"
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Link>
                <Link
                  to="/app/kanban"
                  className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
                >
                  Kanban Board
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/app/dashboard"
                  className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
                >
                  Explore Demo App
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
