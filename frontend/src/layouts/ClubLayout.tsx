import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { NavSection } from '../components/Sidebar';
import Header from '../components/Header';
import { 
  HomeIcon, 
  PlusIcon,
  DirectoryIcon,
  UsersIcon,
  CalendarIcon, 
  ReviewsIcon,
  DocumentTextIcon
} from '../components/common/Icons';

import { useAuth } from '../context/AuthContext';

export default function ClubLayout(): React.JSX.Element {
  const { user } = useAuth();
  const clubSections: NavSection[] = [
    {
      title: "Navigation",
      items: [
        { label: 'Dashboard', path: '/club', exact: true, icon: HomeIcon },
        { label: 'Post New Event', path: '/club/post-event', icon: PlusIcon },
        { label: 'Manage Events', path: '/club/events', icon: DirectoryIcon },
        { label: 'Event Registrations', path: '/club/registrations', icon: UsersIcon },
        { label: 'Registration Forms', path: '/club/forms', icon: DocumentTextIcon },
        { label: 'Calendar', path: '/club/calendar', icon: CalendarIcon },
        { label: 'Post Event Reviews', path: '/club/reviews', icon: ReviewsIcon },
      ]
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar 
        brandName="UniSync" 
        subtitle="Club Lead" 
        sections={clubSections} 
      />
      <main className="main-content">
        <Header roleLabel="Club Executive" userName={user?.assigned_club || user?.name || "Robotics Society"} />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
