import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XMarkIcon, EyeIcon } from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { getStoredApprovals, approveProposal, rejectProposal } from '../../data/eventsData';

export default function EventApprovals() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [pendingEvents, setPendingEvents] = useState([]);

  useEffect(() => {
    setPendingEvents(getStoredApprovals());
  }, []);

  const handleApprove = (id, title) => {
    const updated = approveProposal(id);
    setPendingEvents(updated);
    showToast(`Approved event proposal: "${title}"!`, 'success');
  };

  const handleRejectConfirm = () => {
    if (!selectedEvent) return;
    const updated = rejectProposal(selectedEvent.id, rejectionReason);
    setPendingEvents(updated);
    showToast(`Rejected proposal "${selectedEvent.title}" with reason recorded.`, 'error');
    setIsRejectModalOpen(false);
    setRejectionReason('');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Event Proposals & Approvals</h1>
          <p className="page-description">Review student club agendas, evaluate requested financial grants, and grant scheduling permits.</p>
        </div>
        <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
          {pendingEvents.length} Proposals Awaiting Decision
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {pendingEvents.map(event => (
          <div key={event.id} className="card hover:shadow-md transition-all p-6">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{event.title}</h3>
                  <span className="badge badge-warning">{event.status || 'Pending Review'}</span>
                </div>
                <p className="text-muted text-xs">
                  Organized by <strong className="text-main">{event.club}</strong> • Submission date: {event.date}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* View Proposal Button Navigates to Common Event Details Page */}
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/admin/events/${event.id}?source=approvals`)}
                >
                  <EyeIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Proposal</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleApprove(event.id, event.title)}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>Approve & Grant</span>
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsRejectModalOpen(true);
                  }}
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{event.description}</p>

            <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-gray-100 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-1.5 text-muted">
                <span className="font-semibold text-gray-400">Venue:</span>
                <strong className="text-main">{event.venue}</strong>
              </div>
              <span className="text-gray-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1.5 text-muted">
                <span className="font-semibold text-gray-400">Grant Requested:</span>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{event.budget}</span>
              </div>
              <span className="text-gray-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1.5 text-muted">
                <span className="font-semibold text-gray-400">Capacity:</span>
                <strong className="text-main">{event.attendees} Students</strong>
              </div>
            </div>
          </div>
        ))}

        {pendingEvents.length === 0 && (
          <div className="card text-center py-16">
            <div className="metric-icon-box green mx-auto mb-4" style={{ margin: '0 auto 16px' }}>
              <CheckIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Queue Completely Clear!</h3>
            <p className="text-muted text-sm">All student club proposals for this term have been reviewed and dispatched.</p>
          </div>
        )}
      </div>

      {/* MODAL: Reject Reason (Only kept for inline quick rejection) */}
      {selectedEvent && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title="Provide Rejection Rationale"
          subtitle={`Proposal: ${selectedEvent.title}`}
          size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleRejectConfirm}>Confirm Rejection</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Feedback for Club Lead</label>
            <textarea 
              className="form-textarea" 
              rows={3} 
              placeholder="e.g. Budget exceeds departmental cap or date conflicts with semester exams..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
          </div>
        </Modal>
      )}
    </div>
  );
}
