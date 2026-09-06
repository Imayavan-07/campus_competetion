import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
  const links = [
    { label: 'Dashboard', path: '/admin', exact: true },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Approve Events', path: '/admin/approvals' }
  ];

  return (
    <div className="app-layout">
      <Sidebar brandName="UniSync" links={links} />
      <main className="main-content">
        <Header roleLabel="Administrator" />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
