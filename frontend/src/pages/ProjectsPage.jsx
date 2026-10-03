import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Calendar, 
  CheckSquare, 
  X,
  Users,
  FolderPlus,
  Trash2
} from 'lucide-react';

import { useGetProjectsQuery, useDeleteProjectMutation } from '../api/devflowApi';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined, { pollingInterval: 4000 });
  const [deleteProjectApi] = useDeleteProjectMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadgeClasses = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('active')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60';
    }
    if (s.includes('plan')) {
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60';
    }
    if (s.includes('arch') || s.includes('close')) {
      return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60';
  };

  const getTagBadgeClasses = (tag) => {
    const t = (tag || '').toLowerCase();
    if (t.includes('dev')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-[#111726] dark:text-indigo-400 dark:border-indigo-900/50';
    }
    if (t.includes('market')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#111726] dark:text-amber-400 dark:border-amber-900/50';
    }
    if (t.includes('prod')) {
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-[#111726] dark:text-purple-400 dark:border-purple-900/50';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#111726] dark:text-slate-300 dark:border-slate-800';
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.key || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || (p.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-800 dark:text-slate-100">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage and track all your projects
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto hover:shadow-blue-500/25"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* All Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Archived">Archived</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* View Toggle: Grid / List */}
        <div className="flex items-center bg-slate-100 dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] rounded-lg p-0.5 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] flex flex-col items-center justify-center text-center px-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <FolderPlus className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
            {searchQuery || statusFilter !== 'All Status' 
              ? 'No projects match your current search or status filter.' 
              : 'Your organization does not have any active projects yet. Create your first project to get started.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className={`rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 border-l-4 ${proj.leftStripe || 'border-l-blue-500'}`}
            >
              <div>
                {/* Top Row: Icon + Title & Status Badge & Actions */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{proj.icon || '📁'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                          {proj.title}
                        </h3>
                        {proj.key && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400">
                            {proj.key}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete project "${proj.title}"?`)) {
                        try {
                          await deleteProjectApi(proj.id).unwrap();
                        } catch (err) {
                          console.error('Failed to delete project:', err);
                        }
                      }
                    }}
                    title="Delete project"
                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Pill */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusBadgeClasses(proj.status)}`}>
                    {proj.status || 'Active'}
                  </span>
                  {proj.template && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {proj.template}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              {/* Middle: Lead & Tag Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {(proj.leadAvatar || proj.avatar) ? (
                    <img
                      src={proj.leadAvatar || proj.avatar}
                      alt={proj.lead}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {(proj.lead || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-slate-800 dark:text-slate-300 font-semibold text-xs">
                    {proj.lead || 'Project Lead'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {proj.team && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent">
                      {proj.team}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getTagBadgeClasses(proj.tag)}`}>
                    {proj.tag || 'dev'}
                  </span>
                </div>
              </div>

              {/* Bottom: Date, Issues Count & Mini Progress Bar */}
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{proj.startDate ? `${proj.startDate}${proj.targetEndDate ? ' → ' + proj.targetEndDate : ''}` : (proj.date || 'Active')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
                    <span>{proj.issuesText || `${proj.completedIssues || 0}/${proj.totalIssues || 0} issues`}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                    style={{ width: `${proj.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
