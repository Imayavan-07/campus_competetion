import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ClubLayout() {
  const links = [
    { label: 'Dashboard', path: '/club', exact: true },
    { label: 'Manage Events', path: '/club/events' },
    { label: 'Post Notice', path: '/club/post-notice' }
  ];

  return (
    <div className="app-layout">
      <Sidebar brandName="UniSync" links={links} />
      <main className="main-content">
        <Header roleLabel="Club / Organization" />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
