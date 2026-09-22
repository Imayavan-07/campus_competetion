import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { NavSection } from '../components/Sidebar';
import Header from '../components/Header';
import { 
  HomeIcon, 
  TrophyIcon 
} from '../components/common/Icons';

import { useAuth } from '../context/AuthContext';

export default function StudentLayout(): React.JSX.Element {
  const { user } = useAuth();
  const studentSections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { label: 'Dashboard', path: '/student', exact: true, icon: HomeIcon },
      ]
    },
    {
      title: "Campus Engagement",
      items: [
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
        <Header roleLabel="Student" userName={user?.name || "Alex Vance"} />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
