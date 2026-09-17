import React from 'react';

export interface NoticeCardProps {
  title: string;
  date: string;
  author: string;
  content: string;
  priority?: string;
}

export default function NoticeCard({
  title,
  date,
  author,
  content,
  priority
}: NoticeCardProps): React.JSX.Element {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ margin: 0 }}>{title}</h3>
        {priority === 'High' && <span className="badge badge-orange">High Priority</span>}
      </div>
      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
        Posted by {author} • {date}
      </p>
      <p>{content}</p>
    </div>
  );
}
