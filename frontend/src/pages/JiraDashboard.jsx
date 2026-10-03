import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, 
  ArrowUpRight, 
  Zap, 
  Award, 
  Target, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Calendar,
  BarChart2,
  List,
  X,
  Inbox
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { 
  useGetDashboardMetricsQuery, 
  useGetIssuesQuery, 
  useGetProjectsQuery,
  useCreateIssueMutation 
} from '../api/devflowApi';

export default function JiraDashboard() {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newStatus, setNewStatus] = useState('To Do');
  const [chartView, setChartView] = useState('chart');

  const user = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  // Real-time API queries
  const { data: metrics } = useGetDashboardMetricsQuery(undefined, { pollingInterval: 5000 });
  const { data: issues = [] } = useGetIssuesQuery(undefined, { pollingInterval: 5000 });
  const { data: projects = [] } = useGetProjectsQuery(undefined, { pollingInterval: 5000 });
  const [createIssueApi] = useCreateIssueMutation();

  const recentWork = issues.slice(0, 5).map(issue => ({
    id: issue.id || issue.key,
    title: issue.title,
    project: issue.project || (projects[0]?.title || 'General'),
    status: issue.status || 'To Do',
    color: issue.status === 'Done' ? 'bg-emerald-400' : issue.status === 'In Progress' ? 'bg-blue-400' : 'bg-slate-400'
  }));

  // Dynamic activity based on actual issues
  const teamActivity = issues.slice(0, 5).map((issue, idx) => ({
    id: issue.id || idx,
    author: issue.assignee || user?.name || 'Team Member',
    action: issue.status === 'Done' ? 'completed' : 'updated',
    issue: issue.title,
    project: issue.project || (projects[0]?.title || 'Main Workspace'),
    date: issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recently',
    avatar: issue.assigneeAvatar || user?.avatar || null
  }));

  // Dynamic upcoming deadlines based on active projects/issues
  const upcomingDeadlines = issues.filter(i => i.status !== 'Done').slice(0, 4).map((item, idx) => ({
    id: item.id || idx,
    title: item.title,
    date: item.dueDate || 'Sprint End',
    status: item.priority === 'Critical' || item.priority === 'High' ? 'Critical' : 'In Sprint',
  }));

  // Project Status Overview dynamic data
  const todoCount = metrics?.todoCount ?? issues.filter(i => i.status === 'To Do').length;
  const inProgressCount = metrics?.inProgressCount ?? issues.filter(i => i.status === 'In Progress').length;
  const doneCount = metrics?.doneCount ?? issues.filter(i => i.status === 'Done').length;
  const blockedCount = metrics?.blockedCount ?? issues.filter(i => i.status === 'Blocked').length;

  const projectStatusData = [
    { name: 'To Do', count: todoCount, color: '#64748B' },
    { name: 'In Progress', count: inProgressCount, color: '#3B82F6' },
    { name: 'Done', count: doneCount, color: '#10B981' },
    { name: 'Blocked', count: blockedCount, color: '#EF4444' },
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await createIssueApi({
        title: newTitle,
        project: newProject,
        status: newStatus,
        priority: 'Medium',
        storyPoints: '3 pts'
      }).unwrap();
      setNewTitle('');
      setQuickCreateOpen(false);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  const totalIssuesCount = metrics?.totalIssues ?? issues.length;
  const activeProjectsCount = metrics?.totalProjects ?? projects.length;
  const completionRate = totalIssuesCount > 0 ? Math.round(((metrics?.doneCount ?? 0) / totalIssuesCount) * 100) : 0;

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1400px] mx-auto text-slate-100">
      {/* 1. Welcome Banner */}
      <div className="welcome-hero-banner rounded-2xl p-6 bg-gradient-to-r from-[#2938EE] via-[#4F46E5] to-[#581C87] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Developer'}! 👋
          </h1>
          <p className="text-sm text-indigo-100 mt-1 font-medium">
            Here's what's happening with your workspace today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuickCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white font-semibold text-xs border border-white/10 shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Quick Create
          </button>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || 'User'}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/30 shadow-lg"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-white/20 text-white font-bold text-base flex items-center justify-center ring-2 ring-white/30 shadow-lg">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* 2. Four Color Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Issues (Blue) */}
        <div className="rounded-2xl p-5 bg-[#172554] border border-[#1E40AF]/40 flex flex-col justify-between h-36 shadow-lg hover:border-blue-400/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-200">Total Issues</span>
            <Target className="h-4 w-4 text-blue-300" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">{totalIssuesCount}</div>
            <p className="text-xs text-blue-300 mt-1">{metrics?.doneCount ?? 0} completed</p>
          </div>
        </div>

        {/* Card 2: Active Projects (Dark Green) */}
        <div className="rounded-2xl p-5 bg-[#064E3B] border border-[#047857]/40 flex flex-col justify-between h-36 shadow-lg hover:border-emerald-400/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-200">Active Projects</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">{activeProjectsCount}</div>
            <p className="text-xs text-emerald-300 mt-1">Live in MongoDB</p>
          </div>
        </div>

        {/* Card 3: Team Velocity (Purple) */}
        <div className="rounded-2xl p-5 bg-[#3B0764] border border-[#581C87]/40 flex flex-col justify-between h-36 shadow-lg hover:border-purple-400/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-200">Total Story Points</span>
            <Zap className="h-4 w-4 text-purple-300" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              {issues.reduce((acc, curr) => acc + (parseInt(curr.storyPoints) || 0), 0)}
            </div>
            <p className="text-xs text-purple-300 mt-1">Story points in workspace</p>
          </div>
        </div>

        {/* Card 4: Completion Rate (Brown/Amber) */}
        <div className="rounded-2xl p-5 bg-[#451A03] border border-[#78350F]/40 flex flex-col justify-between h-36 shadow-lg hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-200">Completion Rate</span>
            <Award className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">{completionRate}%</div>
            <p className="text-xs text-amber-300 mt-1">Based on closed tasks</p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: My Recent Work & Team Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: My Recent Work */}
        <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">My Recent Work</h2>
              <p className="text-xs text-slate-400">Issues you're currently working on</p>
            </div>
            <Link
              to="/app/issues"
              className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 group"
            >
              View All <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentWork.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">No work items yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Create your first issue or project to start tracking your development progress.
                </p>
                <button
                  onClick={() => setQuickCreateOpen(true)}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                >
                  Create Issue
                </button>
              </div>
            ) : (
              recentWork.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B]/70 hover:border-slate-600 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.project}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide ${
                    item.status === 'Done'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.status === 'In Progress'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Team Activity */}
        <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Team Activity</h2>
              <p className="text-xs text-slate-400">Recent updates from your team</p>
            </div>
            <Link
              to="/app/issues"
              className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 group"
            >
              View All <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {teamActivity.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">No activity yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Activity feed will update as members create issues, complete sprints, and update tickets.
                </p>
              </div>
            ) : (
              teamActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-xs">
                  {activity.avatar ? (
                    <img
                      src={activity.avatar}
                      alt={activity.author}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-1 ring-slate-700 shrink-0 mt-0.5">
                      {activity.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 leading-snug">
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">{activity.author}</span> {activity.action}{' '}
                      <span className="font-medium text-blue-400 hover:underline cursor-pointer">
                        {activity.issue}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {activity.project} • {activity.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Lower Section: Project Status Overview (Donut Chart) & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Project Status Overview */}
        <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Project Status Overview</h2>
              <p className="text-xs text-slate-400">Current status across all projects</p>
            </div>
            <div className="flex items-center bg-[#141E33] border border-slate-800 rounded-lg p-0.5">
              <button 
                onClick={() => setChartView('chart')}
                className={`p-1.5 rounded-md transition-colors ${chartView === 'chart' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Chart View"
              >
                <BarChart2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setChartView('list')}
                className={`p-1.5 rounded-md transition-colors ${chartView === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {chartView === 'chart' ? (
            /* Donut Chart with Centered Total */
            <div className="relative flex flex-col items-center justify-center pt-2">
              <div className="h-56 w-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={totalIssuesCount > 0 ? projectStatusData : [{ name: 'Empty', count: 1, color: '#1E293B' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={totalIssuesCount > 0 ? 4 : 0}
                      dataKey="count"
                      strokeWidth={0}
                    >
                      {(totalIssuesCount > 0 ? projectStatusData : [{ name: 'Empty', count: 1, color: '#1E293B' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {totalIssuesCount > 0 && (
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
                {/* Centered Total label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-extrabold text-white">{totalIssuesCount}</span>
                  <span className="text-xs text-slate-400 font-medium">Total</span>
                </div>
              </div>

              {/* Custom Legend underneath Donut */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-4 w-full max-w-sm px-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                  <span className="text-slate-300">To Do</span>
                  <span className="text-white font-bold ml-auto font-mono bg-slate-800/80 px-2 py-0.5 rounded">{todoCount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-300">In Progress</span>
                  <span className="text-white font-bold ml-auto font-mono bg-slate-800/80 px-2 py-0.5 rounded">{inProgressCount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-300">Done</span>
                  <span className="text-white font-bold ml-auto font-mono bg-slate-800/80 px-2 py-0.5 rounded">{doneCount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-slate-300">Blocked</span>
                  <span className="text-white font-bold ml-auto font-mono bg-slate-800/80 px-2 py-0.5 rounded">{blockedCount}</span>
                </div>
              </div>
            </div>
          ) : (
            /* List / Horizontal Bar View matching design */
            <div className="space-y-5 pt-3 pb-2 px-1">
              {projectStatusData.map((item) => {
                const maxVal = Math.max(totalIssuesCount, 1);
                const percent = Math.round((item.count / maxVal) * 100);
                return (
                  <div key={item.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-32 shrink-0">
                      <span 
                        className="h-3 w-3 rounded-full shrink-0" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-sm font-semibold text-slate-200">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex-1 h-2 rounded-full bg-[#1E293B] overflow-hidden max-w-xs">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percent}%`, 
                          backgroundColor: item.color 
                        }}
                      />
                    </div>

                    <span className="min-w-8 text-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#1E293B] text-white">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Upcoming Deadlines */}
        <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Upcoming Deadlines</h2>
                <p className="text-xs text-slate-400">Projects requiring attention</p>
              </div>
              <div className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">No urgent deadlines</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    All tasks and issues are currently up to date.
                  </p>
                </div>
              ) : (
                upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#141E33] border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800/80 text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-200">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-md text-[11px] font-bold tracking-wide bg-[#7F1D1D]/50 border border-rose-900/60 text-rose-300">
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-6 text-center">
            <span className="text-xs text-slate-400">
              {upcomingDeadlines.length > 0 
                ? `${upcomingDeadlines.length} items requiring attention · Active Sprint`
                : 'No pending overdue items'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Create Modal */}
      {quickCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-400" />
                Quick Create Issue
              </h3>
              <button
                onClick={() => setQuickCreateOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement user profile avatar upload"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {projects.length > 0 ? (
                    projects.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))
                  ) : (
                    <option value="General">General Workspace</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
