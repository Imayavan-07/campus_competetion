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
  MailIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { getEventById, approveProposal, rejectProposal } from '../../data/eventsData';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Determine navigation source: directory vs approvals vs dashboard
  const sourceParam = searchParams.get('source') || location.state?.source;
  const isFromDashboard = Boolean(location.state?.fromDashboard);
  const isFromDirectory = sourceParam === 'directory';
  const isFromApprovals = sourceParam === 'approvals' || (!sourceParam && Number(id) >= 100);

  useEffect(() => {
    const found = getEventById(id);
    if (found) {
      setEvent(found);
    }
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

  // Derive the strict Past / Present / Future tag for directory view
  const getTimeframeTag = () => {
    if (event.timeframe) {
      return event.timeframe; // 'Past' | 'Present' | 'Future'
    }
    if (event.status === 'Ongoing') return 'Present';
    if (event.status === 'Past') return 'Past';
    return 'Future';
  };

  const timeframeTag = getTimeframeTag();

  const handleApprove = () => {
    approveProposal(event.id);
    showToast(`Approved event proposal: "${event.title}"!`, 'success');
    navigate(isFromDashboard ? '/admin' : '/admin/approvals');
  };

  const handleConfirmReject = () => {
    rejectProposal(event.id, rejectionReason);
    showToast(`Rejected proposal "${event.title}". Feedback sent to coordinator.`, 'error');
    setIsRejectModalOpen(false);
    navigate(isFromDashboard ? '/admin' : '/admin/approvals');
  };

  const handleExportRoster = () => {
    showToast(`Exported delegate attendance roster for "${event.title}" (CSV)!`, 'success');
  };

  return (
    <div className="event-directory-wrapper pb-12">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-2">
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => navigate(isFromDashboard ? '/admin' : isFromDirectory ? '/admin/events' : '/admin/approvals')}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to {isFromDashboard ? 'Dashboard' : isFromDirectory ? 'Event Directory' : 'Approvals'}</span>
        </button>

        <div className="text-xs text-muted flex items-center gap-1.5 font-medium">
          <span>Administrator Console</span>
          <span>/</span>
          <span className="text-main font-semibold">
            {isFromDashboard ? 'Dashboard' : isFromDirectory ? 'Event Directory' : 'Event Proposals & Approvals'}
          </span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{event.title}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="event-glass-card">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            {/* Tag Placement */}
            <div className="mb-3">
              {isFromDirectory ? (
                /* DIRECTORY SECTION REQUIREMENT: Show the past or present or future tag only */
                <div>
                  {timeframeTag === 'Present' && (
                    <span 
                      className="badge badge-success flex items-center gap-1.5 w-fit" 
                      style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                    >
                      <span className="event-live-dot" />
                      <span>Present</span>
                    </span>
                  )}
                  {timeframeTag === 'Future' && (
                    <span 
                      className="badge badge-blue w-fit" 
                      style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                    >
                      <span>Future</span>
                    </span>
                  )}
                  {timeframeTag === 'Past' && (
                    <span 
                      className="badge badge-warning w-fit" 
                      style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                    >
                      <span>Past</span>
                    </span>
                  )}
                </div>
              ) : (
                /* APPROVALS SECTION REQUIREMENT: Show approval status badge */
                <span 
                  className="badge badge-warning w-fit" 
                  style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                >
                  {event.status || 'Pending Review'}
                </span>
              )}
            </div>

            <h1 className="page-title text-2xl md:text-3xl mb-2">{event.title}</h1>
            
            <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
              <span className="flex items-center gap-1.5 font-semibold text-main">
                <ClubsIcon className="w-4 h-4 text-blue-600" />
                <span>{event.club}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span>{event.date}</span>
              </span>
              {event.timeSlot && (
                <>
                  <span>•</span>
                  <span>{event.timeSlot}</span>
                </>
              )}
            </div>
          </div>

          {/* Action triggers for Approvals mode only */}
          {!isFromDirectory && (
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                className="btn btn-secondary"
                onClick={handleApprove}
              >
                <CheckIcon className="w-4 h-4" />
                <span>Approve & Grant Permit</span>
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setIsRejectModalOpen(true)}
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Reject Proposal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Overview & Agenda */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Executive Overview */}
          <div className="event-glass-card">
            <h3 className="text-base font-bold mb-3 text-main">Event Scope & Executive Description</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description}
            </p>

            {/* Grant justification in approvals view */}
            {!isFromDirectory && event.justification && (
              <div className="mt-5 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                <span className="text-[11px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                  Grant Resource Justification
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                  {event.justification}
                </p>
              </div>
            )}
          </div>

          {/* Agenda & Run of Show */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="event-glass-card">
              <h3 className="text-base font-bold mb-4 text-main">Fixture Schedule & Milestones</h3>
              <div className="flex flex-col gap-3">
                {event.agenda.map((slot, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800"
                  >
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 min-w-[90px]">
                      {slot.time}
                    </span>
                    <div className="h-3 w-[1px] bg-gray-200 dark:bg-neutral-700" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {slot.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delegate Attendees Sample */}
          {event.sampleDelegates && event.sampleDelegates.length > 0 && (
            <div className="event-glass-card">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-main">Delegate Roster Sample</h3>
                  <p className="text-xs text-muted mt-0.5">
                    {event.attendees} Registered Attendees for this fixture
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

              <div className="flex flex-col gap-2">
                {event.sampleDelegates.map((del, i) => (
                  <div 
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-main">{del.name}</span>
                      <span className="text-muted ml-2">({del.reg})</span>
                    </div>
                    <span className={`badge ${
                      del.status === 'Attending' || del.status === 'Attended' ? 'badge-success' : 
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

        {/* Right 1 Column: Logistics & Metadata Vitals */}
        <div className="flex flex-col gap-6">
          {/* Key Vitals */}
          <div className="event-glass-card">
            <h3 className="text-base font-bold mb-4 text-main">Event Logistics & Vitals</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  Reserved Campus Venue
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPinIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-extrabold text-main">{event.venue}</span>
                </div>
              </div>

              <div className="event-card-divider" />

              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  Category Classification
                </span>
                <div className="mt-1">
                  <span className="event-category-tag">{event.category}</span>
                </div>
              </div>

              <div className="event-card-divider" />

              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  Expected Capacity
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <UsersIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-extrabold text-main">{event.attendees} Delegates</span>
                </div>
              </div>

              {!isFromDirectory && event.budget && (
                <>
                  <div className="event-card-divider" />
                  <div>
                    <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                      Requested Seed Grant
                    </span>
                    <div className="mt-1">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {event.budget}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Faculty & Coordinator Contact Card */}
          <div className="event-glass-card">
            <h3 className="text-base font-bold mb-3 text-main">Lead Coordinator</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                {event.leadCoordinator ? event.leadCoordinator.charAt(0) : 'C'}
              </div>
              <div>
                <p className="text-sm font-extrabold text-main">
                  {event.leadCoordinator || 'Appointed Club Lead'}
                </p>
                <p className="text-xs text-muted">{event.club}</p>
              </div>
            </div>

            {event.coordinatorEmail && (
              <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MailIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{event.coordinatorEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Rejection Rationale (For Approvals Mode) */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Record Rejection Rationale"
        subtitle={`Proposal: ${event.title}`}
        size="sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleConfirmReject}>Confirm Rejection</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Feedback for Club Executive</label>
          <textarea 
            className="form-textarea" 
            rows={3} 
            placeholder="e.g., Requested grant exceeds department semester budget or venue conflicts with scheduled exams..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          ></textarea>
        </div>
      </Modal>
    </div>
  );
}
