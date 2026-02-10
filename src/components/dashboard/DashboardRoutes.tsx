import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import DonationManagement from './DonationManagement';
import FormationManagement from './FormationManagement';
import Analytics from './Analytics';
import EventsManagement from './EventsManagement';
import AnnouncementsManagement from './AnnouncementsManagement';
import VolunteerManagement from './VolunteerManagement';
import BlogManagement from './BlogManagement';
import MediaManagement from './MediaManagement';
import NewsletterManagement from './NewsletterManagement';
import NotificationsManagement from './NotificationsManagement';
import OrganizationManagement from './OrganizationManagement';
import ReportsManagement from './ReportsManagement';
import SystemSettings from './SystemSettings';
import ForumManagement from './ForumManagement';
import SystemLogs from './SystemLogs';

const DashboardRoutes: React.FC = () => {
  
  return (
    <ProtectedRoute requiredRole="admin" requiredPermission="dashboard_view">
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/donations" element={<DonationManagement />} />
          <Route path="/formations" element={<FormationManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Modules de gestion */}
          <Route path="/events" element={<EventsManagement />} />
          <Route path="/announcements" element={<AnnouncementsManagement />} />
          <Route path="/volunteer" element={<VolunteerManagement />} />
          <Route path="/blog" element={<BlogManagement />} />
          <Route path="/media" element={<MediaManagement />} />
          <Route path="/newsletter" element={<NewsletterManagement />} />
          <Route path="/notifications" element={<NotificationsManagement />} />
          <Route path="/organization" element={<OrganizationManagement />} />
          <Route path="/reports" element={<ReportsManagement />} />
          <Route path="/forum" element={<ForumManagement />} />
          
          {/* Système */}
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/logs" element={<SystemLogs />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardRoutes;
