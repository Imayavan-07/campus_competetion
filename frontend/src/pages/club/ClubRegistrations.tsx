import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  UsersIcon, 
  CalendarIcon, 
  MapPinIcon, 
  CheckIcon, 
  ClockIcon, 
  SearchIcon, 
  DownloadIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  MailIcon,
  XMarkIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { eventsService, EventItem } from '../../services/eventsService';

export interface DelegateItem {
  name: string;
  reg: string;
  email?: string;
  track?: string;
  status: string;
  checkedIn: boolean;
  ticketId?: string;
}

export default function ClubRegistrations(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const currentClubName = user?.club || 'Robotics Society';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter tabs for the Event Cards selector
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [eventSearch, setEventSearch] = useState<string>('');

  // Roster filters & search
  const [rosterFilter, setRosterFilter] = useState<'all' | 'checkedIn' | 'confirmed' | 'waitlist'>('all');
  const [rosterSearch, setRosterSearch] = useState<string>('');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [newDelegate, setNewDelegate] = useState<{
    name: string;
    reg: string;
    email: string;
    track: string;
    status: string;
  }>({
    name: '',
    reg: '',
    email: '',
    track: 'Autonomous Systems',
    status: 'Confirmed'
  });

  const loadAllEvents = async () => {
    try {
      setLoading(true);
      const all = await eventsService.getEvents({ club: currentClubName });
      setEvents(all || []);

      const paramId = searchParams.get('eventId');
      const targetId = paramId ? Number(paramId) : (all && all.length > 0 ? all[0].id : null);
      if (targetId) {
        setSelectedEventId(targetId);
        const found = all?.find(e => e.id === targetId) || null;
        setSelectedEvent(found);
      }
    } catch (err: any) {
      showToast('Failed to load registrations and events from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEvents();
  }, [searchParams, currentClubName]);

  const handleSelectEvent = (id: number) => {
    setSelectedEventId(id);
    const found = events.find(e => e.id === id) || null;
    setSelectedEvent(found);

    // Smooth scroll down to the realtime roster section
    setTimeout(() => {
      const el = document.getElementById('realtime-roster-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Filter events in the selector strip
  const filteredEvents = events.filter(evt => {
    const matchesSearch = (evt.title || '').toLowerCase().includes(eventSearch.toLowerCase()) ||
                          (evt.venue || '').toLowerCase().includes(eventSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (eventFilter === 'upcoming') {
      return evt.timeframe !== 'Past' && evt.status !== 'Past';
    }
    if (eventFilter === 'past') {
      return evt.timeframe === 'Past' || evt.status === 'Past';
    }
    return true;
  });

  // Delegates for selected event
  const currentDelegates: DelegateItem[] = selectedEvent?.sampleDelegates || [];

  // 1-Click Check-in Toggle
  const handleToggleCheckIn = async (indexInFiltered: number, originalDelegate: DelegateItem) => {
    if (!selectedEvent) return;

    const updated = currentDelegates.map(d => {
      if (d.reg === originalDelegate.reg && d.name === originalDelegate.name) {
        return { ...d, checkedIn: !d.checkedIn };
      }
      return d;
    });

    try {
      await eventsService.updateEvent(selectedEvent.id, { sampleDelegates: updated });
      const refreshed = { ...selectedEvent, sampleDelegates: updated };
      setSelectedEvent(refreshed);
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? refreshed : e));

      showToast(
        !originalDelegate.checkedIn
          ? `Accreditation verified for ${originalDelegate.name} (Checked In)`
          : `Check-in revoked for ${originalDelegate.name}`,
        !originalDelegate.checkedIn ? 'success' : 'info'
      );
    } catch (err: any) {
      showToast('Failed to update delegate check-in status on server', 'error');
    }
  };

  // Manual Enroll Delegate
  const handleEnrollDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegate.name.trim() || !newDelegate.reg.trim()) {
      showToast('Please enter delegate full name and registration ID!', 'error');
      return;
    }

    const ticketId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
    const delegateObj: DelegateItem = {
      name: newDelegate.name.trim(),
      reg: newDelegate.reg.trim().toUpperCase(),
      email: newDelegate.email.trim() || `${newDelegate.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      track: newDelegate.track,
      status: newDelegate.status,
      checkedIn: false,
      ticketId
    };

    const updated = [delegateObj, ...currentDelegates];
    try {
      await eventsService.updateEvent(selectedEvent.id, { sampleDelegates: updated });
      const refreshed = { ...selectedEvent, sampleDelegates: updated, attendees: updated.length };
      setSelectedEvent(refreshed);
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? refreshed : e));

      setIsEnrollModalOpen(false);
      setNewDelegate({
        name: '',
        reg: '',
        email: '',
        track: 'Autonomous Systems',
        status: 'Confirmed'
      });
      showToast(`Delegate ${delegateObj.name} successfully registered with Pass ${ticketId}!`, 'success');
    } catch (err: any) {
      showToast('Failed to enroll delegate on server', 'error');
    }
  };

  // Export CSV for a specific event or currently selected event
  const handleExportCSV = (targetEvent?: any) => {
    const evt = targetEvent || selectedEvent;
    if (!evt) return;

    const delegatesList: DelegateItem[] = evt.sampleDelegates || (evt.id === selectedEvent?.id ? currentDelegates : []);
    const rows = [
      ['Registration ID', 'Delegate Name', 'University Email', 'Track / Specialization', 'Status', 'Check-In State', 'Ticket Pass'],
      ...delegatesList.map(d => [
        d.reg,
        d.name,
        d.email || `${d.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
        d.track || 'General Competition Track',
        d.status || 'Confirmed',
        d.checkedIn ? 'Checked In' : 'Not Checked In',
        d.ticketId || `TCK-${Math.floor(1000 + Math.random() * 9000)}`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(evt.title || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${delegatesList.length} delegate records for "${evt.title}" to CSV!`, 'success');
  };

  // Filtered delegate roster
  const filteredDelegates = currentDelegates.filter(del => {
    const matchesSearch = (del.name || '').toLowerCase().includes(rosterSearch.toLowerCase()) ||
                          (del.reg || '').toLowerCase().includes(rosterSearch.toLowerCase()) ||
                          (del.email || '').toLowerCase().includes(rosterSearch.toLowerCase()) ||
                          (del.track || '').toLowerCase().includes(rosterSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (rosterFilter === 'checkedIn') return del.checkedIn;
    if (rosterFilter === 'confirmed') return del.status === 'Confirmed' || del.status === 'Attending' || del.status === 'Pre-Registered';
    if (rosterFilter === 'waitlist') return del.status === 'Waitlisted';
    return true;
  });

  // Metrics
  const totalRegistered = selectedEvent?.registration?.totalRegistered || currentDelegates.length || 0;
  const maxCapacity = selectedEvent?.registration?.maxCapacity || 300;
  const capacityPercent = Math.min(100, Math.round((totalRegistered / Math.max(1, maxCapacity)) * 100));
  const checkedInCount = currentDelegates.filter(d => d.checkedIn).length;
  const checkInPercent = currentDelegates.length > 0 ? Math.round((checkedInCount / currentDelegates.length) * 100) : 0;
  const waitlistCount = currentDelegates.filter(d => d.status === 'Waitlisted').length;

  return (
    <div className="flex flex-col gap-8 pb-16" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Top Header Row */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Club Portal</span>
            <span className="badge badge-success text-[10px] font-extrabold">Delegate Roster & Accreditation Hub</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Event Registrations
          </h1>
          <p className="page-description text-xs text-muted">
            Select upcoming or past fixtures to inspect registration capacity, preview attached registration forms, and manage live gate check-in.
          </p>
        </div>

        {/* Action Buttons: Green, Grey, Red */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="btn btn-outline btn-sm font-bold"
            onClick={handleExportCSV}
            disabled={!selectedEvent}
          >
            <DownloadIcon className="w-4 h-4 text-primary" />
            <span>Export Roster (CSV)</span>
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm font-bold shadow-md shadow-emerald-600/20"
            onClick={() => setIsEnrollModalOpen(true)}
            disabled={!selectedEvent}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Enroll Delegate</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. EVENT SELECTOR SECTION: CARDS FOR UPCOMING & PAST FIXTURES
          ===================================================================== */}
      <div className="event-glass-card">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-base font-extrabold text-main">Select Fixture to View Registration Details</h2>
            <p className="text-xs text-muted mt-0.5">
              Click any card below to load delegate rosters, form configurations, and check-in metrics.
            </p>
          </div>

          {/* Filter Pills: All, Upcoming, Past */}
          <div className="filter-pills-bar">
            <button 
              className={`filter-pill ${eventFilter === 'all' ? 'active' : ''}`}
              onClick={() => setEventFilter('all')}
            >
              All Events ({events.length})
            </button>
            <button 
              className={`filter-pill ${eventFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setEventFilter('upcoming')}
            >
              Upcoming ({events.filter(e => e.timeframe !== 'Past' && e.status !== 'Past').length})
            </button>
            <button 
              className={`filter-pill ${eventFilter === 'past' ? 'active' : ''}`}
              onClick={() => setEventFilter('past')}
            >
              Past ({events.filter(e => e.timeframe === 'Past' || e.status === 'Past').length})
            </button>
          </div>
        </div>

        {/* Search Fixtures Input */}
        <div className="event-search-box mb-4">
          <SearchIcon className="w-4 h-4 text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search fixtures by event title or venue..."
            value={eventSearch}
            onChange={(e) => setEventSearch(e.target.value)}
          />
        </div>

        {/* Fixture Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isSelected = selectedEventId === evt.id;
            const isPast = evt.timeframe === 'Past' || evt.status === 'Past';
            const count = evt.registration?.totalRegistered || evt.sampleDelegates?.length || evt.attendees || 0;
            const maxCap = evt.registration?.maxCapacity || 300;
            const fillPct = Math.min(100, Math.round((count / Math.max(1, maxCap)) * 100));

            return (
              <div 
                key={evt.id}
                onClick={() => handleSelectEvent(evt.id)}
                className={`fixture-glass-card group ${isSelected ? 'selected' : ''}`}
              >
                <div>
                  {/* Top Bar with Date, Status Badge & Active Roster Indicator */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`event-date-tile ${evt.status === 'Ongoing' ? 'ongoing' : isPast ? 'past' : ''}`}>
                        <span className="event-date-month">{evt.month || 'OCT'}</span>
                        <span className="event-date-day">{evt.day || '24'}</span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-main block">{evt.date}</span>
                        <span className="text-[10px] text-muted font-bold block">{evt.session || 'Main Session'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`badge text-[10px] font-black ${
                        evt.status === 'Ongoing' ? 'badge-success' :
                        isPast ? 'badge-neutral' : 
                        evt.approvalStatus === 'Approved' ? 'badge-blue' : 'badge-warning'
                      }`}>
                        {evt.status === 'Ongoing' ? 'Live Ongoing' : isPast ? 'Past Event' : (evt.approvalStatus || 'Under Review')}
                      </span>

                      {isSelected && (
                        <span className="badge badge-primary text-[9px] font-black tracking-wider flex items-center gap-1 shadow-sm">
                          <CheckIcon className="w-2.5 h-2.5" />
                          <span>Active Roster</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-black text-base mb-1.5 transition-colors line-clamp-1 group-hover:text-primary ${
                    isSelected ? 'text-primary' : 'text-main'
                  }`}>
                    {evt.title}
                  </h3>

                  {/* Venue */}
                  <p className="text-xs text-muted flex items-center gap-1.5 mb-3 font-medium">
                    <MapPinIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </p>
                </div>

                {/* Bottom Capacity Metric Bar & Actions */}
                <div>
                  <div className="pt-3 border-t border-gray-100 dark:border-neutral-800/80">
                    <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold">
                      <span className="text-muted">Registered Seats</span>
                      <span className="text-main font-black">{count} / {maxCap} ({fillPct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          fillPct >= 95 ? 'bg-rose-500' :
                          fillPct >= 80 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Clickable Action Row: Select / View Roster & Direct CSV Export */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted group-hover:text-primary'}`} />
                      <span className={`text-[11px] font-extrabold ${isSelected ? 'text-primary' : 'text-muted group-hover:text-primary'} transition-colors`}>
                        {isSelected ? 'Live Roster Displayed' : 'Click to View Roster'}
                      </span>
                    </div>

                    <button 
                      type="button"
                      className="btn btn-outline btn-xs font-bold flex items-center gap-1 text-primary hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportCSV(evt);
                      }}
                      title={`Export ${evt.title} delegate roster as CSV`}
                    >
                      <DownloadIcon className="w-3 h-3 text-primary" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. SELECTED EVENT REALTIME REGISTRATION TELEMETRY & ROSTER
          ===================================================================== */}
      {selectedEvent ? (
        <div id="realtime-roster-section" className="flex flex-col gap-6 scroll-mt-6">
          {/* Selected Event Hero Summary Banner */}
          <div className="event-overview-hero">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                  <span className="badge badge-blue flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{selectedEvent.session || 'Afternoon Session'}</span>
                  </span>
                  <span className="badge badge-purple">{selectedEvent.academicYear || 'AY 2026 - 2027'}</span>
                  <span className="text-muted font-semibold">
                    {selectedEvent.date} • {selectedEvent.timeSlot || '02:00 PM - 08:00 PM'}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-main tracking-tight mb-1">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedEvent.venue}</span>
                  <span className="text-gray-300 dark:text-neutral-700">•</span>
                  <span>Conducted by <strong>{selectedEvent.club}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm font-bold shadow-sm shadow-emerald-600/20 flex items-center gap-1.5"
                  onClick={() => handleExportCSV(selectedEvent)}
                  title="Download full delegate registration roster as CSV"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button 
                  className="btn btn-outline btn-sm font-bold"
                  onClick={() => navigate(`/club/events/${selectedEvent.id}`)}
                >
                  <span>Event Full Details</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 Telemetry Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Registered / Capacity */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-400">Total Registered</span>
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <UsersIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-2xl font-black text-main">{totalRegistered}</span>
                <span className="text-xs text-muted font-bold">/ {maxCapacity} Seats</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${capacityPercent}%` }} />
              </div>
              <span className="text-[10px] text-muted font-semibold mt-1.5 block">
                {capacityPercent}% Venue Seating Occupied
              </span>
            </div>

            {/* Live Check-In Gate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-400">Gate Check-In</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{checkedInCount}</span>
                <span className="text-xs text-muted font-bold">/ {currentDelegates.length} Present</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${checkInPercent}%` }} />
              </div>
              <span className="text-[10px] text-muted font-semibold mt-1.5 block">
                {checkInPercent}% Turnout Rate
              </span>
            </div>

            {/* Waitlisted & Standby */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-400">Waitlist Queue</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <ClockIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{waitlistCount}</span>
                <span className="text-xs text-muted font-bold">Delegates</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, waitlistCount * 20)}%` }} />
              </div>
              <span className="text-[10px] text-muted font-semibold mt-1.5 block">
                Auto-promoted if seats open
              </span>
            </div>

            {/* Registration Window */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-400">Registration Status</span>
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <ShieldIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="mb-1.5">
                <span className="badge badge-success text-xs font-black">
                  {selectedEvent.registration?.status || 'Registration Active'}
                </span>
              </div>
              <span className="text-[11px] text-muted font-semibold block mt-2">
                Deadline: <strong>{selectedEvent.registration?.deadline || selectedEvent.date}</strong>
              </span>
            </div>
          </div>

          {/* =================================================================
              3. ATTACHED REGISTRATION FORM & QUESTIONNAIRE SPECIFICATIONS
              ================================================================= */}
          {selectedEvent.regFormConfig && (
            <div className="event-glass-card">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-main">Attached Registration Form Specifications</h3>
                </div>
                <span className="badge badge-primary text-xs">
                  {selectedEvent.hasRegForm ? 'Custom Entry Form' : 'Standard Accreditation Form'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs mb-4">
                <h4 className="font-extrabold text-blue-950 dark:text-blue-200 text-sm mb-1">
                  {selectedEvent.regFormConfig.formTitle || 'Delegate Registration Form'}
                </h4>
                {selectedEvent.regFormConfig.instructions && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 italic">
                    "{selectedEvent.regFormConfig.instructions}"
                  </p>
                )}

                {/* Attribute collection toggles */}
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {selectedEvent.regFormConfig.collectTeamInfo && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-blue-200 dark:border-neutral-700 text-blue-800 dark:text-blue-300 font-bold">
                      ✓ Team Member Info Required
                    </span>
                  )}
                  {selectedEvent.regFormConfig.collectDietary && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-neutral-700 text-emerald-800 dark:text-emerald-300 font-bold">
                      ✓ Dietary Constraints
                    </span>
                  )}
                  {selectedEvent.regFormConfig.collectTshirt && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-purple-200 dark:border-neutral-700 text-purple-800 dark:text-purple-300 font-bold">
                      ✓ Official Event T-Shirt
                    </span>
                  )}
                </div>
              </div>

              {/* Questionnaire Prompts */}
              {selectedEvent.regFormConfig.customQuestions && selectedEvent.regFormConfig.customQuestions.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-2.5">
                    Custom Registration Prompts & Fields ({selectedEvent.regFormConfig.customQuestions.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {selectedEvent.regFormConfig.customQuestions.map((q: any, idx: number) => (
                      <div key={q.id || idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800">
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <span className="font-bold text-main">
                            {idx + 1}. {q.label}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {q.required && <span className="badge badge-danger text-[9px]">Required</span>}
                            <span className="badge badge-neutral text-[9px] uppercase">{q.type}</span>
                          </div>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.options.map((opt: string, oIdx: number) => (
                              <span key={oIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-[10px] text-muted font-medium">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              4. INTERACTIVE DELEGATE ROSTER & 1-CLICK CHECK-IN GATE
              ================================================================= */}
          <div className="event-glass-card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-extrabold text-main">Delegate Roster & Live Check-In Gate</h3>
                <p className="text-xs text-muted mt-0.5">
                  1-Click toggle to verify student accreditation and venue gate entry.
                </p>
              </div>

              {/* Roster Filter Pills */}
              <div className="filter-pills-bar">
                <button 
                  className={`filter-pill ${rosterFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setRosterFilter('all')}
                >
                  All ({currentDelegates.length})
                </button>
                <button 
                  className={`filter-pill ${rosterFilter === 'checkedIn' ? 'active' : ''}`}
                  onClick={() => setRosterFilter('checkedIn')}
                >
                  Checked In ({checkedInCount})
                </button>
                <button 
                  className={`filter-pill ${rosterFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setRosterFilter('confirmed')}
                >
                  Confirmed ({currentDelegates.filter(d => d.status === 'Confirmed' || d.status === 'Attending').length})
                </button>
                <button 
                  className={`filter-pill ${rosterFilter === 'waitlist' ? 'active' : ''}`}
                  onClick={() => setRosterFilter('waitlist')}
                >
                  Waitlisted ({waitlistCount})
                </button>
              </div>
            </div>

            {/* Search Delegate Roster */}
            <div className="event-search-box mb-4">
              <SearchIcon className="w-4 h-4 text-muted shrink-0" />
              <input 
                type="text" 
                placeholder="Search delegates by student name, roll ID, email, or track..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
              />
            </div>

            {/* Delegate Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-neutral-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-gray-100 dark:border-neutral-800 text-[11px] uppercase font-bold text-gray-400">
                  <tr>
                    <th className="py-3.5 px-4">Delegate / Student</th>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Track / Stream</th>
                    <th className="py-3.5 px-4">Pass ID</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Venue Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60 bg-white dark:bg-neutral-900/40">
                  {filteredDelegates.length > 0 ? (
                    filteredDelegates.map((del, idx) => (
                      <tr key={del.reg || idx} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold flex items-center justify-center text-xs">
                              {del.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-extrabold text-main block">{del.name}</span>
                              <span className="text-[11px] text-muted">{del.email || 'student@university.edu'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-main">
                          {del.reg}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-gray-700 dark:text-gray-300">
                            {del.track || 'Autonomous Systems'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                          {del.ticketId || `TCK-${8000 + idx}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`badge ${
                            del.status === 'Confirmed' || del.status === 'Attending' || del.status === 'Attended' ? 'badge-success' :
                            del.status === 'Waitlisted' ? 'badge-warning' : 'badge-blue'
                          }`}>
                            {del.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(idx, del)}
                            className={`btn btn-xs font-bold transition-all ${
                              del.checkedIn 
                                ? 'btn-secondary text-white shadow-sm' 
                                : 'btn-outline border-dashed'
                            }`}
                          >
                            <CheckIcon className="w-3.5 h-3.5" />
                            <span>{del.checkedIn ? 'Checked In' : 'Check In Gate'}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted">
                        No delegate records match the current filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card py-16 text-center">
          <h3 className="text-lg font-bold mb-2">No Event Selected</h3>
          <p className="text-xs text-muted">Please select an event fixture above to inspect registration telemetry.</p>
        </div>
      )}

      {/* =====================================================================
          MODAL: ENROLL NEW DELEGATE
          ===================================================================== */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Manual Delegate Enrollment"
        subtitle={`Event: ${selectedEvent?.title || 'Club Event'}`}
        size="md"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-outline btn-sm font-bold"
              onClick={() => setIsEnrollModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm font-bold shadow-md shadow-emerald-600/20"
              onClick={handleEnrollDelegate}
            >
              <CheckIcon className="w-4 h-4" />
              <span>Confirm Enrollment</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleEnrollDelegate} className="flex flex-col gap-4 text-xs">
          <div className="form-group">
            <label className="form-label font-bold">Delegate Full Name *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Samantha Vance"
              value={newDelegate.name}
              onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label font-bold">University Roll / Reg ID *</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. 2024CS99"
                value={newDelegate.reg}
                onChange={(e) => setNewDelegate({ ...newDelegate, reg: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label font-bold">University Email</label>
              <input 
                type="email"
                className="form-input"
                placeholder="e.g. s.vance@university.edu"
                value={newDelegate.email}
                onChange={(e) => setNewDelegate({ ...newDelegate, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label font-bold">Competition Track / Stream</label>
              <select 
                className="form-input"
                value={newDelegate.track}
                onChange={(e) => setNewDelegate({ ...newDelegate, track: e.target.value })}
              >
                <option value="Autonomous Systems">Autonomous Systems</option>
                <option value="Combat Robotics">Combat Robotics</option>
                <option value="Drone Aerial Obstacle">Drone Aerial Obstacle</option>
                <option value="General Delegate">General Delegate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label font-bold">Registration Status</label>
              <select 
                className="form-input"
                value={newDelegate.status}
                onChange={(e) => setNewDelegate({ ...newDelegate, status: e.target.value })}
              >
                <option value="Confirmed">Confirmed / Accredited</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Attending">Attending</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
