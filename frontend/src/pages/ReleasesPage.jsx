import React, { useState } from 'react';
import { 
  Rocket, 
  Plus, 
  Search, 
  Calendar, 
  Wrench, 
  Bug, 
  Sparkles, 
  Download, 
  ExternalLink, 
  ChevronDown,
  Filter,
  X,
  Loader2,
  Trash2,
  Check
} from 'lucide-react';
import { useGetReleasesQuery, useCreateReleaseMutation, useDeleteReleaseMutation } from '../api/devflowApi';

export default function ReleasesPage() {
  const { data: releasesData = [], isLoading, error } = useGetReleasesQuery(undefined, { pollingInterval: 5000 });
  const [createRelease, { isLoading: isCreating }] = useCreateReleaseMutation();
  const [deleteRelease] = useDeleteReleaseMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = [
    { label: 'All Status', value: 'All Status' },
    { label: 'Released', value: 'released' },
    { label: 'Draft', value: 'draft' },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New release form
  const [newVersion, setNewVersion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFixes, setNewFixes] = useState('5');
  const [newBugs, setNewBugs] = useState('2');
  const [newFeatures, setNewFeatures] = useState('3');

  const releases = releasesData.map((r) => ({
    id: r.id || r._id,
    version: r.version || 'v1.0.0',
    releaseDate: r.releaseDate || 'Recent',
    status: (r.status || 'released').toLowerCase(),
    fixes: r.fixes != null ? r.fixes : 0,
    bugs: r.bugs != null ? r.bugs : 0,
    features: r.features != null ? r.features : 0,
    downloads: r.downloads || '1,000+',
    description: r.description || '',
    hasExternalLink: true,
  }));

  const filteredReleases = releases.filter((r) => {
    const matchesSearch = r.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || r.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCreateRelease = async (e) => {
    e.preventDefault();
    if (!newVersion.trim()) return;

    try {
      await createRelease({
        version: newVersion,
        releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'released',
        fixes: Number(newFixes) || 0,
        bugs: Number(newBugs) || 0,
        features: Number(newFeatures) || 0,
        downloads: 1200,
        description: newDescription || 'Production sprint release.',
      }).unwrap();

      setNewVersion('');
      setNewDescription('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create release:', err);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-[1500px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Releases
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Track all product releases and their details
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Rocket className="h-4 w-4" />
          New Release
        </button>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B] p-4 sm:p-6 shadow-sm space-y-5">
        {/* Release History Subheader + Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white shrink-0">
            <Rocket className="h-4 w-4 text-blue-600 dark:text-slate-300" />
            <span>Release History</span>
          </div>

          <div className="flex flex-col min-[440px]:flex-row items-stretch min-[440px]:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-56 min-w-0">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Custom Filter Popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between min-[440px]:justify-start gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] text-xs text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all"
              >
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>{filterOptions.find(o => o.value === statusFilter)?.label || statusFilter}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#111724] border border-slate-200 dark:border-[#1E293B] shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                          statusFilter === opt.value
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {statusFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Releases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Release Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Fixes</th>
                <th className="py-3 px-3">Bugs</th>
                <th className="py-3 px-3">Features</th>
                <th className="py-3 px-3">Downloads</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReleases.map((release) => (
                <tr key={release.id} className="hover:bg-slate-50/70 dark:hover:bg-[#131B2D]/60 transition-colors">
                  {/* Version Pill */}
                  <td className="py-4 px-3">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 dark:bg-[#131E33] dark:text-slate-200 dark:border-slate-700/80">
                      {release.version}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{release.releaseDate}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#064E3B]/40 dark:text-emerald-400 dark:border-emerald-600/30">
                      {release.status}
                    </span>
                  </td>

                  {/* Fixes */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Wrench className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{release.fixes}</span>
                    </div>
                  </td>

                  {/* Bugs */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                      <Bug className="h-3.5 w-3.5 text-rose-500" />
                      <span>{release.bugs}</span>
                    </div>
                  </td>

                  {/* Features */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                      <Rocket className="h-3.5 w-3.5 text-blue-500" />
                      <span>{release.features}</span>
                    </div>
                  </td>

                  {/* Downloads */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-300 font-medium">
                      <Download className="h-3.5 w-3.5 text-purple-500" />
                      <span>{release.downloads}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {release.description}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      {release.hasExternalLink && (
                        <button className="p-1 hover:text-blue-600 dark:hover:text-white transition-colors" title="View Release Notes">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button className="p-1 hover:text-blue-600 dark:hover:text-white transition-colors" title="Download Asset">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete release "${release.version}"?`)) {
                            try {
                              await deleteRelease(release.id).unwrap();
                            } catch (err) {
                              console.error('Failed to delete release:', err);
                            }
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Release"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Row */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            &lt; Previous
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`h-7 w-7 rounded-lg font-medium transition-colors ${
              currentPage === 1 
                ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-white font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`h-7 w-7 rounded-lg font-medium transition-colors ${
              currentPage === 2 
                ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-white font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`h-7 w-7 rounded-lg font-medium transition-colors ${
              currentPage === 3 
                ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-white font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
            className="px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* New Release Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket className="h-4 w-4 text-blue-400" />
                Publish New Release
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Version Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v2.4.2"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Release Highlights</label>
                <textarea
                  rows="3"
                  placeholder="Summary of fixes, improvements, and features..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fixes</label>
                  <input
                    type="number"
                    value={newFixes}
                    onChange={(e) => setNewFixes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bugs</label>
                  <input
                    type="number"
                    value={newBugs}
                    onChange={(e) => setNewBugs(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Features</label>
                  <input
                    type="number"
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
