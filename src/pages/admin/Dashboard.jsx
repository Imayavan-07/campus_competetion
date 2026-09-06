import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p className="text-muted mb-8">Platform overview and administrative controls.</p>
      
      <div className="grid grid-cols-3 mb-8">
        <div className="card">
          <h3>Pending Approvals</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--tertiary-color)' }}>7</p>
        </div>
        <div className="card">
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--primary-color)' }}>3,402</p>
        </div>
        <div className="card">
          <h3>Total Clubs</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--secondary-color)' }}>45</p>
        </div>
      </div>
    </div>
  );
}
