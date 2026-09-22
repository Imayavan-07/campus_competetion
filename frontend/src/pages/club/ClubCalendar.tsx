import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  CheckIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function ClubCalendar() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [view, setView] = useState<'monthly' | 'daily'>('monthly');
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'viewEvent'
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('OCT');

  const [events, setEvents] = useState([
    { 
      id: 100, 
      title: 'Annual Robotics Grand Prix 2026', 
      date: '12', 
      month: 'OCT', 
      time: '02:00 PM - 08:00 PM', 
      venue: 'Main Innovation Arena', 
      type: 'competition',
      attendees: 120,
      status: 'Pending Review'
    },
    { 
      id: 2, 
      title: 'Combat Bot Engineering Workshop', 
      date: '15', 
      month: 'OCT', 
      time: '10:00 AM - 04:00 PM', 
      venue: 'Makerspace Lab 2', 
      type: 'workshop',
      attendees: 52,
      status: 'Ongoing'
    },
    { 
      id: 201, 
      title: 'LiDAR Sensor Calibration Sprint', 
      date: '20', 
      month: 'OCT', 
      time: '03:00 PM - 06:00 PM', 
      venue: 'Advanced Robotics Lab', 
      type: 'clinic',
      attendees: 35,
      status: 'Approved'
    },
    { 
      id: 202, 
      title: 'Robotics Guild Executive Board Review', 
      date: '28', 
      month: 'OCT', 
      time: '05:00 PM - 06:30 PM', 
      venue: 'Student Union Lounge', 
      type: 'meeting',
      attendees: 12,
      status: 'Approved'
    }
  ]);

  const openDayEvent = (dayStr: string) => {
    const existing = events.find(e => e.date === dayStr && e.month === selectedMonth);
    if (existing) {
      setSelectedEvent(existing);
      setActiveModal('viewEvent');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Club Fixture & Scheduling Calendar</h1>
          <p className="page-description">Coordinate laboratory slots, competition heats, and university room reservations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="filter-pills-bar">
            <button
              onClick={() => setView('monthly')}
              className={`filter-pill ${view === 'monthly' ? 'active' : ''}`}
            >
              Monthly Grid
            </button>
            <button
              onClick={() => setView('daily')}
              className={`filter-pill ${view === 'daily' ? 'active' : ''}`}
            >
              Day Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="card">
        {/* Month Selector Strip */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 pb-4 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-main">
              {selectedMonth === 'SEP' ? 'September 2026' : selectedMonth === 'OCT' ? 'October 2026' : 'November 2026'}
            </h2>
            <span className="badge badge-primary">Term 1 Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className={`btn btn-xs ${selectedMonth === 'SEP' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedMonth('SEP')}
            >
              Sep 2026
            </button>
            <button 
              className={`btn btn-xs ${selectedMonth === 'OCT' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedMonth('OCT')}
            >
              Oct 2026
            </button>
            <button 
              className={`btn btn-xs ${selectedMonth === 'NOV' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedMonth('NOV')}
            >
              Nov 2026
            </button>
          </div>
        </div>

        {view === 'monthly' ? (
          <div>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs tracking-wider mb-2.5 text-muted uppercase">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2.5">
              {Array.from({ length: 31 }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                const event = events.find(e => e.date === day && e.month === selectedMonth);
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (event) openDayEvent(day);
                    }}
                    className={`min-h-[105px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      event 
                        ? 'border-primary/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs hover:shadow-md hover:border-primary cursor-pointer' 
                        : 'border-gray-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black ${event ? 'text-primary' : 'text-muted'}`}>{day}</span>
                      {event && (
                        <span className={`w-2 h-2 rounded-full ${
                          event.status === 'Ongoing' ? 'bg-secondary animate-pulse' : 'bg-primary'
                        }`} />
                      )}
                    </div>

                    {event && (
                      <div className="mt-1">
                        <span className="text-[11px] font-extrabold text-main line-clamp-2 leading-tight hover:text-primary">
                          {event.title}
                        </span>
                        <span className="text-[9px] font-bold text-muted truncate block mt-0.5">
                          {event.venue.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Daily Schedule Agenda Timeline */
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-main mb-2">Detailed Schedule for {selectedMonth} 2026</h3>
            <div className="flex flex-col gap-3">
              {events
                .filter(e => e.month === selectedMonth)
                .map(event => (
                  <div 
                    key={event.id}
                    onClick={() => { setSelectedEvent(event); setActiveModal('viewEvent'); }}
                    className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 hover:border-primary/40 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="event-date-tile">
                        <span className="event-date-month">{event.month}</span>
                        <span className="event-date-day">{event.date}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-main hover:text-primary">{event.title}</h4>
                        <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                          <ClockIcon className="w-3.5 h-3.5 text-primary" />
                          <span>{event.time}</span>
                          <span>•</span>
                          <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
                          <span>{event.venue}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`badge ${
                      event.status === 'Ongoing' ? 'badge-success' : 'badge-blue'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: View Event Preview */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'viewEvent'}
          onClose={() => setActiveModal(null)}
          title={selectedEvent.title}
          subtitle={`Scheduled for Day ${selectedEvent.date} ${selectedEvent.month} 2026`}
          size="md"
          footer={
            <div className="flex justify-between w-full">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setActiveModal(null);
                  navigate(`/club/events/${selectedEvent.id}`);
                }}
              >
                Open Full Event Page →
              </button>
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close</button>
            </div>
          }
        >
          <div className="flex flex-col gap-3 py-2 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-muted block mb-0.5">Allocated Venue</span>
                <span className="font-extrabold text-main text-sm flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-secondary" />
                  {selectedEvent.venue}
                </span>
              </div>
              <span className="badge badge-success">{selectedEvent.status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-muted block mb-0.5">Time Window</span>
                <span className="font-bold text-main">{selectedEvent.time}</span>
              </div>
              <div>
                <span className="font-bold text-muted block mb-0.5">Registered Delegates</span>
                <span className="font-extrabold text-main">{selectedEvent.attendees || 120} Students</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
