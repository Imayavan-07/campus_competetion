import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  EditIcon, 
  UsersIcon, 
  TrashIcon, 
  CalendarIcon,
  SearchIcon,
  MapPinIcon,
  CheckIcon,
  ClockIcon,
  ReviewsIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ShieldIcon,
  ArrowRightIcon,
  DocumentTextIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { eventsService, EventItem } from '../../services/eventsService';
import { venuesService, Venue } from '../../services/venuesService';

export default function ManageEvents() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const currentClubName = user?.club || 'Robotics Society';

  const [activeModal, setActiveModal] = useState<string | null>(null); // 'edit' | 'roster' | 'cancel'
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [allEvts, allVenues] = await Promise.all([
        eventsService.getEvents({ club: currentClubName }),
        venuesService.getVenues()
      ]);
      setEvents(allEvts || []);
      setVenues(allVenues || []);
    } catch (err: any) {
      showToast('Failed to load events from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentClubName]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'approved') return event.approvalStatus === 'Approved' || event.status === 'Approved' || event.status === 'Active';
    if (filterStatus === 'pending') return event.status === 'Pending Review' || event.status === 'Pending Approval' || event.approvalStatus === 'Pending';
    if (filterStatus === 'past') return event.timeframe === 'Past' || event.status === 'Past' || event.status === 'Completed';
    return true;
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      await eventsService.updateEvent(selectedEvent.id, {
        title: selectedEvent.title,
        venue: selectedEvent.venue,
        budget: selectedEvent.budget,
        status: selectedEvent.status
      });
      showToast(`Updated parameters for "${selectedEvent.title}"!`, 'success');
      setActiveModal(null);
      loadEvents();
    } catch (err: any) {
      showToast('Failed to update event', 'error');
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedEvent) return;
    try {
      await eventsService.updateEvent(selectedEvent.id, {
        status: 'Cancelled',
        approvalStatus: 'Cancelled'
      });
      showToast(`Cancelled fixture: "${selectedEvent.title}"`, 'error');
      setActiveModal(null);
      loadEvents();
    } catch (err: any) {
      showToast('Failed to cancel event', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Club Portal</span>
            <span className="badge badge-success text-[10px] font-extrabold">Active Fixtures</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Manage Club Events
          </h1>
          <p className="page-description text-xs text-muted">
            Inspect scheduled fixtures, check approval clearance, supervise live gate check-in, and manage event parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/club/calendar')}
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>View Calendar</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/club/post-event')}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Post New Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="event-control-bar">
        <div className="event-search-box">
          <SearchIcon className="w-4 h-4 text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search fixtures by title or venue..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills-bar">
          <button 
            className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Fixtures ({events.length})
          </button>
          <button 
            className={`filter-pill ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            Approved & Active
          </button>
          <button 
            className={`filter-pill ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Under Review
          </button>
          <button 
            className={`filter-pill ${filterStatus === 'past' ? 'active' : ''}`}
            onClick={() => setFilterStatus('past')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Events Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            className="event-glass-card flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
            onClick={() => navigate(`/club/events/${event.id}`)}
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`event-date-tile ${event.status === 'Ongoing' ? 'ongoing' : event.timeframe === 'Past' ? 'past' : ''}`}>
                    <span className="event-date-month">{event.month || 'OCT'}</span>
                    <span className="event-date-day">{event.day || '15'}</span>
                  </div>
                  <div>
                    <h3 className="event-card-title text-base font-extrabold group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <span className={`badge ${
                  event.status === 'Ongoing' ? 'badge-success' :
                  event.status === 'Approved' || event.approvalStatus === 'Approved' ? 'badge-blue' :
                  event.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {event.status === 'Ongoing' ? 'Live Ongoing' : event.status || 'Pending Review'}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2 text-xs text-muted">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="font-semibold text-main">{event.venue}</span>
                  <span>•</span>
                  <span>{event.timeSlot || '10:00 AM - 04:00 PM'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <UsersIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span><strong>{event.attendees || 120}</strong> Registered Delegates</span>
                  <span>•</span>
                  <CurrencyDollarIcon className="w-3.5 h-3.5 text-tertiary shrink-0" />
                  <span>Budget: <strong>{event.budget || '$1,500'}</strong></span>
                </p>
              </div>

              {event.description && (
                <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>

            <div 
              className="event-card-footer mt-5 pt-3 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  className="btn btn-secondary btn-xs font-bold shadow-sm shadow-emerald-600/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/club/registrations?eventId=${event.id}`);
                  }}
                  title="Manage Registrations & Gate Check-In"
                >
                  <UsersIcon className="w-3 h-3" />
                  <span>Registrations</span>
                </button>

                <button 
                  className="btn btn-outline btn-xs font-bold text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/club/forms?eventId=${event.id}`);
                  }}
                  title="Design & Edit Event Registration Form"
                >
                  <DocumentTextIcon className="w-3 h-3 text-purple-600" />
                  <span>Reg Form</span>
                </button>

                {(event.timeframe === 'Past' || event.status === 'Past' || event.status === 'Completed') && (
                  <button 
                    className="btn btn-outline btn-xs text-amber-700 dark:text-amber-400 font-bold border-amber-300 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/club/reviews?eventId=${event.id}`);
                    }}
                    title="View Post-Event Reviews"
                  >
                    <ReviewsIcon className="w-3 h-3 text-tertiary" />
                    <span>Reviews</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setActiveModal('edit');
                  }}
                  title="Edit Event Parameters"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </button>
                <button 
                  className="btn btn-ghost btn-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setActiveModal('cancel');
                  }}
                  title="Cancel Event"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-2 p-12 text-center card">
            <p className="text-muted font-semibold mb-3">No club events found matching your search criteria.</p>
            <button 
              className="btn btn-primary btn-sm mx-auto"
              onClick={() => navigate('/club/post-event')}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Post New Event</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: Quick Attendee Roster Preview */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'roster'}
          onClose={() => setActiveModal(null)}
          title={`Registered Attendees — ${selectedEvent.title}`}
          subtitle={`${selectedEvent.venue} • ${selectedEvent.attendees || 120} Confirmed Registrations`}
          size="md"
          footer={
            <div className="flex justify-between w-full items-center">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setActiveModal(null);
                  navigate(`/club/events/${selectedEvent.id}`);
                }}
              >
                Open Gate Check-in Center →
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setActiveModal(null)}>Close</button>
            </div>
          }
        >
          <div className="flex flex-col gap-3 py-2">
            {(selectedEvent.sampleDelegates || [
              { name: 'Alex Vance', reg: '2024CS01', status: 'Attending' },
              { name: 'Maya Lin', reg: '2024EC14', status: 'Attending' },
              { name: 'Evan Wright', reg: '2023ME88', status: 'Waitlisted' }
            ]).map((del: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary font-bold text-xs flex items-center justify-center">
                    {del.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-main">{del.name}</h5>
                    <span className="text-[10px] text-muted font-mono">{del.reg}</span>
                  </div>
                </div>
                <span className={`badge ${del.status === 'Checked-In' ? 'badge-success' : 'badge-blue'} text-[10px]`}>
                  {del.status}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* MODAL: Edit Event Parameters */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'edit'}
          onClose={() => setActiveModal(null)}
          title={`Edit Fixture: ${selectedEvent.title}`}
          subtitle="Update venue allocations, operational budgets, or fixture status"
          size="md"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSubmit}>Save Modifications</button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2">
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input 
                type="text" 
                className="form-input"
                value={selectedEvent.title}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Venue</label>
              <select 
                className="form-select"
                value={selectedEvent.venue}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, venue: e.target.value })}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.name}>{v.name} (Cap: {v.capacity})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Grant / Budget</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={selectedEvent.budget || '$1,500'}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, budget: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fixture Status</label>
                <select 
                  className="form-select"
                  value={selectedEvent.status || 'Approved'}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
                >
                  <option value="Approved">Approved</option>
                  <option value="Ongoing">Live Ongoing</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Past">Completed / Past</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Cancel Fixture Confirmation */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'cancel'}
          onClose={() => setActiveModal(null)}
          title="Cancel Scheduled Fixture?"
          subtitle="This action will notify all registered delegates and release campus hall reservation"
          size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Keep Fixture</button>
              <button className="btn btn-danger" onClick={handleCancelConfirm}>Confirm Cancellation</button>
            </>
          }
        >
          <div className="py-2 text-xs text-muted leading-relaxed">
            Are you sure you want to cancel <strong>"{selectedEvent.title}"</strong>? Any reserved equipment in {selectedEvent.venue} will be automatically decommissioned.
          </div>
        </Modal>
      )}
    </div>
  );
}
