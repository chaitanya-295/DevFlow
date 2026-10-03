import React, { useState } from 'react';
import { X, Users, User, ChevronDown } from 'lucide-react';
import { useCreateTeamMutation, useGetUsersQuery } from '../api/devflowApi';

export default function CreateTeamModal({ isOpen, onClose, onCreated }) {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [teamType, setTeamType] = useState('Cross-functional');
  const [initialMembers, setInitialMembers] = useState([]);
  const [defaultPermissions, setDefaultPermissions] = useState('Member - Standard access');
  const [privateTeam, setPrivateTeam] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [createCalendar, setCreateCalendar] = useState(true);

  const [createTeamApi, { isLoading }] = useCreateTeamMutation();
  const { data: users = [] } = useGetUsersQuery();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      const created = await createTeamApi({
        name: teamName,
        department: teamType,
        description: description || `${teamType} team led by ${teamLead || 'unassigned'}`,
      }).unwrap();

      if (onCreated) {
        onCreated(created);
      }
    } catch (err) {
      console.error('Failed to create team:', err);
    }

    setTeamName('');
    setDescription('');
    setTeamLead('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-[540px] bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Create Team</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a new team to organize people and manage permissions.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 space-y-4 text-xs">
          {/* Team Name */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe the team's purpose and responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Team Lead & Team Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Team Lead <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={teamLead}
                  onChange={(e) => setTeamLead(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-9"
                >
                  <option value="">Select team lead</option>
                  {users.map((u) => (
                    <option key={u.id || u._id} value={u.name || u.email}>
                      {u.name || u.email}
                    </option>
                  ))}
                  {users.length === 0 && (
                    <option value="Chaitanya Kamble">Chaitanya Kamble</option>
                  )}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">
                Team Type
              </label>
              <div className="relative">
                <select
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-9"
                >
                  <option value="Cross-functional">🤝 Cross-functional</option>
                  <option value="Engineering">💻 Engineering</option>
                  <option value="Product">🎯 Product</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📈 Marketing</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Initial Members */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Initial Members
            </label>
            <div className="relative">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && !initialMembers.includes(e.target.value)) {
                    setInitialMembers([...initialMembers, e.target.value]);
                  }
                }}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-400 focus:outline-none focus:border-blue-500 cursor-pointer pr-9"
              >
                <option value="">Add team members...</option>
                {users.map((u) => (
                  <option key={u.id || u._id} value={u.name || u.email}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {initialMembers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {initialMembers.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#182338] border border-slate-700 text-slate-200 text-[11px]">
                    {m}
                    <button
                      type="button"
                      onClick={() => setInitialMembers(initialMembers.filter(item => item !== m))}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              You can add more members after creating the team
            </p>
          </div>

          {/* Default Permissions */}
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">
              Default Permissions
            </label>
            <div className="relative">
              <select
                value={defaultPermissions}
                onChange={(e) => setDefaultPermissions(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#121724] border border-[#232D42] text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer pr-9"
              >
                <option value="Member - Standard access">👤 Member - Standard access</option>
                <option value="Admin - Full access">🛡️ Admin - Full access</option>
                <option value="Viewer - Read-only access">👁️ Viewer - Read-only access</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Team Settings Toggles */}
          <div className="pt-2 space-y-3">
            <span className="block text-slate-200 font-semibold">Team Settings</span>

            {/* Toggle 1: Private team */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Private team</span>
              <button
                type="button"
                onClick={() => setPrivateTeam(!privateTeam)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                  privateTeam ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full shadow-md bg-white transform transition-transform ${
                    privateTeam ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Enable team notifications */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Enable team notifications</span>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                  notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full shadow-md bg-white transform transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Create team calendar */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Create team calendar</span>
              <button
                type="button"
                onClick={() => setCreateCalendar(!createCalendar)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                  createCalendar ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full shadow-md bg-white transform transition-transform ${
                    createCalendar ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#121724] dark:hover:bg-[#1A2234] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
