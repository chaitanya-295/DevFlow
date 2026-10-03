import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  SlidersHorizontal, 
  Calendar, 
  User, 
  X,
  Layers,
  Inbox,
  Trash2
} from 'lucide-react';
import CreateIssueModal from '../components/CreateIssueModal';
import { useGetIssuesQuery, useCreateIssueMutation, useDeleteIssueMutation, useGetProjectsQuery } from '../api/devflowApi';

export default function IssuesPage() {
  const { data: rawIssues = [], isLoading } = useGetIssuesQuery(undefined, { pollingInterval: 4000 });
  const { data: projects = [] } = useGetProjectsQuery(undefined, { pollingInterval: 4000 });
  const [createIssueApi] = useCreateIssueMutation();
  const [deleteIssueApi] = useDeleteIssueMutation();
  const user = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Issue State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newStatus, setNewStatus] = useState('To Do');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newPoints, setNewPoints] = useState('5 pts');

  const issuesList = rawIssues.map((item) => ({
    id: item.id || item.key,
    key: item.key || `DEV-${item.id}`,
    title: item.title,
    description: item.description || 'No description provided.',
    assignee: item.assignee || user?.name || 'Unassigned',
    avatar: item.assigneeAvatar || user?.avatar || null,
    project: item.project || (projects[0]?.title || 'Main Workspace'),
    status: item.status || 'To Do',
    priority: item.priority || 'Medium',
    priorityBg: item.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#991B1B]/30 dark:text-rose-300 dark:border-rose-700/30' :
                item.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-[#9A3412]/30 dark:text-orange-300 dark:border-orange-700/30' :
                item.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#B45309]/30 dark:text-amber-300 dark:border-amber-600/30' :
                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/30',
    statusBg: item.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40' :
              item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/40' :
              item.status === 'Blocked' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/40' :
              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    leftStripe: item.status === 'Done' ? 'border-l-emerald-500' :
                item.status === 'In Progress' ? 'border-l-blue-500' :
                item.status === 'Blocked' ? 'border-l-rose-500' :
                'border-l-slate-400 dark:border-l-slate-600',
    points: item.storyPoints || '3 pts',
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'
  }));

  const filteredIssues = issuesList.filter((item) => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All Priority' || item.priority === selectedPriority;
    const matchesAssignee = selectedAssignee === 'All Assignees' || item.assignee === selectedAssignee;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleCreate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createIssueApi({
        title: newTitle,
        description: newDescription || 'No description provided.',
        assignee: user?.name || 'Developer',
        assigneeAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        project: newProject || (projects[0]?.title || 'General'),
        status: newStatus,
        priority: newPriority,
        storyPoints: newPoints
      }).unwrap();

      setNewTitle('');
      setNewDescription('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Issues
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Track and manage all project issues
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

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
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

        {/* All Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="All Status">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* All Priority Dropdown */}
        <div className="relative">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="All Priority">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* All Assignees Dropdown */}
        <div className="relative">
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="All Assignees">All Assignees</option>
            <option value="Lucy Pearl">Lucy Pearl</option>
            <option value="Finn Cole">Finn Cole</option>
            <option value="Cole Bennett">Cole Bennett</option>
            <option value="Zoe Blake">Zoe Blake</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* More Filters button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          More Filters
        </button>
      </div>

      {/* Issues Stack Cards List */}
      {filteredIssues.length === 0 ? (
        <div className="py-20 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] flex flex-col items-center justify-center text-center px-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No issues found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
            {searchQuery || selectedStatus !== 'All Status' || selectedPriority !== 'All Priority'
              ? 'No issues match your active search and filter criteria.'
              : 'There are no issues logged in this project yet. Create your first issue to track tasks and bugs.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Create Issue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 border-l-4 ${item.leftStripe}`}
            >
              {/* Top row: Title, Description, and Badges (Priority & Status) */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
                    {item.description}
                  </p>
                </div>

                {/* Status and Priority Pill Pair + Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border shadow-sm ${item.priorityBg}`}>
                    {item.priority}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border shadow-sm ${item.statusBg}`}>
                    {item.status}
                  </span>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete issue "${item.title}"?`)) {
                        try {
                          await deleteIssueApi(item.id).unwrap();
                        } catch (err) {
                          console.error('Failed to delete issue:', err);
                        }
                      }
                    }}
                    title="Delete issue"
                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Assignee + Project and Story Points + Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  {/* Assignee */}
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.assignee}
                        className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {(item.assignee || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-slate-800 dark:text-slate-300 font-semibold text-xs">
                      {item.assignee}
                    </span>
                  </div>

                  {/* Project */}
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                    <span>📁</span>
                    <span>{item.project}</span>
                  </div>
                </div>

                {/* Points and Date */}
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-[#131926] px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 font-semibold">
                    {item.points}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(newIssue) => {
          setIssues(prev => [
            {
              id: newIssue.id,
              title: newIssue.title,
              description: newIssue.description || 'No description provided.',
              assignee: newIssue.assignee || 'Lily Grace',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
              project: newIssue.project,
              date: 'Today',
              priority: newIssue.priority,
              priorityColor: newIssue.priority === 'Critical' ? 'bg-rose-500' : newIssue.priority === 'High' ? 'bg-orange-500' : 'bg-amber-400',
              points: newIssue.storyPoints,
              status: newIssue.status,
              key: newIssue.key
            },
            ...prev
          ]);
        }}
      />
    </div>
  );
}
