import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JiraDashboard from './pages/JiraDashboard';
import KanbanBoardPage from './pages/KanbanBoardPage';
import IssuesPage from './pages/IssuesPage';
import PeoplePage from './pages/PeoplePage';
import NotificationsPage from './pages/NotificationsPage';
import ReleasesPage from './pages/ReleasesPage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import MemberProfilePage from './pages/MemberProfilePage';
import CreateIssueModal from './components/CreateIssueModal';
import CreateProjectModal from './components/CreateProjectModal';
import CreateTeamModal from './components/CreateTeamModal';

export default function App() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const authState = useSelector((state) => state.auth);
  const token = authState?.token || localStorage.getItem('token') || localStorage.getItem('devflow_token');
  const isAuthenticated = !!token;

  // Check if we are inside the app workspace
  const isAppRoute = location.pathname.startsWith('/app');

  // Protect app routes: if unauthenticated, redirect to login
  if (isAppRoute && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If already authenticated and visiting /login or /register, redirect to /app/dashboard
  if ((location.pathname === '/login' || location.pathname === '/register') && isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080C15] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white">
      {isAppRoute ? (
        <div className="h-screen flex flex-col overflow-hidden">
          <TopHeader
            onQuickCreate={() => setIsCreateModalOpen(true)}
            onOpenCreateIssue={() => setIsCreateModalOpen(true)}
            onOpenCreateProject={() => setIsProjectModalOpen(true)}
            onOpenCreateTeam={() => setIsTeamModalOpen(true)}
            onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          />
          <div className="flex-1 flex overflow-hidden relative">
            <Sidebar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
            <main className="flex-1 h-full overflow-y-auto bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 w-full transition-colors duration-200">
              <Routes>
                <Route path="/app/dashboard" element={<JiraDashboard />} />
                <Route path="/app/kanban" element={<KanbanBoardPage />} />
                <Route path="/app/issues" element={<IssuesPage />} />
                <Route path="/app/people" element={<PeoplePage />} />
                <Route path="/app/people/:userId" element={<MemberProfilePage />} />
                <Route path="/app/profile" element={<ProfilePage />} />
                <Route path="/app/profile/:userId" element={<MemberProfilePage />} />
                <Route path="/app/notifications" element={<NotificationsPage />} />
                <Route path="/app/releases" element={<ReleasesPage />} />
                <Route path="/app/settings" element={<SettingsPage />} />
                <Route path="/app/projects" element={<ProjectsPage />} />
                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
              </Routes>
            </main>
          </div>

          <CreateIssueModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={(issue) => {
              console.log('Created issue:', issue);
            }}
          />

          <CreateProjectModal
            isOpen={isProjectModalOpen}
            onClose={() => setIsProjectModalOpen(false)}
            onCreated={(project) => {
              console.log('Created project:', project);
            }}
          />

          <CreateTeamModal
            isOpen={isTeamModalOpen}
            onClose={() => setIsTeamModalOpen(false)}
            onCreated={(team) => {
              console.log('Created team:', team);
            }}
          />
        </div>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 DevFlow Inc. Multi-User Developer Project &amp; Issue Management Platform.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
