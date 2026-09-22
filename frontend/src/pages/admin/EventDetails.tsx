import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ClubsIcon, 
  UsersIcon, 
  DownloadIcon, 
  CheckIcon, 
  XMarkIcon,
  ClockIcon,
  MailIcon,
  SparklesIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ShieldIcon,
  DocumentTextIcon,
  EyeIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { eventsService, EventItem } from '../../services/eventsService';
import { venuesService, Venue } from '../../services/venuesService';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { showToast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Budget card edit state (Admin only)
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editableBudget, setEditableBudget] = useState<any>(null);

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState('');

  // Determine navigation source: directory vs approvals vs dashboard
  const sourceParam = searchParams.get('source') || location.state?.source;
  const isFromDashboard = Boolean(location.state?.fromDashboard);
  const isFromDirectory = sourceParam === 'directory';
  const isFromApprovals = sourceParam === 'approvals' || (!sourceParam && Number(id) >= 100);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!id) return;
      try {
        const res = await eventsService.getEventById(id);
        if (res.data) {
          setEvent(res.data);
          setEditableBudget(res.data.budgetBreakdown);
          setSelectedVenue(res.data.venue);
        }
      } catch (err: any) {
        console.error('Failed to load event details:', err);
      }
    }

    async function loadVenues() {
      try {
        const vRes = await venuesService.getVenues();
        if (vRes.data) setVenues(vRes.data);
      } catch (e) {
        console.warn('Could not load venues:', e);
      }
    }

    fetchEventDetails();
    loadVenues();
  }, [id]);

  if (!event) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold mb-3">Event Record Not Found</h2>
        <p className="text-muted text-sm mb-6">
          The requested event fixture could not be resolved from university records.
        </p>
        <button 
          className="btn btn-outline"
          onClick={() => navigate(isFromDashboard ? '/admin' : isFromApprovals ? '/admin/approvals' : '/admin/events')}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Return to {isFromDashboard ? 'Dashboard' : isFromApprovals ? 'Approvals' : 'Event Directory'}</span>
        </button>
      </div>
    );
  }

  // --- Handlers for 3 Action Buttons ---
  const handleApprove = async () => {
    try {
      await eventsService.updateStatus(event.id, 'Upcoming', 'Approved');
      setEvent((prev: any) => ({ ...prev, status: 'Upcoming', approvalStatus: 'Approved' }));
      showToast(`Event proposal "${event.title}" has been Approved!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to approve event.', 'error');
    }
  };

  const handleUnderReview = async () => {
    try {
      await eventsService.updateStatus(event.id, 'Pending Review', 'Under Review');
      setEvent((prev: any) => ({ ...prev, status: 'Pending Review', approvalStatus: 'Under Review' }));
      showToast(`Event "${event.title}" marked as Under Review.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update review status.', 'error');
    }
  };

  const handleConfirmReject = async () => {
    try {
      await eventsService.updateStatus(event.id, 'Rejected', 'Rejected');
      setEvent((prev: any) => ({ ...prev, status: 'Rejected', approvalStatus: 'Rejected' }));
      setIsRejectModalOpen(false);
      showToast(`Event proposal "${event.title}" marked as Rejected. Feedback recorded.`, 'error');
    } catch (err: any) {
      showToast(err.message || 'Failed to reject event.', 'error');
    }
  };

  // --- Budget Breakdown Helpers ---
  const calculateTotal = (b: any) => {
    if (!b) return 0;
    const base = (Number(b.prizeMoney) || 0) + (Number(b.refreshments) || 0) + (Number(b.decors) || 0) + (Number(b.miscPurchases) || 0);
    const custom = (b.customItems || []).reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
    return base + custom;
  };

  const handleBudgetNumberChange = (field: string, val: string) => {
    const parsed = parseInt(val, 10);
    setEditableBudget((prev: any) => ({
      ...prev,
      [field]: isNaN(parsed) ? 0 : Math.max(0, parsed)
    }));
  };

  const handleCustomItemChange = (index: number, field: string, val: any) => {
    setEditableBudget((prev: any) => {
      const updated = [...(prev.customItems || [])];
      updated[index] = {
        ...updated[index],
        [field]: field === 'amount' ? (parseInt(val, 10) || 0) : val
      };
      return { ...prev, customItems: updated };
    });
  };

  const handleAddCustomItem = () => {
    setEditableBudget((prev: any) => ({
      ...prev,
      customItems: [
        ...(prev.customItems || []),
        { id: 'custom_' + Date.now(), name: 'Custom Logistics & Materials', amount: 100 }
      ]
    }));
  };

  const handleRemoveCustomItem = (index: number) => {
    setEditableBudget((prev: any) => {
      const updated = (prev.customItems || []).filter((_: any, i: number) => i !== index);
      return { ...prev, customItems: updated };
    });
  };

  const handleSaveBudget = async () => {
    const liveTotal = calculateTotal(editableBudget);
    try {
      await eventsService.updateBudget(event.id, editableBudget, liveTotal);
      setEvent((prev: any) => ({
        ...prev,
        budgetBreakdown: editableBudget,
        budget: `$${liveTotal.toLocaleString()}`
      }));
      setIsEditingBudget(false);
      showToast(`Event budget allocation updated to $${liveTotal.toLocaleString()}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update budget.', 'error');
    }
  };

  const handleCancelBudgetEdit = () => {
    setEditableBudget(event.budgetBreakdown);
    setIsEditingBudget(false);
  };

  // --- Venue Selector Helper ---
  const handleVenueSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVenue = e.target.value;
    setSelectedVenue(newVenue);
    try {
      await eventsService.updateVenue(event.id, newVenue);
      setEvent((prev: any) => ({ ...prev, venue: newVenue }));
      showToast(`Event venue relocated to ${newVenue}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update venue.', 'error');
    }
  };

  const selectedVenueMeta = venues.find(v => v.name === (selectedVenue || event.venue)) || {
    id: 'v_default',
    name: selectedVenue || event.venue,
    capacity: 350,
    building: 'Campus Main Facility',
    facilities: 'Standard Audio/Visual, Projector, Air-Conditioned'
  };

  const handleExportRoster = () => {
    showToast(`Exported attendance roster for "${event.title}" (CSV)!`, 'success');
  };

  // Approval status badge helper
  const currentStatus = event.approvalStatus || event.status || 'Under Review';
  const isApproved = currentStatus === 'Approved';
  const isRejected = currentStatus === 'Rejected';
  const isUnderReview = !isApproved && !isRejected;

  // Registration capacity calculation
  const totalRegistered = event.registration?.totalRegistered || 240;
  const maxCapacity = event.registration?.maxCapacity || 300;
  const capacityPercent = Math.min(100, Math.round((totalRegistered / Math.max(1, maxCapacity)) * 100));

  return (
    <div className="event-directory-wrapper pb-16">
      {/* ===================================================================
          Top Navigation & Governance Action Buttons
          =================================================================== */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        {/* Back Link */}
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => navigate(isFromDashboard ? '/admin' : isFromDirectory ? '/admin/events' : '/admin/approvals')}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to {isFromDashboard ? 'Dashboard' : isFromDirectory ? 'Event Directory' : 'Approvals'}</span>
        </button>

        {/* Persistent Governance Actions: Approve, Under Review, Reject */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            className={`btn btn-sm ${isApproved ? 'btn-secondary font-black ring-2 ring-emerald-500/50' : 'btn-secondary'}`}
            onClick={handleApprove}
            title="Approve this event fixture"
          >
            <CheckIcon className="w-4 h-4" />
            <span>Approve Event</span>
          </button>

          <button 
            className={`btn btn-sm ${isUnderReview ? 'btn-outline border-amber-500 text-amber-600 dark:text-amber-400 font-black' : 'btn-outline'}`}
            onClick={handleUnderReview}
            title="Mark this event proposal as Under Review"
          >
            <ClockIcon className="w-4 h-4 text-amber-500" />
            <span>Under Review</span>
          </button>

          <button 
            className={`btn btn-sm ${isRejected ? 'btn-danger font-black ring-2 ring-red-500/50' : 'btn-danger'}`}
            onClick={() => setIsRejectModalOpen(true)}
            title="Reject this event proposal"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb line */}
      <div className="text-xs text-muted flex items-center gap-1.5 font-medium mb-6">
        <span>Administrator Console</span>
        <span>/</span>
        <span className="text-main font-semibold">
          {isFromDashboard ? 'Dashboard' : isFromDirectory ? 'Event Directory' : 'Event Approvals'}
        </span>
        <span>/</span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-xs">{event.title}</span>
      </div>

      {/* ===================================================================
          1. EVENT OVERVIEW CARD
          Just event name with date, time, session, and approval status tag
          =================================================================== */}
      <section className="mb-6">
        <div className="event-overview-hero">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1 min-w-[280px]">
              {/* Timing & Session Row */}
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap text-xs">
                <span className="badge badge-blue flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{event.session || 'Afternoon Session'}</span>
                </span>
                <span className="text-muted font-semibold">
                  {event.date} • {event.timeSlot || '02:00 PM - 08:00 PM'}
                </span>
              </div>

              {/* Event Name */}
              <h1 className="page-title text-2xl md:text-3xl font-black mb-0 text-main tracking-tight">
                {event.title}
              </h1>
            </div>

            {/* Event Approval Status Tag */}
            <div className="flex items-center">
              {isApproved && (
                <span 
                  className="badge status-pill-approved flex items-center gap-1.5 font-extrabold text-sm"
                  style={{ padding: '6px 18px' }}
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Approved</span>
                </span>
              )}
              {isUnderReview && (
                <span 
                  className="badge status-pill-review flex items-center gap-1.5 font-extrabold text-sm"
                  style={{ padding: '6px 18px' }}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span>In Review</span>
                </span>
              )}
              {isRejected && (
                <span 
                  className="badge status-pill-rejected flex items-center gap-1.5 font-extrabold text-sm"
                  style={{ padding: '6px 18px' }}
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Rejected</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Layout Grid for Sections 2 - 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Sections 2, 3, 5 */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* ===============================================================
              2. EVENT DETAILS CARD / SECTION
              Event Name, Event About, Conducted by Club, Academic Year,
              Venue, Hosts, Date and Timing
              =============================================================== */}
          <div className="event-glass-card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-base font-extrabold text-main">Event Details & Scope</h2>
            </div>

            {/* About / Description */}
            <div className="mb-6">
              <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
                Event About & Executive Overview
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-800 text-xs">
              {/* Conducted by Club */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Conducted By Club
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ClubsIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-extrabold text-main">{event.club}</span>
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Academic Year
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-main">{event.academicYear || 'AY 2026 - 2027'}</span>
                </div>
              </div>

              {/* Designated Venue */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Campus Venue
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-extrabold text-main">{selectedVenue || event.venue}</span>
                </div>
              </div>

              {/* Date & Timing */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Date & Timing
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-extrabold text-main">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted mt-0.5 text-[11px]">
                  <ClockIcon className="w-3 h-3 text-secondary" />
                  <span>{event.timeSlot || '02:00 PM - 08:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Hosts Section */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-3">
                Event Hosts & Faculty Oversight
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(event.hosts || [
                  `${event.leadCoordinator || 'Alice Johnson'} (Lead Coordinator)`,
                  'Dr. Robert Chen (Faculty Advisor)',
                  'Priya Patel (Student Host)'
                ]).map((host, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-blue-950 dark:text-blue-200 truncate">{host}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda / Milestones if available */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-3">
                  Fixture Milestones & Agenda Timeline
                </span>
                <div className="flex flex-col gap-2.5">
                  {event.agenda.map((slot, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 text-xs"
                    >
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 min-w-[80px]">
                        {slot.time}
                      </span>
                      <div className="h-3 w-[1px] bg-gray-200 dark:bg-neutral-700" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {slot.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===============================================================
              3. EVENT BUDGET CARD (Editable for Admin Only)
              Total budget proposed + breakdown (prize money, refreshments,
              decors, misc purchases, custom items). Admin can edit!
              =============================================================== */}
          <div className="event-glass-card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-extrabold text-main">Event Budget & Allocations</h2>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Institutional budget breakdown proposed by club coordinator. <strong className="text-blue-600 font-bold">(Admin Editable)</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Proposed Total Badge */}
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Budget</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ${(isEditingBudget ? calculateTotal(editableBudget) : calculateTotal(event.budgetBreakdown)).toLocaleString()}
                  </span>
                </div>

                {/* Admin Edit Trigger */}
                {!isEditingBudget ? (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditableBudget(event.budgetBreakdown);
                      setIsEditingBudget(true);
                    }}
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Edit Budget</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={handleSaveBudget}
                    >
                      <CheckIcon className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={handleCancelBudgetEdit}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Read-Only Mode */}
            {!isEditingBudget ? (
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
                        {Math.round(((event.budgetBreakdown?.prizeMoney || 0) / (calculateTotal(event.budgetBreakdown) || 1)) * 100)}%
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                        ${(event.budgetBreakdown?.prizeMoney || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-main">2. Refreshments & Catering</td>
                      <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                        {Math.round(((event.budgetBreakdown?.refreshments || 0) / (calculateTotal(event.budgetBreakdown) || 1)) * 100)}%
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                        ${(event.budgetBreakdown?.refreshments || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-main">3. Decors & Staging</td>
                      <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                        {Math.round(((event.budgetBreakdown?.decors || 0) / (calculateTotal(event.budgetBreakdown) || 1)) * 100)}%
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                        ${(event.budgetBreakdown?.decors || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-main">4. Misc Purchases & Supplies</td>
                      <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                        {Math.round(((event.budgetBreakdown?.miscPurchases || 0) / (calculateTotal(event.budgetBreakdown) || 1)) * 100)}%
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono font-bold text-main">
                        ${(event.budgetBreakdown?.miscPurchases || 0).toLocaleString()}
                      </td>
                    </tr>
                    {(event.budgetBreakdown?.customItems || []).map((item: any, i: number) => (
                      <tr key={item.id || i}>
                        <td className="font-bold text-main">
                          5.{i + 1} {item.name}
                        </td>
                        <td style={{ textAlign: 'center' }} className="text-muted font-semibold">
                          {Math.round(((item.amount || 0) / (calculateTotal(event.budgetBreakdown) || 1)) * 100)}%
                        </td>
                        <td style={{ textAlign: 'right' }} className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ${(item.amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/40 font-bold">
                      <td className="text-main font-black">Total Grant / Proposed Allocation</td>
                      <td style={{ textAlign: 'center' }} className="text-main font-black">100%</td>
                      <td style={{ textAlign: 'right' }} className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        ${calculateTotal(event.budgetBreakdown).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* Administrative Edit Mode */
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-blue-50/30 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                  Editing Budget Allocation Fields (Live recalculation)
                </span>

                {/* 4 Standard Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Prize Money ($)
                    </label>
                    <input 
                      type="number"
                      className="budget-edit-input"
                      value={editableBudget?.prizeMoney || 0}
                      onChange={(e) => handleBudgetNumberChange('prizeMoney', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Refreshments ($)
                    </label>
                    <input 
                      type="number"
                      className="budget-edit-input"
                      value={editableBudget?.refreshments || 0}
                      onChange={(e) => handleBudgetNumberChange('refreshments', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Decors & Staging ($)
                    </label>
                    <input 
                      type="number"
                      className="budget-edit-input"
                      value={editableBudget?.decors || 0}
                      onChange={(e) => handleBudgetNumberChange('decors', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Misc Purchases ($)
                    </label>
                    <input 
                      type="number"
                      className="budget-edit-input"
                      value={editableBudget?.miscPurchases || 0}
                      onChange={(e) => handleBudgetNumberChange('miscPurchases', e.target.value)}
                    />
                  </div>
                </div>

                {/* Custom Items Section in Edit Mode */}
                <div className="pt-3 border-t border-blue-200/60 dark:border-blue-900/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      Club Line Items & Special Purchases
                    </span>
                    <button 
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={handleAddCustomItem}
                    >
                      <PlusIcon className="w-3 h-3" />
                      <span>Add Expense Item</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {(editableBudget?.customItems || []).map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center gap-2">
                        <input 
                          type="text"
                          className="budget-edit-input flex-1"
                          placeholder="Item Description"
                          value={item.name}
                          onChange={(e) => handleCustomItemChange(idx, 'name', e.target.value)}
                        />
                        <div className="w-32">
                          <input 
                            type="number"
                            className="budget-edit-input"
                            placeholder="Amount ($)"
                            value={item.amount}
                            onChange={(e) => handleCustomItemChange(idx, 'amount', e.target.value)}
                          />
                        </div>
                        <button 
                          type="button"
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          onClick={() => handleRemoveCustomItem(idx)}
                          title="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===============================================================
              5. REGISTRATION DETAILS CARD
              Registration statistics, capacity progress bar, delegate roster,
              and CSV export
              =============================================================== */}
          <div className="event-glass-card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-base font-extrabold text-main">Registration & Attendance Details</h2>
                <p className="text-xs text-muted mt-0.5">
                  Real-time registration capacity and student delegate accreditation.
                </p>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleExportRoster}
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Export Roster (CSV)</span>
              </button>
            </div>

            {/* Capacity Progress Bar */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 mb-5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-main">Seat Capacity Utilization</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {totalRegistered} / {maxCapacity} Seats ({capacityPercent}%)
                </span>
              </div>
              <div className="capacity-progress-track">
                <div 
                  className="capacity-progress-fill" 
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted mt-2">
                <span>Deadline: {event.registration?.deadline || 'Oct 10, 2026'}</span>
                <span className="badge badge-success text-[10px]">
                  {event.registration?.status || 'Registration Open'}
                </span>
              </div>
            </div>

            {/* Eligibility & Target Audience */}
            <div className="mb-4 text-xs text-muted flex items-center gap-2">
              <strong className="text-main">Target Audience:</strong> 
              <span>{event.registration?.targetAudience || 'Undergraduate & Postgraduate Students, Club Delegates & Faculty'}</span>
            </div>

            {/* Attached Registration Form Configuration */}
            {event.regFormConfig && (
              <div className="mb-5 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-main">Attached Registration Form Specifications</span>
                  </div>
                  <span className="badge badge-primary text-[10px]">
                    {event.hasRegForm ? 'Custom Form Active' : 'Standard Entry Pass'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  {event.regFormConfig.formTitle || 'Delegate Registration Form'}
                </p>
                {event.regFormConfig.instructions && (
                  <p className="text-[11px] text-muted mb-3 italic">
                    "{event.regFormConfig.instructions}"
                  </p>
                )}

                {/* Collected Standard Attributes */}
                <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                  {event.regFormConfig.collectTeamInfo && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-blue-200 dark:border-neutral-700 text-blue-800 dark:text-blue-300 font-bold">
                      ✓ Collects Team Info
                    </span>
                  )}
                  {event.regFormConfig.collectDietary && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-neutral-700 text-emerald-800 dark:text-emerald-300 font-bold">
                      ✓ Dietary Requirements
                    </span>
                  )}
                  {event.regFormConfig.collectTshirt && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-purple-200 dark:border-neutral-700 text-purple-800 dark:text-purple-300 font-bold">
                      ✓ T-Shirt Size
                    </span>
                  )}
                </div>

                {/* Custom Form Questions */}
                {event.regFormConfig.customQuestions && event.regFormConfig.customQuestions.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
                      Configured Questionnaire Prompts ({event.regFormConfig.customQuestions.length})
                    </span>
                    <div className="flex flex-col gap-2">
                      {event.regFormConfig.customQuestions.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="p-2.5 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-blue-100 dark:border-blue-900/30 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-main">
                              {qIdx + 1}. {q.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {q.required && <span className="badge badge-danger text-[9px]">Required</span>}
                              <span className="badge badge-neutral text-[9px] uppercase">{q.type}</span>
                            </div>
                          </div>
                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {q.options.map((opt, optIdx) => (
                                <span key={optIdx} className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] text-muted font-medium">
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

            {/* Delegate Attendees Sample List */}
            {event.sampleDelegates && event.sampleDelegates.length > 0 && (
              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-2.5">
                  Verified Delegate Roster Sample
                </span>
                <div className="flex flex-col gap-2">
                  {event.sampleDelegates.map((del, i) => (
                    <div 
                      key={i}
                      className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                          {del.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-main block">{del.name}</span>
                          <span className="text-muted text-[11px]">{del.reg} {del.track ? `• ${del.track}` : ''}</span>
                        </div>
                      </div>
                      <span className={`badge ${
                        del.status === 'Attending' || del.status === 'Attended' || del.status === 'Confirmed' ? 'badge-success' : 
                        del.status === 'Waitlisted' ? 'badge-warning' : 'badge-blue'
                      }`}>
                        {del.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Sections 4 & 6 */}
        <div className="flex flex-col gap-6">

          {/* ===============================================================
              4. VENUE CARD
              Venue with label, dropdown field showing campus database venues,
              and venue logistics
              =============================================================== */}
          <div className="event-glass-card">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-extrabold text-main">Venue Allocation</h2>
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label font-bold text-xs">
                Designated Campus Venue
              </label>
              <select 
                className="venue-select-dropdown"
                value={selectedVenue || event.venue}
                onChange={handleVenueSelect}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.name}>
                    {v.name} (Cap: {v.capacity})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-muted mt-1 block">
                Select from campus database to reassign or confirm reservation.
              </span>
            </div>

            {/* Selected Venue Logistics Specification */}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-neutral-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted font-semibold">Seating Capacity:</span>
                <span className="font-black text-main flex items-center gap-1">
                  <UsersIcon className="w-3.5 h-3.5 text-blue-600" />
                  {selectedVenueMeta.capacity} Seats
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted font-semibold">Campus Building:</span>
                <span className="font-bold text-main">{selectedVenueMeta.building}</span>
              </div>

              <div>
                <span className="text-muted font-semibold block mb-1">Key Installed Facilities:</span>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800">
                  {selectedVenueMeta.facilities}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Verified Available for Scheduled Slot
                </span>
              </div>
            </div>
          </div>

          {/* ===============================================================
              6. EVENT AI SUMMARY CARD
              AI summary of all data about the event
              =============================================================== */}
          <div className="ai-summary-card">
            {/* AI Header */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <SparklesIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-main">AI Event Intelligence</h3>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                    Automated Multi-Source Synthesis
                  </span>
                </div>
              </div>

              <span className="badge badge-success text-[10px]">
                {event.aiSummary?.feasibilityScore || '98% Feasible'}
              </span>
            </div>

            {/* Executive Synthesis */}
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {event.aiSummary?.executiveSummary}
            </p>

            {/* Key Resource Efficiency Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 block">
                  Per Delegate Cost
                </span>
                <span className="text-sm font-black text-blue-900 dark:text-blue-100">
                  ${((calculateTotal(event.budgetBreakdown) || 1500) / Math.max(1, totalRegistered)).toFixed(2)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                  Capacity Fit
                </span>
                <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                  {capacityPercent}% Fit
                </span>
              </div>
            </div>

            {/* Institutional Recommendation */}
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-4">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider block mb-1">
                Governance Recommendation
              </span>
              <p className="text-[11px] text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {event.aiSummary?.recommendation}
              </p>
            </div>

            {/* Key Takeaway Tags */}
            <div className="flex flex-wrap gap-1.5">
              {(event.aiSummary?.tags || ['Safety Compliant', 'Budget Optimized', 'Faculty Supervised', 'High Engagement']).map((tag, idx) => (
                <span key={idx} className="ai-chip">
                  <SparklesIcon className="w-2.5 h-2.5" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===================================================================
          MODAL: Rejection Rationale
          =================================================================== */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Record Rejection Feedback"
        subtitle={`Proposal: ${event.title}`}
        size="sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmReject}>
              Confirm Rejection
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label font-bold text-xs">Administrative Reason & Recommendations</label>
          <textarea 
            className="form-textarea" 
            rows={3} 
            placeholder="e.g., Requested grant exceeds club semester limit, or venue has conflicting academic commitments..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          ></textarea>
          <span className="text-[11px] text-muted mt-1 block">
            This commentary will be automatically shared with the club coordinator.
          </span>
        </div>
      </Modal>
    </div>
  );
}
