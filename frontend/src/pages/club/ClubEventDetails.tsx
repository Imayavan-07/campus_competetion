import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon, 
  MailIcon, 
  CurrencyDollarIcon,
  ShieldIcon,
  PlusIcon,
  CheckIcon,
  EditIcon,
  TrashIcon,
  ReviewsIcon,
  StarIcon,
  SparklesIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ClubsIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { 
  getEventById, 
  updateEventDelegates, 
  CAMPUS_VENUES, 
  getCustomizedEvents, 
  saveCustomizedEvents 
} from '../../data/eventsData';

export default function ClubEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [delegates, setDelegates] = useState<any[]>([]);
  const [searchDelegate, setSearchDelegate] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'addDelegate' | 'addAgenda'

  const [newDelegate, setNewDelegate] = useState({
    name: '',
    reg: '',
    email: '',
    status: 'Confirmed'
  });

  const [newAgenda, setNewAgenda] = useState({
    time: '04:00 PM',
    title: ''
  });

  useEffect(() => {
    if (!id) return;
    const found = getEventById(id);
    if (found) {
      setEvent(found);
      const initialDelegates = found.sampleDelegates || [
        { name: 'Alex Vance', reg: '2024CS01', email: 'alex.vance@university.edu', status: 'Confirmed', checkedIn: true },
        { name: 'Sarah Jenkins', reg: '2024EC12', email: 'sarah.j@university.edu', status: 'Confirmed', checkedIn: false },
        { name: 'Liam O Connor', reg: '2023ME44', email: 'liam.oc@university.edu', status: 'Waitlisted', checkedIn: false },
        { name: 'Maya Lin', reg: '2024EC14', email: 'maya.lin@university.edu', status: 'Confirmed', checkedIn: true },
        { name: 'Devin Cole', reg: '2024RO01', email: 'devin.cole@university.edu', status: 'Confirmed', checkedIn: false }
      ];
      setDelegates(initialDelegates);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="card py-16 text-center">
        <h2 className="text-xl font-extrabold mb-3">Club Fixture Not Found</h2>
        <p className="text-muted text-sm mb-6">The requested fixture record could not be resolved from active university databases.</p>
        <button className="btn btn-outline mx-auto" onClick={() => navigate('/club/events')}>
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Return to Manage Events</span>
        </button>
      </div>
    );
  }

  const isPastOrCompleted = event.timeframe === 'Past' || event.status === 'Past' || event.status === 'Completed';

  // Venue metadata
  const venueMeta = CAMPUS_VENUES.find(v => v.name === event.venue) || {
    name: event.venue,
    capacity: 250,
    type: 'Campus Facility'
  };

  // Budget calculations
  const budgetBreakdown = event.budgetBreakdown || {};
  const prizeMoney = Number(budgetBreakdown.prizeMoney) || 0;
  const refreshments = Number(budgetBreakdown.refreshments) || 0;
  const decors = Number(budgetBreakdown.decors) || 0;
  const miscPurchases = Number(budgetBreakdown.miscPurchases) || 0;
  const customItems = budgetBreakdown.customItems || budgetBreakdown.others || [];
  const customTotal = customItems.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
  const totalBudget = prizeMoney + refreshments + decors + miscPurchases + customTotal || 
    (parseInt(String(event.budget || '1500').replace(/[^0-9]/g, ''), 10) || 1500);

  // Registration Form metadata
  const hasRegForm = event.hasRegForm !== undefined ? event.hasRegForm : true;
  const regFormConfig = event.regFormConfig || {
    formTitle: `${event.title} Registration Form`,
    instructions: 'Please complete all required fields for delegate accreditation.',
    collectTeamInfo: true,
    collectDietary: true,
    collectTshirt: false,
    customQuestions: [
      { id: 'q1', label: 'Competition Track / Specialization', type: 'select', options: ['Main Sprint Track', 'Open Category'], required: true },
      { id: 'q2', label: 'GitHub Repository / Project URL', type: 'text', required: false }
    ]
  };

  // Hosts list formatting
  const hostsList = Array.isArray(event.hosts) 
    ? event.hosts 
    : typeof event.hosts === 'string' 
      ? event.hosts.split(',').map((h: string) => h.trim())
      : [
          `${event.leadCoordinator || 'Bob Smith'} (Lead Coordinator)`,
          'Dr. Aris Thorne (Faculty Advisor)',
          'Maya Lin (Student Host)'
        ];

  const handleToggleCheckIn = (idx: number) => {
    const updated = [...delegates];
    updated[idx].checkedIn = !updated[idx].checkedIn;
    setDelegates(updated);
    updateEventDelegates(event.id, updated);
    showToast(
      updated[idx].checkedIn 
        ? `Checked in ${updated[idx].name} at venue portal!` 
        : `Check-in revoked for ${updated[idx].name}`,
      updated[idx].checkedIn ? 'success' : 'info'
    );
  };

  const handleAddDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegate.name.trim() || !newDelegate.reg.trim()) {
      showToast('Please enter delegate name and registration ID', 'error');
      return;
    }

    const updated = [
      ...delegates,
      { ...newDelegate, checkedIn: false }
    ];
    setDelegates(updated);
    updateEventDelegates(event.id, updated);
    showToast(`Delegate ${newDelegate.name} enrolled into fixture!`, 'success');
    setActiveModal(null);
    setNewDelegate({ name: '', reg: '', email: '', status: 'Confirmed' });
  };

  const handleAddAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgenda.title.trim()) return;

    const updatedAgenda = [...(event.agenda || []), newAgenda];
    const custom = getCustomizedEvents();
    custom[event.id] = {
      ...(custom[event.id] || {}),
      agenda: updatedAgenda
    };
    saveCustomizedEvents(custom);
    setEvent({ ...event, agenda: updatedAgenda });

    showToast(`Added agenda milestone: "${newAgenda.title}"`, 'success');
    setActiveModal(null);
    setNewAgenda({ time: '04:00 PM', title: '' });
  };

  const filteredDelegates = delegates.filter(d => 
    d.name.toLowerCase().includes(searchDelegate.toLowerCase()) ||
    d.reg.toLowerCase().includes(searchDelegate.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(searchDelegate.toLowerCase())
  );

  const checkedInCount = delegates.filter(d => d.checkedIn).length;

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/club/events')}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Manage Events</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            className="btn btn-secondary btn-sm font-bold shadow-sm shadow-emerald-600/20"
            onClick={() => navigate(`/club/registrations?eventId=${event.id}`)}
          >
            <UsersIcon className="w-4 h-4" />
            <span>Manage Registrations ({delegates.length})</span>
          </button>

          {isPastOrCompleted && (
            <button 
              className="btn btn-outline btn-sm text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-bold"
              onClick={() => navigate(`/club/reviews?eventId=${event.id}`)}
            >
              <ReviewsIcon className="w-4 h-4 text-tertiary" />
              <span>Post-Event Reviews</span>
            </button>
          )}

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/club/calendar')}
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Overview Banner */}
      <div className="event-overview-hero">
        <div className="flex justify-between items-start gap-6 flex-wrap">
          <div className="flex items-start gap-4">
            <div className={`event-date-tile mt-1 ${event.status === 'Ongoing' ? 'ongoing' : isPastOrCompleted ? 'past' : ''}`}>
              <span className="event-date-month">{event.month || 'OCT'}</span>
              <span className="event-date-day">{event.day || '15'}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge badge-primary text-[10px] font-extrabold">{event.academicYear || 'AY 2026 - 2027'}</span>
                <span className="badge badge-blue text-[10px] font-extrabold">{event.session || 'Afternoon Session'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-main tracking-tight">{event.title}</h1>
              <p className="text-xs text-muted flex items-center gap-2 mt-1.5 flex-wrap">
                <span>Organized by <strong>{event.club || 'Robotics Society'}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-secondary font-bold">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {event.venue} ({venueMeta.capacity} Seats)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-main">
                  <ClockIcon className="w-3.5 h-3.5 text-primary" />
                  {event.timeSlot || '10:00 AM - 04:00 PM'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`badge text-xs font-black ${
              event.status === 'Ongoing' ? 'badge-success' :
              event.status === 'Approved' || event.approvalStatus === 'Approved' ? 'badge-blue' :
              event.status === 'Cancelled' ? 'badge-danger' : 
              isPastOrCompleted ? 'badge-blue' : 'badge-warning'
            }`}>
              {event.status === 'Ongoing' ? 'Live Ongoing Event' : isPastOrCompleted ? 'Completed Fixture' : event.approvalStatus || event.status || 'Under Review'}
            </span>
            <span className="text-[11px] text-muted font-bold">
              Lead Coordinator: {event.leadCoordinator || 'Bob Smith'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Banner for Past / Completed Events */}
      {isPastOrCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
              <StarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-warning text-[10px] font-extrabold uppercase tracking-wider">Completed Event</span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Feedback Hub Live</span>
              </div>
              <h3 className="text-base font-black text-amber-950 dark:text-amber-100">
                Post-Event Reviews & Delegate Ratings Available
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-amber-300/90 leading-relaxed mt-0.5">
                Inspect attendee reviews submitted from the student feedback hub, institutional administration remarks, and post official organizer replies.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-tertiary btn-sm font-bold shrink-0 shadow-md shadow-amber-600/20"
            onClick={() => navigate(`/club/reviews?eventId=${event.id}`)}
          >
            <ReviewsIcon className="w-4 h-4" />
            <span>Open Post-Event Reviews →</span>
          </button>
        </div>
      )}

      {/* 4. SECTION I: Event Details Card */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-primary flex items-center justify-center font-bold">
              I
            </div>
            <div>
              <h3 className="text-base font-black text-main">Event Scope & Details</h3>
              <p className="text-xs text-muted">Core fixture parameters, venue logistics, hosts, and schedule</p>
            </div>
          </div>
          <span className="badge badge-blue">Official Record</span>
        </div>

        <div className="flex flex-col gap-6">
          {/* About & Objectives */}
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
              Event About & Objectives
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {event.about || event.description || 'Comprehensive details about event objectives, competition tracks, and delegate deliverables.'}
            </p>
          </div>

          {/* Key Parameters Specification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Academic Year & Session</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-main">{event.academicYear || 'AY 2026 - 2027'}</span>
                <span className="text-muted">•</span>
                <span className="text-primary font-semibold">{event.session || 'Afternoon'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Allocated Venue</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPinIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="font-bold text-main">{event.venue}</span>
                <span className="text-muted text-[11px]">({venueMeta.capacity} Seats)</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Date & Timing</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-bold text-main">{event.date || 'Oct 20, 2026'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted mt-0.5 text-[11px]">
                <ClockIcon className="w-3 h-3 text-secondary" />
                <span>{event.timeSlot || '10:00 AM - 04:00 PM'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Lead Coordinator</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-bold text-main">{event.leadCoordinator || 'Bob Smith'}</span>
              </div>
            </div>
          </div>

          {/* Hosts & Faculty Advisors */}
          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2.5">
              Event Hosts & Faculty Oversight
            </span>
            <div className="flex flex-wrap gap-2">
              {hostsList.map((host: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 border border-gray-200/80 dark:border-neutral-700 text-xs font-semibold text-main flex items-center gap-1.5">
                  <ShieldIcon className="w-3.5 h-3.5 text-primary" />
                  {host}
                </span>
              ))}
            </div>
          </div>

          {/* Event Agenda & Milestones */}
          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase font-bold text-gray-400">Event Agenda & Milestone Schedule</span>
              <button 
                type="button" 
                className="btn btn-outline btn-xs"
                onClick={() => setActiveModal('addAgenda')}
              >
                <PlusIcon className="w-3 h-3" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {(event.agenda || [
                { time: '10:00 AM', title: 'Delegate Registration & Kit Collection' },
                { time: '11:30 AM', title: 'Inaugural Keynote & Competition Briefing' },
                { time: '02:00 PM', title: 'Preliminary Round Obstacle Heats' },
                { time: '04:30 PM', title: 'Grand Championship Finals & Trophy Ceremony' }
              ]).map((ag: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800/80 text-xs">
                  <span className="font-mono font-bold text-primary min-w-[75px]">
                    {ag.time}
                  </span>
                  <div className="h-3 w-[1px] bg-gray-200 dark:bg-neutral-700" />
                  <span className="font-medium text-main flex-1">{ag.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. SECTION II: Event Budget Card */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-secondary flex items-center justify-center font-bold">
              II
            </div>
            <div>
              <h3 className="text-base font-black text-main">Event Budget & Financial Allocation</h3>
              <p className="text-xs text-muted">Itemized financial allocation across standard budget heads and custom expenses</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Budget</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Itemized Budget Table */}
        <div className="table-container">
          <table className="saas-table text-xs">
            <thead>
              <tr>
                <th>Expense Head / Category</th>
                <th style={{ textAlign: 'center' }}>Share of Budget</th>
                <th style={{ textAlign: 'right' }}>Allocated Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-main">1. Prize Amount</td>
                <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                  {Math.round((prizeMoney / (totalBudget || 1)) * 100)}%
                </td>
                <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                  ${prizeMoney.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="font-bold text-main">2. Refreshments & Catering</td>
                <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                  {Math.round((refreshments / (totalBudget || 1)) * 100)}%
                </td>
                <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                  ${refreshments.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="font-bold text-main">3. Decors & Staging</td>
                <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                  {Math.round((decors / (totalBudget || 1)) * 100)}%
                </td>
                <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                  ${decors.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="font-bold text-main">4. Misc Purchase & Supplies</td>
                <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                  {Math.round((miscPurchases / (totalBudget || 1)) * 100)}%
                </td>
                <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                  ${miscPurchases.toLocaleString()}
                </td>
              </tr>
              {customItems.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="font-bold text-main">
                    5.{idx + 1} {item.name || `Custom Item #${idx + 1}`}
                  </td>
                  <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                    {Math.round(((Number(item.amount) || 0) / (totalBudget || 1)) * 100)}%
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${(Number(item.amount) || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/40 font-bold">
                <td className="text-main font-black">Total Grant / Proposed Allocation</td>
                <td style={{ textAlign: 'center' }} className="text-main font-black">100%</td>
                <td style={{ textAlign: 'right' }} className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  ${totalBudget.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 6. SECTION III: Registration Form Configuration Card */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-primary flex items-center justify-center font-bold">
              III
            </div>
            <div>
              <h3 className="text-base font-black text-main">Registration Form Details & Criteria</h3>
              <p className="text-xs text-muted">Configured form questions, student accreditation fields, and delegate criteria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${hasRegForm ? 'badge-success' : 'badge-neutral'}`}>
              {hasRegForm ? 'Custom Form Active' : 'Standard Student Pass'}
            </span>
            <button 
              className="btn btn-outline btn-xs font-bold text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              onClick={() => navigate(`/club/forms?eventId=${event.id}`)}
              title="Open full form designer workspace"
            >
              <EditIcon className="w-3 h-3 text-purple-600" />
              <span>Form Builder →</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Form Header Info */}
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Form Title & Instructions</span>
            <h4 className="font-extrabold text-sm text-main">{regFormConfig.formTitle || `${event.title} Registration Form`}</h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">{regFormConfig.instructions || 'Standard registration guidelines apply.'}</p>
          </div>

          {/* Participant Option Attributes as Clean Inline Badges */}
          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-3 flex-wrap text-xs">
            <span className="text-muted font-semibold">Standard Fields:</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              regFormConfig.collectTeamInfo 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-neutral-100 text-muted dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
            }`}>
              Team Info: {regFormConfig.collectTeamInfo ? 'Enabled' : 'Disabled'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              regFormConfig.collectDietary 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-neutral-100 text-muted dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
            }`}>
              Dietary Preferences: {regFormConfig.collectDietary ? 'Enabled' : 'Disabled'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              regFormConfig.collectTshirt 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-neutral-100 text-muted dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
            }`}>
              T-Shirt Size: {regFormConfig.collectTshirt ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {/* Custom Questions List */}
          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800">
            <span className="text-xs font-black text-main block mb-3">Custom Form Questions ({regFormConfig.customQuestions?.length || 0})</span>
            <div className="flex flex-col gap-2.5">
              {(regFormConfig.customQuestions || []).map((q: any, idx: number) => (
                <div key={idx} className="py-2.5 px-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800/80 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-main">{idx + 1}. {q.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-neutral text-[10px] uppercase font-bold">{q.type}</span>
                      <span className={`badge text-[10px] ${q.required ? 'badge-danger' : 'badge-neutral'}`}>
                        {q.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>

                  {q.type === 'select' && q.options && (
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {q.options.map((opt: string, oIdx: number) => (
                        <span key={oIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-[11px] text-muted">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. SECTION IV: Delegate Roster & Live Gate Pass Manager */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800 flex-wrap gap-3">
          <div>
            <h3 className="text-base font-black text-main">Delegate Roster & Live Gate Pass Manager</h3>
            <p className="text-xs text-muted">Supervise enrolled students, gate ticket codes, and attendance verification</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="btn btn-secondary btn-xs font-bold shadow-sm shadow-emerald-600/10"
              onClick={() => navigate(`/club/registrations?eventId=${event.id}`)}
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span>Open Full Registration Manager</span>
            </button>
            <button 
              className="btn btn-primary btn-xs"
              onClick={() => setActiveModal('addDelegate')}
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Delegate</span>
            </button>
          </div>
        </div>

        {/* Delegate Search Filter */}
        <div className="search-input-wrapper mb-4">
          <input 
            type="text" 
            placeholder="Search registered delegates by student name, roll ID, or email..." 
            value={searchDelegate}
            onChange={(e) => setSearchDelegate(e.target.value)}
          />
        </div>

        {/* Delegates Table */}
        <div className="table-container">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Student Delegate</th>
                <th>Registration ID</th>
                <th>Email Address</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Gate Check-In</th>
              </tr>
            </thead>
            <tbody>
              {filteredDelegates.map((del, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800 }}>{del.name}</td>
                  <td className="text-muted font-mono text-xs">{del.reg}</td>
                  <td className="text-muted text-xs">{del.email || 'student@university.edu'}</td>
                  <td>
                    <span className={`badge text-[10px] ${
                      del.status === 'Confirmed' || del.status === 'Attending' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {del.status || 'Confirmed'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className={`btn btn-xs ${
                        del.checkedIn ? 'btn-secondary font-bold' : 'btn-outline'
                      }`}
                      onClick={() => handleToggleCheckIn(idx)}
                    >
                      {del.checkedIn ? (
                        <>
                          <CheckIcon className="w-3 h-3 text-white" />
                          <span>Present</span>
                        </>
                      ) : (
                        <span>Check In</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDelegates.length === 0 && (
          <div className="py-8 text-center text-muted text-xs">
            No delegates match your search query.
          </div>
        )}
      </div>

      {/* MODAL: Add Delegate */}
      <Modal
        isOpen={activeModal === 'addDelegate'}
        onClose={() => setActiveModal(null)}
        title="Enroll New Student Delegate"
        subtitle={`Manually register student into ${event.title}`}
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddDelegate}>Enroll Student</button>
          </>
        }
      >
        <form onSubmit={handleAddDelegate} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Student Full Name *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Jordan Hayes"
              value={newDelegate.name}
              onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Registration / Roll ID *</label>
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
              <label className="form-label">University Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="student@university.edu"
                value={newDelegate.email}
                onChange={(e) => setNewDelegate({ ...newDelegate, email: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL: Add Agenda Item */}
      <Modal
        isOpen={activeModal === 'addAgenda'}
        onClose={() => setActiveModal(null)}
        title="Add Agenda Milestone"
        subtitle="Schedule timing milestones for the event agenda"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddAgendaItem}>Add Milestone</button>
          </>
        }
      >
        <form onSubmit={handleAddAgendaItem} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Time Window</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 03:30 PM"
              value={newAgenda.time}
              onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Milestone / Session Description</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Quarterfinals & Sudden Death Tiebreaker"
              value={newAgenda.title}
              onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
              required 
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
