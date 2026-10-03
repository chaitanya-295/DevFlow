import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Webhook, 
  Puzzle, 
  Plus, 
  Trash2, 
  ChevronDown, 
  X,
  UserPlus,
  Loader2
} from 'lucide-react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation, useCreateUserMutation } from '../api/devflowApi';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const { data: usersData = [], isLoading } = useGetUsersQuery(undefined, { pollingInterval: 4000 });
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createUser] = useCreateUserMutation();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite modal form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const users = usersData.map((u) => ({
    id: u.id || u._id,
    name: u.name || 'User',
    email: u.email || '',
    status: 'Active',
    role: u.role || 'Member',
    avatar: u.avatar || null,
  }));

  // Webhooks state
  const [webhooks, setWebhooks] = useState([
    { id: 'wh-1', url: 'https://api.github.com/webhook', events: ['issue.created', 'issue.updated'], status: 'Active' },
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState('issue.created');

  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', description: 'Get notifications in Slack', connected: true, icon: '💬' },
    { id: 'github', name: 'GitHub', description: 'Link commits to issues', connected: false, icon: '🐙' },
    { id: 'discord', name: 'Discord', description: 'Team communication', connected: true, icon: '🎮' },
    { id: 'figma', name: 'Figma', description: 'Design collaboration', connected: false, icon: '🎨' },
    { id: 'gdrive', name: 'Google Drive', description: 'File storage', connected: false, icon: '📁' },
    { id: 'zoom', name: 'Zoom', description: 'Video meetings', connected: true, icon: '📹' },
  ]);

  // Notification Preferences toggles
  const [prefs, setPrefs] = useState({
    email: true,
    push: false,
    mentions: true,
    projectUpdates: false,
  });

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIntegration = (id) => {
    setIntegrations(prev => prev.map(item => item.id === id ? { ...item, connected: !item.connected } : item));
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole({ id, role: newRole }).unwrap();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    try {
      await createUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        department: 'Engineering',
        location: 'Remote',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inviteName)}`
      }).unwrap();
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
    } catch (err) {
      console.error('Failed to invite user in settings:', err);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage your workspace settings and preferences
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 pb-3 transition-colors relative shrink-0 ${
            activeTab === 'users' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
          {activeTab === 'users' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 pb-3 transition-colors relative shrink-0 ${
            activeTab === 'roles' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Roles</span>
          {activeTab === 'roles' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center gap-2 pb-3 transition-colors relative shrink-0 ${
            activeTab === 'webhooks' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Webhook className="h-4 w-4" />
          <span>Webhooks</span>
          {activeTab === 'webhooks' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 pb-3 transition-colors relative shrink-0 ${
            activeTab === 'integrations' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Puzzle className="h-4 w-4" />
          <span>Integrations</span>
          {activeTab === 'integrations' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Container Card: Team Members */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] p-4 sm:p-6 shadow-sm space-y-5">
          {/* Subheader + Invite User Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Team Members</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage users in your workspace</p>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto hover:shadow-blue-500/25"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite User
            </button>
          </div>

          {/* Members List Stack */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-3.5 sm:p-4 transition-all flex items-center justify-between gap-2.5 sm:gap-4 overflow-hidden shadow-sm"
              >
                {/* Left: Avatar + Name & Email */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 select-none">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Right: Active pill + Role Dropdown + Trash action */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-white dark:bg-white text-slate-900 shadow-sm border border-slate-200 dark:border-transparent">
                    {user.status}
                  </span>

                  {/* Role Selector dropdown */}
                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="appearance-none pl-2 sm:pl-3 pr-6 sm:pr-8 py-1 sm:py-1.5 rounded-lg bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer w-22 sm:w-28 shadow-sm"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    title="Remove user"
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div className="rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] p-6 shadow-sm space-y-5">
          {/* Subheader + Create Role Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Roles &amp; Permissions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure user roles and their permissions</p>
            </div>

            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 dark:bg-white dark:hover:bg-slate-100 text-slate-800 dark:text-slate-900 font-semibold text-xs border border-slate-200 dark:border-transparent shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Role
            </button>
          </div>

          {/* Roles Stack List */}
          <div className="space-y-4">
            {/* Admin Role */}
            <div className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-5 transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#182338] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent font-medium">
                      {users.filter(u => (u.role || '').toLowerCase() === 'admin').length} {users.filter(u => (u.role || '').toLowerCase() === 'admin').length === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full access to all features and settings
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-[#182338] dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 transition-colors">
                    Edit
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Permission Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['Create Projects', 'Manage Users', 'Delete Issues', 'Access Settings'].map(p => (
                  <span key={p} className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50/80 text-blue-700 border border-blue-200/80 dark:bg-[#111726] dark:border-slate-800 dark:text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Member Role */}
            <div className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-5 transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Member</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#182338] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent font-medium">
                      {users.filter(u => (u.role || '').toLowerCase() === 'member').length} {users.filter(u => (u.role || '').toLowerCase() === 'member').length === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standard user with project access
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-[#182338] dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 transition-colors">
                    Edit
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Permission Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['Create Issues', 'Edit Issues', 'Comment', 'View Projects'].map(p => (
                  <span key={p} className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50/80 text-blue-700 border border-blue-200/80 dark:bg-[#111726] dark:border-slate-800 dark:text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Viewer Role */}
            <div className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-5 transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Viewer</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#182338] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent font-medium">
                      {users.filter(u => (u.role || '').toLowerCase() === 'viewer').length} {users.filter(u => (u.role || '').toLowerCase() === 'viewer').length === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Read-only access across assigned projects
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-[#182338] dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 transition-colors">
                    Edit
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Permission Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['View Projects', 'View Issues', 'View Reports'].map(p => (
                  <span key={p} className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50/80 text-blue-700 border border-blue-200/80 dark:bg-[#111726] dark:border-slate-800 dark:text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] p-6 shadow-sm space-y-6">
          {/* Subheader + Add Webhook Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Webhooks</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure webhooks for external integrations</p>
            </div>

            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 dark:bg-white dark:hover:bg-slate-100 text-slate-800 dark:text-slate-900 font-semibold text-xs border border-slate-200 dark:border-transparent shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Webhook
            </button>
          </div>

          {/* Form Inputs Row: Webhook URL & Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Webhook URL</label>
              <input
                type="text"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Events</label>
              <div className="relative">
                <select
                  value={newWebhookEvent}
                  onChange={(e) => setNewWebhookEvent(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="issue.created">issue.created</option>
                  <option value="issue.updated">issue.updated</option>
                  <option value="project.created">project.created</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!newWebhookUrl.trim()) return;
              setWebhooks(prev => [
                ...prev,
                { id: `wh-${Date.now()}`, url: newWebhookUrl, events: [newWebhookEvent], status: 'Active' }
              ]);
              setNewWebhookUrl('');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start hover:shadow-blue-500/25"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Webhook Endpoint
          </button>

          {/* Existing Webhooks Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200">Configured Webhooks ({webhooks.length})</h3>

            {webhooks.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">
                No webhooks configured yet.
              </div>
            ) : (
              webhooks.map((wh) => (
                <div key={wh.id} className="rounded-xl bg-slate-50/70 dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-4 transition-all flex items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {wh.url}
                    </p>
                    <div className="flex items-center gap-2">
                      {wh.events.map(ev => (
                        <span key={ev} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 dark:bg-[#111726] dark:border-slate-800 dark:text-slate-300">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-900 shadow-sm border border-slate-200 dark:border-transparent">
                      {wh.status}
                    </span>
                    <button 
                      onClick={() => setWebhooks(prev => prev.filter(item => item.id !== wh.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Top Card: Integrations */}
          <div className="rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Integrations</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Connect with external tools and services</p>
            </div>

            {/* 3 Columns Grid for 6 Integrations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-4 transition-all flex flex-col justify-between h-36 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-[#182338]">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                      item.connected
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-[#151D2C] dark:hover:bg-[#1A2538] dark:text-slate-200 dark:border-slate-700/80'
                        : 'bg-white hover:bg-slate-50 dark:bg-white dark:hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 dark:border-transparent shadow-sm'
                    }`}
                  >
                    {item.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card: Notification Preferences */}
          <div className="rounded-2xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-[#1C2537] p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose how you want to be notified</p>
            </div>

            <div className="space-y-5">
              {/* Email Notifications */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Email Notifications</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Receive updates via email</p>
                </div>
                <button
                  onClick={() => togglePref('email')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    prefs.email ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full shadow-sm transform transition-transform ${
                      prefs.email ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white dark:bg-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Browser push notifications</p>
                </div>
                <button
                  onClick={() => togglePref('push')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    prefs.push ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full shadow-sm transform transition-transform ${
                      prefs.push ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white dark:bg-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Mentions */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Mentions</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">When someone mentions you</p>
                </div>
                <button
                  onClick={() => togglePref('mentions')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    prefs.mentions ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full shadow-sm transform transition-transform ${
                      prefs.mentions ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white dark:bg-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Project Updates */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Project Updates</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Status changes and updates</p>
                </div>
                <button
                  onClick={() => togglePref('projectUpdates')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    prefs.projectUpdates ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full shadow-sm transform transition-transform ${
                      prefs.projectUpdates ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white dark:bg-slate-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Invite Workspace User
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rachel@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
