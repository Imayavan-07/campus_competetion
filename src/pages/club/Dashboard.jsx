import React from 'react';

export default function ClubDashboard() {
  return (
    <div>
      <h1>Club Dashboard</h1>
      <p className="text-muted mb-8">Manage your club activities and view analytics.</p>
      
      <div className="grid grid-cols-3 mb-8">
        <div className="card">
          <h3>Total Events</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--primary-color)' }}>4</p>
        </div>
        <div className="card">
          <h3>Total Participants</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--secondary-color)' }}>128</p>
        </div>
        <div className="card">
          <h3>Active Notices</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 0', color: 'var(--tertiary-color)' }}>1</p>
        </div>
      </div>
    </div>
  );
}
