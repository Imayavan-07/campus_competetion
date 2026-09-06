import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function StudentLayout() {
  const links = [
    { label: 'Dashboard', path: '/student', exact: true },
    { label: 'Notice Board', path: '/student/notices' },
    { label: 'Competitions', path: '/student/competitions' }
  ];

  return (
    <div className="app-layout">
      <Sidebar brandName="UniSync" links={links} />
      <main className="main-content">
        <Header roleLabel="Student" />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
