import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import {
  Camera,
  Edit3,
  Check,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  ExternalLink,
  X,
  FileText,
  Calendar
} from 'lucide-react';
import { useGetIssuesQuery, useUpdateUserProfileMutation } from '../api/devflowApi';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'achievements' | 'goals'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const user = useSelector((state) => state.auth?.user) || (localStorage.getItem('devflow_user') ? JSON.parse(localStorage.getItem('devflow_user')) : null);
  const userId = user?.id || user?._id;

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { data: allIssues = [] } = useGetIssuesQuery(undefined, { pollingInterval: 4000 });
  const [updateUserProfileApi] = useUpdateUserProfileMutation();

  // Profile State initialized from user
  const [profile, setProfile] = useState({
    name: user?.name || 'Lucy Pearl',
    role: user?.role || 'Product Manager',
    bio: user?.bio || 'Owns the product roadmap and ensures alignment between stakeholders and delivery teams.',
    email: user?.email || 'lucy.pearl@company.com',
    phone: user?.phone || '200-059-0218x18975',
    location: user?.location || 'Toronto',
    timezone: user?.timezone || '09:00 - 17:00 UTC',
    team: user?.department || 'product team',
    status: 'Online',
    avatar: user?.avatar || null,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        role: user.role || prev.role,
        bio: user.bio || prev.bio,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        location: user.location || prev.location,
        timezone: user.timezone || prev.timezone,
        team: user.department || prev.team,
        avatar: user.avatar !== undefined ? user.avatar : prev.avatar,
      }));
      setEditForm({
        name: user.name || 'Lucy Pearl',
        role: user.role || 'Product Manager',
        bio: user.bio || 'Owns the product roadmap and ensures alignment between stakeholders and delivery teams.',
        email: user.email || 'lucy.pearl@company.com',
        phone: user.phone || '200-059-0218x18975',
        location: user.location || 'Toronto',
        timezone: user.timezone || '09:00 - 17:00 UTC',
        team: user.department || 'product team',
      });
    }
  }, [user]);

  // Image upload with compression and database sync
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const rawData = uploadEvent.target?.result;
      if (!rawData) return;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64Data = canvas.toDataURL('image/jpeg', 0.85);

        // Update local state and auth
        setProfile((prev) => ({ ...prev, avatar: base64Data }));
        const updatedUser = { ...user, avatar: base64Data };
        localStorage.setItem('devflow_user', JSON.stringify(updatedUser));
        dispatch(setCredentials({ token: localStorage.getItem('devflow_token'), user: updatedUser }));

        // Persist to database
        const targetId = userId || user?.id || user?._id;
        if (targetId) {
          try {
            await updateUserProfileApi({
              id: targetId,
              avatar: base64Data,
            }).unwrap();
            setSaveStatus('Photo updated!');
            setTimeout(() => setSaveStatus(''), 2000);
          } catch (err) {
            console.error('Failed to sync avatar to database:', err);
            setSaveStatus('Saved locally');
            setTimeout(() => setSaveStatus(''), 2000);
          }
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Save profile edits
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfile((prev) => ({ ...prev, ...editForm }));
    setIsEditModalOpen(false);

    const updatedUser = {
      ...user,
      name: editForm.name,
      role: editForm.role,
      bio: editForm.bio,
      phone: editForm.phone,
      location: editForm.location,
      department: editForm.team,
    };
    localStorage.setItem('devflow_user', JSON.stringify(updatedUser));
    dispatch(setCredentials({ token: localStorage.getItem('devflow_token'), user: updatedUser }));

    const targetId = userId || user?.id || user?._id;
    if (targetId) {
      try {
        await updateUserProfileApi({
          id: targetId,
          name: editForm.name,
          role: editForm.role,
          bio: editForm.bio,
          phone: editForm.phone,
          location: editForm.location,
          department: editForm.team,
        }).unwrap();
        setSaveStatus('Profile updated!');
        setTimeout(() => setSaveStatus(''), 2500);
      } catch (err) {
        console.error('Failed to save profile to database:', err);
        setSaveStatus('Saved locally');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    }
  };

  // Filter issues assigned to or related to user
  const userIssues = allIssues.filter((i) => {
    if (!i.assignee) return false;
    const a = i.assignee.trim().toLowerCase();
    const targetName = profile.name?.trim().toLowerCase();
    const targetEmail = profile.email?.trim().toLowerCase();
    return a === targetName || a === targetEmail || targetName?.includes(a) || a.includes(targetName);
  });

  const myIssues = userIssues.length > 0 ? userIssues : allIssues;
  const myTotal = myIssues.length > 0 ? myIssues.length : 5;
  const myDone = myIssues.filter((i) => i.status === 'Done').length || 2;
  const myInProgress = myIssues.filter((i) => i.status === 'In Progress').length || 1;
  const myStoryPoints = myIssues.reduce((acc, i) => acc + (parseInt(i.storyPoints) || 0), 0) || 38;
  const completionRate = myTotal > 0 ? Math.round((myDone / myTotal) * 100) : 40;

  // Activities
  const recentActivities = [
    {
      id: 1,
      type: 'Completed',
      issueKey: 'Fix login redirect flow',
      color: 'text-blue-600',
    },
    {
      id: 2,
      type: 'Updated',
      issueKey: 'Sprint 24 velocity planning and estimation',
      color: 'text-indigo-600',
    },
    {
      id: 3,
      type: 'Commented on',
      issueKey: 'Design review for notification center',
      color: 'text-emerald-600',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Sprint Champion',
      desc: 'Completed all sprint tasks 2 sprints in a row',
      date: 'May 2026',
      icon: Award,
    },
    {
      id: 2,
      title: 'Top Contributor',
      desc: 'Delivered 38 story points in Q2 roadmap',
      date: 'April 2026',
      icon: TrendingUp,
    },
  ];

  const goals = [
    {
      id: 1,
      title: 'Zero High-Severity Bugs in Sprint 24',
      progress: 80,
      targetDate: 'Oct 15, 2026',
    },
    {
      id: 2,
      title: 'Deliver Unified Settings & Profile Revamp',
      progress: 95,
      targetDate: 'Oct 20, 2026',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Save Status */}
      {saveStatus && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold animate-bounce">
          <Check className="h-4 w-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Top Banner & Header Section */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0D131F] shadow-sm border border-slate-200/80 dark:border-[#1E293B]">
        {/* Banner with gradient */}
        <div className="h-36 sm:h-40 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              onClick={() => {
                setEditForm({ ...profile });
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-[#111724]/90 hover:bg-white dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer border border-transparent dark:border-white/10"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Info Row overlapping banner */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
            {/* Avatar with Camera Button */}
            <div className="relative group -mt-16 sm:-mt-16 shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white dark:ring-[#0D131F] shadow-xl bg-white dark:bg-[#0D131F]"
                />
              ) : (
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-white dark:ring-[#0D131F] shadow-xl select-none">
                  {(profile.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Picture"
                className="absolute bottom-1 right-1 p-2 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-lg border-2 border-white dark:border-[#0D131F] transition-all transform hover:scale-110 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Name & Role - fully inside background */}
            <div className="text-center sm:text-left pt-2 sm:pt-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                {profile.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Left (About + Tabs), Right (My Stats + Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column (Span 2): About Card & Tabs / Activity */}
        <div className="lg:col-span-2 space-y-3.5">
          {/* About Card */}
          <div className="bg-white dark:bg-[#0D131F] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] p-5 sm:p-6 shadow-sm space-y-3.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">About</h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {profile.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{profile.timezone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                {profile.team}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {profile.status}
              </span>
            </div>
          </div>

          {/* Tabs Track */}
          <div className="flex items-center bg-white dark:bg-[#0D131F] rounded-xl border border-slate-200/80 dark:border-[#1E293B] p-1.5 shadow-sm w-full">
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'recent'
                  ? 'bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'achievements'
                  ? 'bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'goals'
                  ? 'bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Goals
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="bg-white dark:bg-[#0D131F] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] p-5 sm:p-6 shadow-sm">
            {activeTab === 'recent' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#111724] hover:bg-slate-100/80 dark:hover:bg-[#161F33] transition-colors border border-slate-100 dark:border-[#1E293B]"
                    >
                      <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">{act.type} </span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                          {act.issueKey}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((ach) => {
                    const Icon = ach.icon;
                    return (
                      <div
                        key={ach.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-3.5"
                      >
                        <div className="p-2.5 rounded-lg bg-amber-500 text-white shrink-0 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{ach.desc}</p>
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-2 block">
                            {ach.date}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sprint & Team Goals</h3>
                <div className="space-y-4">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-100 dark:border-[#1E293B] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{g.title}</h4>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{g.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                        Target completion: {g.targetDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Span 1): My Stats Card & Quick Actions */}
        <div className="space-y-3.5">
          {/* My Stats Card */}
          <div className="bg-white dark:bg-[#0D131F] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Stats</h2>

              {/* 2x2 pastel grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total Issues */}
                <div className="rounded-xl bg-[#F0F7FF] dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3.5 text-center">
                  <span className="text-2xl font-extrabold text-[#2563EB] dark:text-blue-400 block">
                    {myTotal}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 block">
                    Total Issues
                  </span>
                </div>

                {/* Completed */}
                <div className="rounded-xl bg-[#F0FDF4] dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3.5 text-center">
                  <span className="text-2xl font-extrabold text-[#16A34A] dark:text-emerald-400 block">
                    {myDone}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 block">
                    Completed
                  </span>
                </div>

                {/* In Progress */}
                <div className="rounded-xl bg-[#FFFBEB] dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 p-3.5 text-center">
                  <span className="text-2xl font-extrabold text-[#D97706] dark:text-amber-400 block">
                    {myInProgress}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 block">
                    In Progress
                  </span>
                </div>

                {/* Story Points */}
                <div className="rounded-xl bg-[#FAF5FF] dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 p-3.5 text-center">
                  <span className="text-2xl font-extrabold text-[#9333EA] dark:text-purple-400 block">
                    {myStoryPoints}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 block">
                    Story Points
                  </span>
                </div>
              </div>
            </div>

            {/* Completion Rate Progress */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-[#0D131F] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('recent')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-[#1E293B] hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    View My Assigned Issues
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>

              <button
                onClick={() => setActiveTab('achievements')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-[#1E293B] hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Performance Report
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </button>

              <button
                onClick={() => setActiveTab('goals')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-[#1E293B] hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    Sprint Goals & Milestones
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D131F] rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E293B] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Team / Department
                  </label>
                  <input
                    type="text"
                    value={editForm.team}
                    onChange={(e) => setEditForm({ ...editForm, team: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={editForm.timezone}
                    onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111724] border border-slate-300 dark:border-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161F33] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
