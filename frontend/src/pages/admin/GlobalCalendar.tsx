import React, { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon, ClockIcon } from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { eventsService, EventItem } from '../../services/eventsService';

export default function GlobalCalendar() {
  const { showToast } = useToast();
  const [view, setView] = useState<'monthly' | 'daily'>('monthly');
  const [activeModal, setActiveModal] = useState<'newEvent' | 'viewEvent' | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<any[]>([]);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '18',
    time: '10:00 AM - 12:00 PM',
    venue: '',
    club: 'General Campus'
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      const mapped = (data || []).map((e: any) => {
        let dayStr = '15';
        if (e.day) {
          dayStr = String(e.day).padStart(2, '0');
        } else if (e.date) {
          const match = String(e.date).match(/\d{1,2}/);
          if (match) dayStr = match[0].padStart(2, '0');
        }
        return {
          id: e.id,
          title: e.title,
          date: dayStr,
          time: e.timeSlot || e.time_slot || '10:00 AM - 1:00 PM',
          venue: e.venue || 'Campus Auditorium',
          club: e.club || 'General Campus',
          type: e.category || 'workshop'
        };
      });
      setEvents(mapped);
    } catch (err: any) {
      showToast('Failed to load events from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.venue) return;
    try {
      await eventsService.createEvent({
        title: eventForm.title,
        club: eventForm.club,
        venue: eventForm.venue,
        date: `2026-09-${eventForm.date.padStart(2, '0')}`,
        timeSlot: eventForm.time,
        category: 'academic',
        description: `Scheduled slot on day ${eventForm.date}`,
        budget: '5000',
        attendees: 100,
        status: 'Upcoming',
        approvalStatus: 'Approved'
      });
      showToast(`Event "${eventForm.title}" slotted for Day ${eventForm.date}!`, 'success');
      setActiveModal(null);
      setEventForm({ title: '', date: '18', time: '10:00 AM - 12:00 PM', venue: '', club: 'General Campus' });
      loadEvents();
    } catch (err: any) {
      showToast('Failed to slot event', 'error');
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Global Academic & Event Calendar</h1>
          <p className="page-description">Synchronize hall reservations, university symposia, and club fixture dates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="filter-pills-bar">
            <button
              onClick={() => setView('monthly')}
              className={`filter-pill ${view === 'monthly' ? 'active' : ''}`}
            >Monthly Grid</button>
            <button
              onClick={() => setView('daily')}
              className={`filter-pill ${view === 'daily' ? 'active' : ''}`}
            >Day Schedule</button>
          </div>
          <button onClick={() => setActiveModal('newEvent')} className="btn btn-secondary">
            <PlusIcon className="w-4 h-4 text-black" />
            <span>Slot Event</span>
          </button>
        </div>
      </div>

      <div className="card">
        {view === 'monthly' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>September 2026 Academic Term</h2>
              <span className="badge badge-blue">Term 1 Scheduled</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', marginBottom: '10px', color: 'var(--text-subtle)' }}>
              <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {Array.from({ length: 30 }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                const event = events.find(e => e.date === day);
                return (
                  <div
                    key={i}
                    onClick={() => openDayEvent(day)}
                    style={{
                      minHeight: '96px',
                      border: event ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid var(--border-light)',
                      borderRadius: '12px',
                      padding: '8px',
                      background: event ? 'var(--primary-light)' : 'rgba(0,0,0,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                    className="hover:border-blue-500/60 hover:shadow-sm"
                    title={event ? `Click to view ${event.title}` : `Click to slot an event on Day ${day}`}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: event ? 'var(--primary-color)' : 'var(--text-subtle)' }}>
                        {day}
                      </span>
                      {event && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                    </div>
                    {event && (
                      <div className="mt-1.5 p-1 rounded-md bg-white dark:bg-neutral-900 border border-blue-200/60 dark:border-blue-900/50 text-[10px] font-bold text-blue-900 dark:text-blue-200 leading-tight truncate">
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Scheduled Agenda (Day 15, Sept 2026)</h2>
              <span className="badge badge-success">4 Sessions Active</span>
            </div>
            <div className="flex flex-col gap-3">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  onClick={() => {
                    setSelectedEvent(evt);
                    setActiveModal('viewEvent');
                  }}
                  className="p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-blue-500/40 cursor-pointer transition-all flex justify-between items-center flex-wrap gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-blue">Day {evt.date}</span>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800 }}>{evt.title}</h4>
                    </div>
                    <p className="text-muted text-xs flex items-center gap-2">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{evt.time} • Venue: <strong className="text-main">{evt.venue}</strong> • Club: <strong>{evt.club}</strong></span>
                    </p>
                  </div>
                  <button className="btn btn-outline btn-sm">Inspect Details</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: New Event */}
      <Modal
        isOpen={activeModal === 'newEvent'}
        onClose={() => setActiveModal(null)}
        title="Schedule University Event"
        subtitle={`Reserving calendar slot for Day ${eventForm.date}`}
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateEvent}>Confirm Reservation</button>
          </>
        }
      >
        <form onSubmit={handleCreateEvent}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. AI Symposium 2026"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Day (Sept 1-30)</label>
              <input 
                type="text" 
                className="form-input" 
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Window</label>
              <input 
                type="text" 
                className="form-input" 
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Designated Venue</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Quadrangle Stage / Main Auditorium"
              value={eventForm.venue}
              onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              required 
            />
          </div>
        </form>
      </Modal>

      {/* MODAL: View Event Details */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'viewEvent'}
          onClose={() => setActiveModal(null)}
          title={selectedEvent.title}
          subtitle={`Day ${selectedEvent.date}, September 2026`}
          size="sm"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close</button>
          }
        >
          <div className="flex flex-col gap-3 py-2">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <span className="text-xs font-bold text-gray-400">Time:</span>
              <span className="text-xs font-bold">{selectedEvent.time}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <span className="text-xs font-bold text-gray-400">Venue:</span>
              <span className="text-xs font-bold">{selectedEvent.venue}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <span className="text-xs font-bold text-gray-400">Organizer:</span>
              <span className="badge badge-blue">{selectedEvent.club}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
