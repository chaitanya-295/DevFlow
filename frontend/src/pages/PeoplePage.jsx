import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  X, 
  UserPlus, 
  Loader2,
  Trash2
} from 'lucide-react';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '../api/devflowApi';
import CreateTeamModal from '../components/CreateTeamModal';

export default function PeoplePage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);
  const { data: usersData = [], isLoading, error } = useGetUsersQuery(undefined, { pollingInterval: 4000 });
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Developer');
  const [inviteLocation, setInviteLocation] = useState('Remote');

  // Map usersData into UI display items
  const people = usersData.map((u) => {
    const isCurrentUser = (currentUser && (u.id === currentUser.id || u._id === currentUser.id || u.email === currentUser.email));
    return {
      id: u.id || u._id,
      name: (isCurrentUser && currentUser.name) ? currentUser.name : (u.name || 'Team Member'),
      role: (isCurrentUser && currentUser.role) ? currentUser.role : (u.role || 'Developer'),
      email: u.email || '',
      location: (isCurrentUser && currentUser.location) ? currentUser.location : (u.location || 'Remote'),
      timezone: '09:00 - 18:00 UTC',
      tag: (u.role && u.role.toLowerCase().includes('design')) ? 'design' : (u.role && u.role.toLowerCase().includes('pm') ? 'product' : 'dev'),
      tagBg: (u.role && u.role.toLowerCase().includes('design')) ? 'bg-purple-900/40 text-purple-300 border-purple-700/40' : 'bg-blue-900/40 text-blue-300 border-blue-700/40',
      status: 'Active',
      bio: (isCurrentUser && currentUser.bio) ? currentUser.bio : (u.bio || 'Contributing to active sprints and team roadmap.'),
      avatar: (isCurrentUser && currentUser.avatar) ? currentUser.avatar : (u.avatar || null),
      team: (u.role && u.role.toLowerCase().includes('design')) ? 'Design' : 'Engineering'
    };
  });

  const filteredPeople = people.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter === 'All Teams' || p.team === teamFilter;
    const matchesRole = roleFilter === 'All Roles' || p.role.includes(roleFilter);
    return matchesSearch && matchesTeam && matchesRole;
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    try {
      await createUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        location: inviteLocation || 'Remote',
        department: inviteRole.toLowerCase().includes('design') ? 'Design' : 'Engineering',
        bio: `${inviteRole} working with the engineering team.`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inviteName)}`
      }).unwrap();
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
    } catch (err) {
      console.error('Failed to invite user:', err);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            People
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Connect with your team members
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#141B2D] hover:bg-[#1E2638] text-slate-200 border border-[#222D42] font-semibold text-xs transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            New Team
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-md transition-all"
          >
            Invite People
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 sm:flex-none">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg bg-[#111724] border border-[#1E293B] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* All Teams Dropdown */}
        <div className="relative">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-[#111724] border border-[#1E293B] text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All Teams">All Teams</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* All Roles Dropdown */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-lg bg-[#111724] border border-[#1E293B] text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All Roles">All Roles</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Designer">UI/UX Designer</option>
            <option value="Engineer">QA Engineer</option>
            <option value="Developer">Backend Developer</option>
            <option value="Strategist">Marketing Strategist</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* People Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            onClick={() => navigate(`/app/profile/${person.id}`)}
            className="rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/50 hover:shadow-blue-500/5 p-6 shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Profile Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {person.avatar ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 shrink-0 transition-all"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-blue-500 shrink-0 select-none transition-all">
                      {(person.name || person.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium truncate">{person.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm(`Remove member "${person.name}"?`)) {
                      try {
                        await deleteUser(person.id).unwrap();
                      } catch (err) {
                        console.error('Failed to remove user:', err);
                      }
                    }
                  }}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Remove Member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Meta details list */}
              <div className="space-y-2 text-xs text-slate-400 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{person.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{person.timezone}</span>
                </div>
              </div>

              {/* Tag & Status row */}
              <div className="flex items-center justify-between py-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${person.tagBg}`}>
                  {person.tag}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] text-slate-400 font-medium">{person.status}</span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {person.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Invite People Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-400" />
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.jenkins@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    placeholder="e.g. Remote"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onCreated={(team) => {
          console.log('Team created successfully:', team);
        }}
      />
    </div>
  );
}
