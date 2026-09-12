import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  UsersIcon, 
  NoticeIcon, 
  PlusIcon, 
  SparklesIcon, 
  ArrowRightIcon 
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function ClubDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null); // 'createEvent' | 'metricDetail'
  const [metricDetail, setMetricDetail] = useState(null);

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    venue: '',
    budget: '$500'
  });

  const handleMetricClick = (title, count, desc) => {
    setMetricDetail({ title, count, desc });
    setActiveModal('metricDetail');
  };

  const handleQuickCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name) return;
    showToast(`Event proposal "${newEvent.name}" submitted to University Admin for review!`, 'success');
    setActiveModal(null);
    setNewEvent({ name: '', date: '', venue: '', budget: '$500' });
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Robotics & Autonomous Systems Guild</h1>
          <p className="page-description">Club Lead Console • Authorized University Organization #24</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/club/post-notice')}
          >
            <NoticeIcon className="w-4 h-4 text-blue-600" />
            <span>Post Notice</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveModal('createEvent')}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Propose New Event</span>
          </button>
        </div>
      </div>
      
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 mb-8 gap-6">
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Total Events Hosted', '4', '4 scheduled university competitions and engineering workshops during this calendar term.')}
        >
          <div className="metric-icon-box blue">
            <CalendarIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Events</span>
            <span className="metric-value">4</span>
          </div>
          <div className="metric-card-blob bg-blue-600"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Active Event Participants', '128', '128 verified student registrations logged across all robotics fixtures and combat events.')}
        >
          <div className="metric-icon-box green">
            <UsersIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Participants</span>
            <span className="metric-value">128</span>
          </div>
          <div className="metric-card-blob bg-emerald-600"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Active Circulars', '1', '1 high-priority announcement currently active on student bulletin boards.')}
        >
          <div className="metric-icon-box yellow">
            <NoticeIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Notices</span>
            <span className="metric-value">1</span>
          </div>
          <div className="metric-card-blob bg-amber-500"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Active Club Fixtures */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold">Upcoming Club Fixtures</h3>
            <button onClick={() => navigate('/club/events')} className="btn btn-ghost btn-sm">Manage Events →</button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">Autonomous Drone Speed Trials</h4>
                <p className="text-xs text-muted">Nov 12 • Sports Complex Oval</p>
              </div>
              <span className="badge badge-warning">Awaiting Approval</span>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">Combat Bot Engineering Workshop</h4>
                <p className="text-xs text-muted">Sept 22 • Makerspace Lab 4</p>
              </div>
              <span className="badge badge-success">Approved</span>
            </div>
          </div>
        </div>

        {/* Member Engagement Highlights */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold">Club Standing & Grants</h3>
            <span className="badge badge-success">Good Standing</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
              <span className="text-[10px] font-bold uppercase text-blue-900 dark:text-blue-300">Allocated Term Grant</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-2xl font-black text-blue-900 dark:text-blue-200">$2,400.00</span>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">$650 Remaining</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold">Faculty Coordinator</p>
                <span className="text-xs text-muted">Dr. Aris Thorne (Robotics Dept)</span>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => showToast('Dispatched communication to Faculty Coordinator!')}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Propose Event */}
      <Modal
        isOpen={activeModal === 'createEvent'}
        onClose={() => setActiveModal(null)}
        title="Submit New Event Proposal"
        subtitle="Forwarded to University Admin for hall reservation & grant sign-off"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleQuickCreateEvent}>Send Proposal</button>
          </>
        }
      >
        <form onSubmit={handleQuickCreateEvent}>
          <div className="form-group">
            <label className="form-label">Proposed Event Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Quadcopter Aerial Racing Series"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Target Date</label>
              <input 
                type="date" 
                className="form-input"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Budget</label>
              <input 
                type="text" 
                className="form-input"
                value={newEvent.budget}
                onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Requested Campus Facility</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Indoor Gymnasium / Makerspace"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              required 
            />
          </div>
        </form>
      </Modal>

      {/* MODAL: Metric breakdown */}
      {metricDetail && (
        <Modal
          isOpen={activeModal === 'metricDetail'}
          onClose={() => setActiveModal(null)}
          title={metricDetail.title}
          subtitle="Club Operations Telemetry"
          size="sm"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close</button>
          }
        >
          <div className="text-center py-4">
            <div className="text-4xl font-black text-blue-600 mb-2">{metricDetail.count}</div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
              {metricDetail.desc}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
