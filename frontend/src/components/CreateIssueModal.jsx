import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProjectsQuery, useGetUsersQuery, useCreateIssueMutation } from '../api/devflowApi';
import { 
  Bug, 
  X, 
  ChevronDown,
  Layers,
  FileText,
  AlertCircle,
  User,
  Hash,
  Tag
} from 'lucide-react';

export default function CreateIssueModal({ isOpen, onClose, onCreated }) {
  const { data: projects = [] } = useGetProjectsQuery(undefined, { pollingInterval: 5000 });
  const { data: users = [] } = useGetUsersQuery(undefined, { pollingInterval: 5000 });
  const [createIssueApi] = useCreateIssueMutation();
  const authUser = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  const [project, setProject] = useState('');
  const [issueType, setIssueType] = useState('Task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [storyPoints, setStoryPoints] = useState('3');
  const [labels, setLabels] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const created = await createIssueApi({
        title,
        description,
        project: project || (projects[0]?.title || 'General'),
        issueType: issueType || 'Task',
        priority,
        assignee: assignee || (authUser?.name || 'Unassigned'),
        assigneeAvatar: users.find(u => u.name === assignee)?.avatar || authUser?.avatar || null,
        storyPoints: storyPoints ? `${storyPoints} pts` : '3 pts',
        labels: labels ? labels.split(',').map(l => l.trim()).filter(Boolean) : ['feature'],
        status: 'To Do',
      }).unwrap();

      if (onCreated) {
        onCreated(created);
      }
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setProject('');
    setIssueType('');
    setPriority('Medium');
    setAssignee('');
    setStoryPoints('');
    setLabels('');
    onClose();
  };

  const priorityColors = {
    Low: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    High: 'bg-orange-500',
    Critical: 'bg-rose-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-[540px] bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-blue-600 dark:text-white" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create New Issue
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              Create a new issue to track work, bugs, or feature requests.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer shadow-sm"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-6 space-y-4 text-xs">
          {/* Row 1: Project & Issue Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Project <span className="text-slate-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={project || (projects[0]?.title || '')}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#141B2D] border border-blue-500/80 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {projects.length === 0 ? (
                    <option value="General" className="bg-[#141B2D] text-white">General Project</option>
                  ) : (
                    projects.map((p) => (
                      <option key={p.id} value={p.title} className="bg-[#141B2D] text-white">
                        {p.title}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Issue Type <span className="text-slate-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Task" className="bg-[#141B2D] text-white">Task</option>
                  <option value="Bug" className="bg-[#141B2D] text-white">Bug</option>
                  <option value="Story" className="bg-[#141B2D] text-white">Story</option>
                  <option value="Epic" className="bg-[#141B2D] text-white">Epic</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Title */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Title <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Row 4: Priority, Assignee, Story Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Priority
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <span className={`h-2.5 w-2.5 rounded-full ${priorityColors[priority] || 'bg-amber-400'}`} />
                </div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full pl-7 pr-7 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Low" className="bg-[#141B2D] text-white">Low</option>
                  <option value="Medium" className="bg-[#141B2D] text-white">Medium</option>
                  <option value="High" className="bg-[#141B2D] text-white">High</option>
                  <option value="Critical" className="bg-[#141B2D] text-white">Critical</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Assignee
              </label>
              <div className="relative">
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full pl-3 pr-7 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#141B2D] text-slate-400">Assign to...</option>
                  {authUser?.name && (
                    <option value={authUser.name} className="bg-[#141B2D] text-white">
                      {authUser.name} (You)
                    </option>
                  )}
                  {users.map((u) => (
                    u.name !== authUser?.name && (
                      <option key={u.id || u.email} value={u.name} className="bg-[#141B2D] text-white">
                        {u.name}
                      </option>
                    )
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Story Points
              </label>
              <div className="relative">
                <select
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(e.target.value)}
                  className="w-full pl-3 pr-7 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#141B2D] text-slate-400">Points</option>
                  <option value="1" className="bg-[#141B2D] text-white">1 Point</option>
                  <option value="2" className="bg-[#141B2D] text-white">2 Points</option>
                  <option value="3" className="bg-[#141B2D] text-white">3 Points</option>
                  <option value="5" className="bg-[#141B2D] text-white">5 Points</option>
                  <option value="8" className="bg-[#141B2D] text-white">8 Points</option>
                  <option value="13" className="bg-[#141B2D] text-white">13 Points</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 5: Labels */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Labels
            </label>
            <input
              type="text"
              placeholder="Add labels (comma separated)"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2D] border border-[#222D42] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#1E2638]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#141B2D] dark:hover:bg-[#1E273D] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
