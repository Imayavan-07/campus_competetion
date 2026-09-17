import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';

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
import Members from './pages/admin/Members';
import Clubs from './pages/admin/Clubs';
import AddClub from './pages/admin/AddClub';
import ClubDetails from './pages/admin/ClubDetails';
import GlobalCalendar from './pages/admin/GlobalCalendar';
import EventApprovals from './pages/admin/EventApprovals';
import EventDirectory from './pages/admin/EventDirectory';
import EventDetails from './pages/admin/EventDetails';
import EventReviews from './pages/admin/EventReviews';

import Login from './pages/Login';

export default function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

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
          <Route path="members" element={<Members />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/new" element={<AddClub />} />
          <Route path="clubs/:id" element={<ClubDetails />} />
          <Route path="calendar" element={<GlobalCalendar />} />
          <Route path="approvals" element={<EventApprovals />} />
          <Route path="approvals/:id" element={<EventDetails />} />
          <Route path="events" element={<EventDirectory />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="reviews" element={<EventReviews />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
