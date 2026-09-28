import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SessionExpiredModal from './components/common/SessionExpiredModal';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import ClubLayout from './layouts/ClubLayout';
import AdminLayout from './layouts/AdminLayout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCompetitions from './pages/student/Competitions';

// Club Pages
import ClubDashboard from './pages/club/Dashboard';
import PostNewEvent from './pages/club/PostNewEvent';
import ManageEvents from './pages/club/ManageEvents';
import ClubRegistrations from './pages/club/ClubRegistrations';
import ClubEventDetails from './pages/club/ClubEventDetails';
import ClubCalendar from './pages/club/ClubCalendar';
import ClubEventReviews from './pages/club/ClubEventReviews';
import ClubRegistrationForms from './pages/club/ClubRegistrationForms';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Members from './pages/admin/Members';
import Clubs from './pages/admin/Clubs';
import AddClub from './pages/admin/AddClub';
import ClubDetails from './pages/admin/ClubDetails';
import GlobalCalendar from './pages/admin/GlobalCalendar';
import EventApprovals from './pages/admin/EventApprovals';
import EventDetails from './pages/admin/EventDetails';
import EventDirectory from './pages/admin/EventDirectory';
import EventReviews from './pages/admin/EventReviews';

import Login from './pages/Login';
import UserProfile from './pages/common/Profile';

function AppRoutes(): React.JSX.Element {
  const { sessionExpiredOpen, handleConfirmSessionExpired } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Student Routes - Only authenticated students can enter */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="competitions" element={<StudentCompetitions />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Protected Club Routes - Only authenticated club leads can enter */}
        <Route
          path="/club"
          element={
            <ProtectedRoute allowedRoles={['club']}>
              <ClubLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClubDashboard />} />
          <Route path="post-event" element={<PostNewEvent />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="registrations" element={<ClubRegistrations />} />
          <Route path="forms" element={<ClubRegistrationForms />} />
          <Route path="events/:id" element={<ClubEventDetails />} />
          <Route path="calendar" element={<ClubCalendar />} />
          <Route path="reviews" element={<ClubEventReviews />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Protected Admin Routes - Only authenticated administrators can enter */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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
          <Route path="profile" element={<UserProfile />} />
        </Route>


        {/* Catch-all unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Automatic 50-minute session expiry dialog */}
      <SessionExpiredModal
        isOpen={sessionExpiredOpen}
        onConfirm={handleConfirmSessionExpired}
      />
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary fallbackTitle="Application Portal Error">
          <AppRoutes />
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  );
}
