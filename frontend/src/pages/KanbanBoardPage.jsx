import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  X,
  Inbox
} from 'lucide-react';
import CreateIssueModal from '../components/CreateIssueModal';
import { useGetIssuesQuery, useUpdateIssueStatusMutation, useCreateIssueMutation, useGetProjectsQuery } from '../api/devflowApi';

const COLUMNS = ['To Do', 'In Progress', 'Blocked', 'Done'];

export default function KanbanBoardPage() {
  const { data: rawIssues = [], isLoading } = useGetIssuesQuery(undefined, { pollingInterval: 3000 });
  const { data: projects = [] } = useGetProjectsQuery(undefined, { pollingInterval: 4000 });
  const [updateStatusApi] = useUpdateIssueStatusMutation();
  const [createIssueApi] = useCreateIssueMutation();
  const user = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New issue form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStatus, setNewStatus] = useState('To Do');
  const [newPoints, setNewPoints] = useState('3 pts');
  const [newProject, setNewProject] = useState('');

  const getPriorityBadgeClasses = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p.includes('crit')) {
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#991B1B]/30 dark:text-rose-300 dark:border-rose-700/30';
    }
    if (p.includes('high')) {
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-[#9A3412]/30 dark:text-orange-300 dark:border-orange-700/30';
    }
    if (p.includes('med')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#B45309]/30 dark:text-amber-300 dark:border-amber-600/30';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/30';
  };

  const issues = rawIssues.map(i => ({
    id: i.id || i.key,
    title: i.title,
    description: i.description || 'No description provided.',
    status: i.status || 'To Do',
    priority: i.priority || 'Medium',
    leftStripe: i.status === 'Done' ? 'border-l-emerald-500' :
                i.status === 'In Progress' ? 'border-l-blue-500' :
                i.status === 'Blocked' ? 'border-l-rose-500' :
                'border-l-slate-400 dark:border-l-slate-600',
    points: i.storyPoints || '3 pts',
    assignee: i.assignee || user?.name || 'Unassigned',
    avatar: i.assigneeAvatar || user?.avatar || null,
    project: i.project || (projects[0]?.title || 'Main Workspace'),
  }));

  const filteredIssues = issues.filter(issue => {
    const matchQuery = (issue.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (issue.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchProject = selectedProject === 'All Projects' || issue.project === selectedProject;
    return matchQuery && matchProject;
  });

  const handleCreateIssue = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createIssueApi({
        title: newTitle,
        description: newDescription || 'No description provided.',
        status: newStatus,
        priority: newPriority,
        storyPoints: newPoints,
        project: newProject || (projects[0]?.title || 'General'),
        assignee: user?.name || 'Developer',
        assigneeAvatar: user?.avatar || null
      }).unwrap();
      setNewTitle('');
      setNewDescription('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  const moveStatus = async (id, targetStatus) => {
    try {
      await updateStatusApi({ id, status: targetStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update issue status:', err);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Top Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your team's work with visual boards
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto hover:shadow-blue-500/25"
        >
          <Plus className="h-4 w-4" />
          Create Issue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 sm:flex-none">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="All Projects">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* More Filters button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          More Filters
        </button>
      </div>

      {/* Kanban 4 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((columnName) => {
          const colIssues = filteredIssues.filter(i => i.status === columnName);
          return (
            <div
              key={columnName}
              className="rounded-2xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] p-3 flex flex-col min-h-[600px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {columnName}
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-[#1E293B] text-slate-700 dark:text-slate-400">
                  {colIssues.length}
                </span>
              </div>

              {/* Issues Card Stack */}
              <div className="space-y-3 flex-1 flex flex-col">
                {colIssues.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 dark:border-[#1E293B] rounded-xl my-1 bg-white/40 dark:bg-transparent">
                    <p className="text-xs font-medium text-slate-500">No issues in {columnName}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5">Drag or create cards here</p>
                  </div>
                ) : (
                  colIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`rounded-xl bg-white dark:bg-[#131926] border border-slate-200 dark:border-[#1E293B]/80 hover:border-slate-300 dark:hover:border-slate-600 p-4 transition-all shadow-sm hover:shadow-md group border-l-4 ${issue.leftStripe}`}
                    >
                      {/* Header Row: Title & Priority Pill */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {issue.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border ${getPriorityBadgeClasses(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                        {issue.description}
                      </p>

                      {/* Assignee & Points Row */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60 mb-2">
                        <div className="flex items-center gap-2">
                          {issue.avatar ? (
                            <img
                              src={issue.avatar}
                              alt={issue.assignee}
                              className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700">
                              {(issue.assignee || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[11px] text-slate-800 dark:text-slate-300 font-medium">
                            {issue.assignee}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {issue.points}
                        </span>
                      </div>

                      {/* Project Name and Column Move Selector */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span className="truncate flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                          📁 {issue.project}
                        </span>
                        <select
                          value={issue.status}
                          onChange={(e) => moveStatus(issue.id, e.target.value)}
                          className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Blocked">Blocked</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating New Issue */}
      <CreateIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => setIsModalOpen(false)}
      />
    </div>
  );
}
