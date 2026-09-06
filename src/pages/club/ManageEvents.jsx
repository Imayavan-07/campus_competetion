import React from 'react';

export default function ManageEvents() {
  const events = [
    { id: 1, title: 'Annual Hackathon 2026', date: 'Sept 15, 2026', participants: 120, status: 'Active' },
    { id: 2, title: 'Code Debugging Contest', date: 'Oct 10, 2026', participants: 45, status: 'Draft' },
    { id: 3, title: 'Tech Talk: AI Future', date: 'Nov 02, 2026', participants: 0, status: 'Pending Approval' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Manage Events</h1>
          <p className="text-muted">Create and manage your club's events and competitions.</p>
        </div>
        <button className="btn btn-primary">+ Create New Event</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Event Title</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Participants</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{event.title}</td>
                <td style={{ padding: '16px 24px' }} className="text-muted">{event.date}</td>
                <td style={{ padding: '16px 24px' }}>{event.participants}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${event.status === 'Active' ? 'badge-green' : event.status === 'Draft' ? 'badge-orange' : 'badge-blue'}`}>
                    {event.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
