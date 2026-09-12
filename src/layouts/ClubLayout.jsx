import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  HomeIcon, 
  CalendarIcon, 
  NoticeIcon 
} from '../components/common/Icons';

export default function ClubLayout() {
  const clubSections = [
    {
      title: "Overview",
      items: [
        { label: 'Dashboard', path: '/club', exact: true, icon: HomeIcon },
      ]
    },
    {
      title: "Club Operations",
      items: [
        { label: 'Manage Events', path: '/club/events', icon: CalendarIcon },
        { label: 'Post Notice', path: '/club/post-notice', icon: NoticeIcon }
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
        <Header roleLabel="Club Executive" userName="Robotics Society" />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
