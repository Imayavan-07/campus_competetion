import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ title, date, club, description, tags, linkTo }) {
  return (
    <div className="card flex flex-col justify-between" style={{ height: '100%' }}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
          {date} • Organized by {club}
        </p>
        <p className="mb-4" style={{ fontSize: '0.95rem' }}>{description}</p>
        <div className="flex gap-2 mb-4">
          {tags?.map(tag => (
            <span key={tag} className="badge badge-blue">{tag}</span>
          ))}
        </div>
      </div>
      {linkTo && (
        <Link to={linkTo} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
          View Details
        </Link>
      )}
    </div>
  );
}
