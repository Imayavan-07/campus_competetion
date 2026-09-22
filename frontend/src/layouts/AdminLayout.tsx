import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { NavSection } from '../components/Sidebar';
import Header from '../components/Header';
import { 
  HomeIcon, 
  UsersIcon, 
  ClubsIcon, 
  CalendarIcon, 
  ApprovalsIcon, 
  DirectoryIcon, 
  ReviewsIcon 
} from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout(): React.JSX.Element {
  const { user } = useAuth();
  const adminSections: NavSection[] = [
    {
      title: "Core Management",
      items: [
        { label: 'Dashboard', path: '/admin', exact: true, icon: HomeIcon },
        { label: 'Members', path: '/admin/members', icon: UsersIcon },
        { label: 'Clubs', path: '/admin/clubs', icon: ClubsIcon },
      ]
    },
    {
      title: "Schedules & Approvals",
      items: [
        { label: 'Calendar', path: '/admin/calendar', icon: CalendarIcon },
        { label: 'Event Approvals', path: '/admin/approvals', icon: ApprovalsIcon },
      ]
    },
    {
      title: "Directory & Feedback",
      items: [
        { label: 'Event Directory', path: '/admin/events', icon: DirectoryIcon },
        { label: 'Event Reviews', path: '/admin/reviews', icon: ReviewsIcon },
      ]
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar 
        brandName="UniSync" 
        subtitle="Administrator" 
        sections={adminSections} 
      />
      <main className="main-content">
        <Header roleLabel="Administrator" userName={user?.name || "Chief Admin"} />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

