import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, ChevronDown, Calendar } from 'lucide-react';
import { useCreateProjectMutation, useGetUsersQuery, useGetTeamsQuery } from '../api/devflowApi';

export default function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [description, setDescription] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [defaultTeam, setDefaultTeam] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [projectTemplate, setProjectTemplate] = useState('Kanban');
  const [isPublic, setIsPublic] = useState(false);

  const [createProjectApi, { isLoading: isSubmitting }] = useCreateProjectMutation();
  const { data: users = [] } = useGetUsersQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const currentUser = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  if (!isOpen) return null;

  // Auto-generate project key from project name if user hasn't typed a custom key
  const handleNameChange = (e) => {
    const val = e.target.value;
    setProjectName(val);
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const derived = words.length === 1 
        ? words[0].slice(0, 4).toUpperCase() 
        : words.slice(0, 4).map(w => w[0]).join('').toUpperCase();
      setProjectKey(derived);
    } else {
      setProjectKey('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !projectKey.trim()) return;

    // Pick avatar if user is found
    const selectedUser = users.find(u => (u.name || u.username) === projectLead);
    const leadAvatar = selectedUser?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80';
    const effectiveLead = projectLead || currentUser?.name || currentUser?.username || 'Project Lead';

    try {
      const created = await createProjectApi({
        title: projectName.trim(),
        key: projectKey.trim().toUpperCase(),
        description: description.trim(),
        lead: effectiveLead,
        leadAvatar,
        team: defaultTeam || '',
        startDate,
        targetEndDate,
        template: projectTemplate,
        isPublic,
        tag: 'dev',
        status: 'Active',
        icon: projectTemplate === 'Kanban' ? '📋' : projectTemplate === 'Scrum' ? '⚡' : '📁',
        issuesText: '0/0 issues',
        completedIssues: 0,
        totalIssues: 0,
        progress: 0,
        leftStripe: 'border-l-blue-500',
        statusBg: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40'
      }).unwrap();

      if (onCreated) {
        onCreated(created);
      }

      // Reset
      setProjectName('');
      setProjectKey('');
      setDescription('');
      setProjectLead('');
      setDefaultTeam('');
      setStartDate('');
      setTargetEndDate('');
      setProjectTemplate('Kanban');
      setIsPublic(false);
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-[540px] bg-white dark:bg-[#0A0D14] border border-slate-200 dark:border-[#1A2234] rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Create Project</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Set up a new project to organize your team's work.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer shadow-sm"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4 text-xs">
          {/* Project Name * */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter project name"
              value={projectName}
              onChange={handleNameChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          {/* Project Key * */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Project Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="e.g., PROJ"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase font-mono text-sm tracking-wider"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              A short identifier for your project (2-10 characters)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Project Lead * & Default Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Project Lead <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={projectLead}
                  onChange={(e) => setProjectLead(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-blue-500 pr-9 cursor-pointer"
                >
                  <option value="">Select project lead</option>
                  {currentUser && (
                    <option value={currentUser.name || currentUser.username}>
                      {currentUser.name || currentUser.username} (You)
                    </option>
                  )}
                  {users
                    .filter(u => u.name !== currentUser?.name && u.username !== currentUser?.username)
                    .map((u) => (
                      <option key={u.id || u.email} value={u.name || u.username}>
                        {u.name || u.username} {u.role ? `(${u.role})` : ''}
                      </option>
                    ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Default Team
              </label>
              <div className="relative">
                <select
                  value={defaultTeam}
                  onChange={(e) => setDefaultTeam(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-blue-500 pr-9 cursor-pointer"
                >
                  <option value="">Select team</option>
                  {teams.map((t) => (
                    <option key={t.id || t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  {teams.length === 0 && (
                    <>
                      <option value="Frontend Team">Frontend Team</option>
                      <option value="Backend Team">Backend Team</option>
                      <option value="Core Engineering">Core Engineering</option>
                    </>
                  )}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Start Date & Target End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Target End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetEndDate}
                  onChange={(e) => setTargetEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Project Template */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Project Template
            </label>
            <div className="relative">
              <select
                value={projectTemplate}
                onChange={(e) => setProjectTemplate(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#101625] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-blue-500 pr-9 cursor-pointer"
              >
                <option value="Kanban">📋 Kanban</option>
                <option value="Scrum">⚡ Scrum</option>
                <option value="Bug Tracking">🐛 Bug Tracking</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Make project public Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                isPublic ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Make project public
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#1A2234]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#151D2F] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
