import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import ClubLayout from './layouts/ClubLayout';
import AdminLayout from './layouts/AdminLayout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCompetitions from './pages/student/Competitions';
import NoticeBoard from './pages/student/NoticeBoard';

// Club Pages
import ClubDashboard from './pages/club/Dashboard';
import ManageEvents from './pages/club/ManageEvents';
import PostNotice from './pages/club/PostNotice';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveEvents from './pages/admin/ApproveEvents';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student" replace />} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="competitions" element={<StudentCompetitions />} />
        <Route path="notices" element={<NoticeBoard />} />
      </Route>

      {/* Club Routes */}
      <Route path="/club" element={<ClubLayout />}>
        <Route index element={<ClubDashboard />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="post-notice" element={<PostNotice />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="approvals" element={<ApproveEvents />} />
      </Route>
    </Routes>
  );
}
