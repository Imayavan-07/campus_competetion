import React, { useState } from 'react';
import NoticeCard from '../../components/NoticeCard';

export default function NoticeBoard() {
  const [filter, setFilter] = useState('All');

  const notices = [
    { id: 1, title: 'Campus Wifi Maintenance', author: 'IT Services', date: 'Today, 10:00 AM', priority: 'High', content: 'The main library wifi will be down for maintenance from 2 AM to 4 AM. Please plan accordingly.', category: 'Infrastructure' },
    { id: 2, title: 'Library Hours Extended', author: 'Librarian', date: 'Yesterday', priority: 'Normal', content: 'Library will remain open until midnight during finals week.', category: 'Academic' },
    { id: 3, title: 'New Cafe Menu', author: 'Student Union', date: 'Oct 12', priority: 'Normal', content: 'The campus cafe has introduced a new vegan menu. Check it out!', category: 'General' },
    { id: 4, title: 'Career Fair Registration', author: 'Placement Cell', date: 'Oct 10', priority: 'High', content: 'Last day to register for the upcoming Fall Career Fair is this Friday.', category: 'Career' },
  ];

  const filteredNotices = filter === 'All' ? notices : notices.filter(n => n.priority === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Notice Board</h1>
          <p className="text-muted">Stay updated with the latest campus announcements.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="form-control" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Notices</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
          </select>
          <button className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {filteredNotices.map(notice => (
          <NoticeCard 
            key={notice.id}
            title={notice.title}
            author={notice.author}
            date={notice.date}
            priority={notice.priority}
            content={notice.content}
          />
        ))}
      </div>
    </div>
  );
}
