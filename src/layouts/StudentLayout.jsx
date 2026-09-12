import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  HomeIcon, 
  NoticeIcon, 
  TrophyIcon 
} from '../components/common/Icons';

export default function StudentLayout() {
  const studentSections = [
    {
      title: "Overview",
      items: [
        { label: 'Dashboard', path: '/student', exact: true, icon: HomeIcon },
      ]
    },
    {
      title: "Campus Engagement",
      items: [
        { label: 'Notice Board', path: '/student/notices', icon: NoticeIcon },
        { label: 'Competitions', path: '/student/competitions', icon: TrophyIcon }
      ]
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar 
        brandName="UniSync" 
        subtitle="Student Hub" 
        sections={studentSections} 
      />
      <main className="main-content">
        <Header roleLabel="Student" userName="Alex Vance" />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
