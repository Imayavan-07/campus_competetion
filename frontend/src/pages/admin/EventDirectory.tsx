import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  DownloadIcon, 
  MapPinIcon, 
  ClubsIcon, 
  ArrowRightIcon 
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { DIRECTORY_EVENTS } from '../../data/eventsData';

export default function EventDirectory() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const events = DIRECTORY_EVENTS;

  const filteredEvents = events.filter(e => {
    const matchFilter = filter === 'All' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.club.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCardClick = (eventId) => {
    navigate(`/admin/events/${eventId}?source=directory`);
  };

  return (
    <div className="event-directory-wrapper">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">University Event Directory</h1>
          <p className="page-description">
            Search, audit, and inspect schedules for all campus-wide student fixtures.
          </p>
        </div>
        <button 
          className="btn btn-outline"
          onClick={() => showToast('Generated Master Event Schedule Log (PDF)!', 'success')}
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Export Master Log</span>
        </button>
      </div>

      {/* Floating Glassmorphic Control Bar */}
      <div className="event-control-bar">
        <div className="event-search-box">
          <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search fixtures by title or organizing club..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills-bar">
          {['All', 'Upcoming', 'Ongoing', 'Past'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-pill ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Glassmorphic Event Cards Grid (Strictly NO gradient top lines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div 
            key={event.id}
            className="event-glass-card"
            onClick={() => handleCardClick(event.id)}
          >
            <div>
              {/* Card Header: Date Tile & Clean Status Badge */}
              <div className="flex justify-between items-start">
                <div className={`event-date-tile ${event.status.toLowerCase()}`}>
                  <span className="event-date-month">{event.month}</span>
                  <span className="event-date-day">{event.day}</span>
                </div>
                
                <span className={`badge ${
                  event.status === 'Upcoming' ? 'badge-blue' :
                  event.status === 'Ongoing' ? 'badge-success' : 'badge-warning'
                }`}>
                  {event.status === 'Ongoing' && (
                    <span className="event-live-indicator">
                      <span className="event-live-dot" />
                    </span>
                  )}
                  <span>{event.status}</span>
                </span>
              </div>

              {/* Event Title */}
              <h3 className="event-card-title">{event.title}</h3>

              {/* Organizing Club */}
              <div className="event-card-club">
                <ClubsIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{event.club}</span>
              </div>

              {/* Soft Divider */}
              <div className="event-card-divider" />

              {/* Venue */}
              <div className="event-card-venue">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Card Footer: View Details Trigger */}
            <div className="event-card-footer flex justify-end">
              <span className="event-card-action">
                <span>View Details</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted">
            No matching events found for current filters.
          </div>
        )}
      </div>
    </div>
  );
}
