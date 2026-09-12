import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrophyIcon,
  CalendarIcon,
  SparklesIcon,
  PlusIcon,
  NoticeIcon,
  ArrowRightIcon,
  ClubsIcon,
  ApprovalsIcon,
  UsersIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'registerClub' | 'broadcast' | 'metricBreakdown'
  const [metricDetail, setMetricDetail] = useState(null);

  // Form states
  const [clubForm, setClubForm] = useState({ name: '', category: 'Technical', lead: '', email: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', audience: 'All Students', content: '' });

  const featuredEvent = {
    id: 100,
    title: 'Annual Robotics Grand Prix 2026',
    club: 'Robotics Society',
    date: 'Friday, Oct 12 • 2:00 PM',
    venue: 'Main Innovation Arena',
    budget: '$1,500',
    attendees: '240 Registered',
    description: 'Premier inter-college autonomous bot competition featuring 36 engineering teams, live arena obstacles, and faculty evaluation panels.'
  };

  const handleCreateClub = (e) => {
    e.preventDefault();
    if (!clubForm.name) return;
    showToast(`Club "${clubForm.name}" registered successfully!`, 'success');
    setClubForm({ name: '', category: 'Technical', lead: '', email: '' });
    setActiveModal(null);
  };

  const handleBroadcastNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title) return;
    showToast(`Announcement "${noticeForm.title}" broadcasted to ${noticeForm.audience}!`, 'success');
    setNoticeForm({ title: '', audience: 'All Students', content: '' });
    setActiveModal(null);
  };

  const handleCardClick = (type, title, count, desc) => {
    setMetricDetail({ title, count, desc, type });
    setActiveModal('metricBreakdown');
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header Row: Clean, uncluttered, spacious */}
      <div className="page-header-row" style={{ marginBottom: '36px' }}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-success flex items-center" style={{ fontSize: '0.7rem' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5" />
              Fall Term 2026 Active
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: '2.1rem', letterSpacing: '-0.03em' }}>
            Campus Overview
          </h1>
          <p className="page-description">
            Live operational telemetry, venue allocations, and governance pulse.
          </p>
        </div>
      </div>

      {/* Minimal, Airy Stat Metrics from other campus screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Metric 1: Live Competitions (from Competitions & Events screen) */}
        <div
          className="card metric-card"
          onClick={() => handleCardClick('blue', 'Active Campus Competitions', '12 Live', '12 sanctioned collegiate competitions, hackathons, and varsity leagues currently underway across campus.')}
          title="Click to view competition details"
          role="button"
          tabIndex={0}
          style={{ padding: '28px 26px' }}
        >
          <div className="metric-icon-box blue">
            <TrophyIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Live Competitions</span>
            <span className="metric-value">12</span>
            <span className="text-muted text-xs mt-1">Across 4 faculties</span>
          </div>
          <div className="metric-card-blob bg-blue-600"></div>
        </div>

        {/* Metric 2: Venue Occupancy (from Global Calendar screen) */}
        <div
          className="card metric-card"
          onClick={() => handleCardClick('green', 'Campus Venue Occupancy', '78%', 'Main Auditorium, Innovation Lab 2, and Sports Oval are booked for scheduled fixtures today.')}
          title="Click to view venue occupancy"
          role="button"
          tabIndex={0}
          style={{ padding: '28px 26px' }}
        >
          <div className="metric-icon-box green">
            <CalendarIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Venue Occupancy</span>
            <span className="metric-value">78%</span>
            <span className="text-muted text-xs mt-1">4 of 6 halls reserved today</span>
          </div>
          <div className="metric-card-blob bg-emerald-600"></div>
        </div>

        {/* Metric 3: Grants Allocated (from Event Quality & Budget screen) */}
        <div
          className="card metric-card"
          onClick={() => handleCardClick('yellow', 'Activity Grants Disbursed', '$28,400', '$28,400 of $35,000 total semester co-curricular budget audited and disbursed to verified clubs.')}
          title="Click to inspect budget breakdown"
          role="button"
          tabIndex={0}
          style={{ padding: '28px 26px' }}
        >
          <div className="metric-icon-box yellow">
            <SparklesIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Grants Allocated</span>
            <span className="metric-value">$28.4k</span>
            <span className="text-muted text-xs mt-1">84% of term grant ceiling</span>
          </div>
          <div className="metric-card-blob bg-amber-500"></div>
        </div>
      </div>

      {/* Restructured Main Section: Spacious & Clean (No Clutter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Area: Spotlight Feature & Quick Shortcuts (8 columns on large screens) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Spotlight Card: Generous spacing, minimal data */}
          <div className="card" style={{ padding: '32px' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="badge badge-blue">
                Next Flagship Fixture
              </span>
              <span className="text-xs text-muted font-semibold">
                {featuredEvent.date}
              </span>
            </div>

            <h2 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}
              onClick={() => navigate('/admin/events/100?source=approvals', { state: { fromDashboard: true } })}
            >
              {featuredEvent.title}
            </h2>

            <p className="text-muted text-xs mb-4">
              Organized by <strong>{featuredEvent.club}</strong> • Venue: <strong>{featuredEvent.venue}</strong> • Budget: <strong>{featuredEvent.budget}</strong>
            </p>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-8" style={{ maxWidth: '640px' }}>
              {featuredEvent.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-neutral-800 flex-wrap gap-4">
              <span className="badge badge-purple flex items-center" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                <UsersIcon className="w-3.5 h-3.5 inline mr-1" />
                {featuredEvent.attendees}
              </span>

              <div className="flex items-center gap-3">
                <Link to="/admin/calendar" className="btn btn-outline btn-sm">
                  View on Calendar
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/admin/events/100?source=approvals', { state: { fromDashboard: true } })}
                >
                  Review Proposal
                </button>
              </div>
            </div>
          </div>

          {/* Quick Operations Shortcuts: Airy row with spacious buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              className="p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-card hover:border-blue-500/40 hover:shadow-sm transition-all text-left flex items-center justify-between group"
              onClick={() => setActiveModal('registerClub')}
            >
              <div>
                <span className="text-xs text-muted font-bold block mb-1">Organization</span>
                <span className="text-sm font-extrabold text-gray-900 dark:text-white">Register Club</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <PlusIcon className="w-4 h-4" />
              </div>
            </button>

            <button
              className="p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-card hover:border-blue-500/40 hover:shadow-sm transition-all text-left flex items-center justify-between group"
              onClick={() => setActiveModal('broadcast')}
            >
              <div>
                <span className="text-xs text-muted font-bold block mb-1">Alerts</span>
                <span className="text-sm font-extrabold text-gray-900 dark:text-white">Broadcast Notice</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <NoticeIcon className="w-4 h-4" />
              </div>
            </button>

            <Link
              to="/admin/reviews"
              className="p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-card hover:border-blue-500/40 hover:shadow-sm transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-muted font-bold block mb-1">Audits</span>
                <span className="text-sm font-extrabold text-gray-900 dark:text-white">Grant Receipts</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Area: Governance Pulse (4 columns on large screens) */}
        <div className="lg:col-span-4">
          <div className="card" style={{ padding: '30px 26px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Campus Pulse</h3>
                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Optimal</span>
              </div>

              {/* Clean, un-crowded status list */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-neutral-800/80">
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Pending Approvals</h4>
                    <p className="text-xs text-muted mt-0.5">3 club proposals need decision</p>
                  </div>
                  <span className="badge badge-warning">3 New</span>
                </div>

                <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-neutral-800/80">
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Facility Safety</h4>
                    <p className="text-xs text-muted mt-0.5">All 6 auditoriums cleared</p>
                  </div>
                  <span className="badge badge-success">100% Pass</span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Student Directory</h4>
                    <p className="text-xs text-muted mt-0.5">Academic records in sync</p>
                  </div>
                  <span className="badge badge-blue">3,402 Sync</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
              <Link
                to="/admin/approvals"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Open Approval Queue</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Register New Club */}
      <Modal
        isOpen={activeModal === 'registerClub'}
        onClose={() => setActiveModal(null)}
        title="Register New Student Club"
        subtitle="Establish and provision a recognized campus organization"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateClub}>Register Club</button>
          </>
        }
      >
        <form onSubmit={handleCreateClub}>
          <div className="form-group">
            <label className="form-label">Club / Society Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Artificial Intelligence Research Group"
              value={clubForm.name}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Primary Category</label>
            <select
              className="form-select"
              value={clubForm.category}
              onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
            >
              <option value="Technical">Technical & Engineering</option>
              <option value="Cultural">Cultural & Arts</option>
              <option value="Sports">Athletics & Sports</option>
              <option value="Literary">Literary & Debating</option>
              <option value="Social">Community & Outreach</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">President / Lead Student</label>
            <input
              type="text"
              className="form-input"
              placeholder="Full name of lead coordinator"
              value={clubForm.lead}
              onChange={(e) => setClubForm({ ...clubForm, lead: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Official Contact Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="club.society@campus.edu"
              value={clubForm.email}
              onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Broadcast Notice */}
      <Modal
        isOpen={activeModal === 'broadcast'}
        onClose={() => setActiveModal(null)}
        title="Broadcast Campus Announcement"
        subtitle="Publish a verified notification to student and faculty feeds"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBroadcastNotice}>Publish Broadcast</button>
          </>
        }
      >
        <form onSubmit={handleBroadcastNotice}>
          <div className="form-group">
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hackathon 2026 Lab Access Rules"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Audience</label>
            <select
              className="form-select"
              value={noticeForm.audience}
              onChange={(e) => setNoticeForm({ ...noticeForm, audience: e.target.value })}
            >
              <option value="All Students">All Enrolled Students</option>
              <option value="Club Executives">Club Leads & Executives</option>
              <option value="Faculty">Faculty & Staff</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Write the notification body here..."
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>



      {/* MODAL 4: Metric Breakdown */}
      {metricDetail && (
        <Modal
          isOpen={activeModal === 'metricBreakdown'}
          onClose={() => setActiveModal(null)}
          title={metricDetail.title}
          subtitle="System Metric Analytical Inspection"
          size="sm"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Done</button>
          }
        >
          <div className="text-center py-4">
            <div className="text-4xl font-black text-blue-600 mb-2">{metricDetail.count}</div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
              {metricDetail.desc}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
