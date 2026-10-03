import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  AlertCircle,
  Briefcase,
  Users
} from 'lucide-react';
import { useGetIssuesQuery, useGetUsersQuery } from '../api/devflowApi';

export default function MemberProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch all users to display member profile info
  const { data: allUsers = [] } = useGetUsersQuery(undefined, { pollingInterval: 4000 });
  const { data: allIssues = [] } = useGetIssuesQuery(undefined, { pollingInterval: 4000 });

  const currentUser = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);

  // Match member by id, _id, email, or check if viewing current user
  const member = allUsers.find((u) => 
    String(u.id) === String(userId) || 
    String(u._id) === String(userId) || 
    (u.email && u.email.toLowerCase() === String(userId).toLowerCase())
  ) || ((currentUser && (String(currentUser.id) === String(userId) || String(currentUser._id) === String(userId))) ? currentUser : null);

  // Active Tab: 'issues' | 'activity' | 'teams'
  const [activeTab, setActiveTab] = useState('issues');

  const [profile, setProfile] = useState(() => {
    const isCurrent = (currentUser && member && (member.id === currentUser.id || member.email === currentUser.email));
    const activeData = isCurrent ? { ...member, ...currentUser } : member;
    return {
      name: activeData?.name || 'Team Member',
      role: activeData?.role || 'Contributor',
      bio: activeData?.bio || 'Contributing to agile sprints and team delivery roadmap.',
      email: activeData?.email || '',
      phone: activeData?.phone || '',
      location: activeData?.location || '',
      timezone: activeData?.timezone || '07:00 - 15:00 UTC',
      team: activeData?.department || (activeData?.role?.toLowerCase().includes('design') ? 'design' : activeData?.role?.toLowerCase().includes('market') ? 'product' : 'engineering'),
      status: 'Online',
      avatar: activeData?.avatar || null,
    };
  });

  useEffect(() => {
    if (member || currentUser) {
      const isCurrent = (currentUser && member && (member.id === currentUser.id || member.email === currentUser.email));
      const activeData = isCurrent ? { ...member, ...currentUser } : (member || currentUser);
      if (activeData) {
        setProfile({
          name: activeData.name || 'Team Member',
          role: activeData.role || 'Contributor',
          bio: activeData.bio || 'Contributing to agile sprints and team delivery roadmap.',
          email: activeData.email || '',
          phone: activeData.phone || '',
          location: activeData.location || '',
          timezone: activeData.timezone || '07:00 - 15:00 UTC',
          team: activeData.department || (activeData.role?.toLowerCase().includes('design') ? 'design' : activeData.role?.toLowerCase().includes('market') ? 'product' : 'engineering'),
          status: 'Online',
          avatar: activeData.avatar || null,
        });
      }
    }
  }, [member, currentUser, userId]);

  // Filter issues assigned to this member
  const targetName = profile.name?.trim().toLowerCase();
  const targetEmail = profile.email?.trim().toLowerCase();

  const assignedIssues = allIssues.filter((i) => {
    if (!i.assignee) return false;
    const a = i.assignee.trim().toLowerCase();
    return a === targetName || a === targetEmail || targetName?.includes(a) || a.includes(targetName);
  });

  const displayedIssues = assignedIssues.length > 0
    ? assignedIssues
    : [
      {
        id: 'demo-1',
        key: 'DEV-104',
        title: 'Resolve issue with timezone conversion',
        description: 'Some users report incorrect due dates due to timezone misalignment. Validate server/client conversion.',
        status: 'To Do',
        priority: 'Critical',
        storyPoints: '6 pts',
        project: 'Marketing Site Redesign'
      }
    ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1400px] mx-auto text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/people')}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] transition-all w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to People</span>
      </button>

      {/* Member Profile Card Header (Dedicated teammate profile style) */}
      <div className="rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-[#1E293B] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-slate-100 dark:ring-[#1E293B] shadow-md"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-slate-100 dark:ring-[#1E293B] shadow-md select-none">
                  {(profile.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {profile.role}
                </p>
              </div>

              {/* Contact Meta Details: Email, Phone, Location, Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{profile.timezone}</span>
                </div>
              </div>

              {/* Tag & Status */}
              <div className="flex items-center gap-3 pt-1">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
                  {profile.team || 'product'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  {profile.status}
                </span>
              </div>

              {/* Bio summary */}
              <div className="pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Message & Schedule Meeting */}
          <div className="flex items-center gap-3 shrink-0 self-start">
            <button
              type="button"
              onClick={() => alert(`Starting message chat with ${profile.name}`)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141B2D] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#222D42] shadow-sm transition-all"
            >
              Message
            </button>
            <button
              type="button"
              onClick={() => alert(`Scheduling a meeting with ${profile.name}`)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-sm transition-all"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Row: Assigned Issues | Activity | Teams */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'issues'
              ? 'bg-slate-100 text-slate-900 dark:bg-[#1E293B] dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            Assigned Issues ({displayedIssues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'activity'
              ? 'bg-slate-100 text-slate-900 dark:bg-[#1E293B] dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'teams'
              ? 'bg-slate-100 text-slate-900 dark:bg-[#1E293B] dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            Teams
          </button>
        </div>

        {/* Tab 1: Assigned Issues Content */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Assigned Issues
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {displayedIssues.length} issues
              </span>
            </div>

            <div className="space-y-3">
              {displayedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-[#1E293B] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-4xl">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {issue.description}
                    </p>

                    {/* Issue Metadata badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {issue.status || 'To Do'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${issue.priority === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40'
                        }`}>
                        {issue.priority || 'Medium'}
                      </span>
                      {issue.storyPoints && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {issue.storyPoints}
                        </span>
                      )}
                      {issue.project && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 pl-1 font-medium">
                          {issue.project}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/app/issues')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#141B2D] dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#222D42] self-start sm:self-auto shrink-0 shadow-sm transition-all"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Activity */}
        {activeTab === 'activity' && (
          <div className="rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-[#1E293B] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { title: `Updated issue status on ${profile.team} deliverable`, time: '2 hours ago' },
                { title: 'Completed sprint deliverable documentation', time: '1 day ago' },
                { title: 'Participated in backlog refinement session', time: '2 days ago' },
              ].map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#1E293B] flex items-start gap-3"
                >
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{act.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Teams */}
        {activeTab === 'teams' && (
          <div className="rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-[#1E293B] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Associated Teams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#1E293B] flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{profile.team ? `${profile.team.charAt(0).toUpperCase() + profile.team.slice(1)} Team` : 'Core Team'}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">8 Members • Active Projects</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#1E293B] flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sprint 24 Pod</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">5 Members • High Velocity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
