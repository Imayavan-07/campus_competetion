import React from 'react';

export default function ApproveEvents() {
  const events = [
    { id: 1, title: 'Tech Talk: AI Future', club: 'Computer Science Club', date: 'Nov 02, 2026', type: 'Event' },
    { id: 2, title: 'Music Fest 2026', club: 'Cultural Committee', date: 'Dec 15, 2026', type: 'Event' },
    { id: 3, title: 'Call for Magazine Submissions', club: 'Literary Society', date: 'Oct 30, 2026', type: 'Notice' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Approve Events & Notices</h1>
          <p className="text-muted">Review submissions from clubs before they go live on the student portal.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {events.map(event => (
          <div key={event.id} className="card flex justify-between items-center">
            <div>
              <div className="flex gap-2 items-center mb-2">
                <h3 style={{ margin: 0 }}>{event.title}</h3>
                <span className={`badge ${event.type === 'Event' ? 'badge-blue' : 'badge-orange'}`}>{event.type}</span>
              </div>
              <p className="text-muted" style={{ margin: 0 }}>Submitted by {event.club} • Target Date: {event.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm">Approve</button>
              <button className="btn btn-danger btn-sm">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
