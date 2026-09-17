import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ApprovalsIcon,
  UsersIcon,
  ClubsIcon,
  DirectoryIcon,
  ReviewsIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon,
  NoticeIcon,
  CheckIcon,
  ShieldIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'registerClub' | 'broadcast'

  // Form states
  const [clubForm, setClubForm] = useState({ name: '', category: 'Technical', lead: '', email: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', audience: 'All Students', content: '' });

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

  // Weekly occupancy dataset for Global Calendar Bar Chart (Mon-Sun)
  const weeklyOccupancy = [
    { day: 'Mon', percent: 55, active: false },
    { day: 'Tue', percent: 68, active: false },
    { day: 'Wed', percent: 85, active: false },
    { day: 'Thu', percent: 78, active: true }, // Today (Active Highlight)
    { day: 'Fri', percent: 92, active: false },
    { day: 'Sat', percent: 45, active: false },
    { day: 'Sun', percent: 25, active: false }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* ===================================================================
          Header Row: Clean, uncluttered, spacious
          =================================================================== */}
      <div className="page-header-row mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="badge badge-success flex items-center" style={{ fontSize: '0.7rem' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
              Fall Term 2026 Active
            </span>
            <span className="text-xs text-muted font-semibold">•</span>
            <span className="text-xs text-muted font-medium">Campus OS v2.4</span>
          </div>

          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Administrative Command Center
          </h1>
          <p className="page-description text-xs text-muted">
            Statistical summaries and visual telemetry synthesized from all 6 campus governance modules.
          </p>
        </div>

        {/* Quick Operations */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setActiveModal('broadcast')}
          >
            <NoticeIcon className="w-4 h-4 text-amber-500" />
            <span>Broadcast Notice</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveModal('registerClub')}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Register Club</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          ROW 1: TOP HERO ROW (Time-Sensitive Operations)
          1. Global Calendar & Venues  |  2. Event Approvals & Pipeline
          =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* 1. GLOBAL CALENDAR & VENUES CARD */}
        <Link 
          to="/admin/calendar" 
          className="hero-visual-card group"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-main">Global Calendar & Venues</h2>
                  <span className="text-xs text-muted font-semibold block">Campus-wide schedules & venue reservations</span>
                </div>
              </div>
              <span className="badge badge-success text-xs font-extrabold">78% Peak Today</span>
            </div>

            {/* Visual 7-Day Weekly Occupancy Bar Chart */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 mb-4">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-muted">Weekly Venue Utilization</span>
                <span className="font-extrabold text-main">4 of 6 Halls Booked Today</span>
              </div>

              <div className="weekly-occupancy-chart">
                {weeklyOccupancy.map((item, i) => (
                  <div key={i} className="occupancy-bar-col">
                    <div className="occupancy-bar-track">
                      <div 
                        className={`occupancy-bar-fill ${item.active ? 'active-today' : ''}`}
                        style={{ height: `${item.percent}%` }}
                        title={`${item.day}: ${item.percent}% Occupancy`}
                      />
                    </div>
                    <span className={`occupancy-bar-day ${item.active ? 'active-today' : ''}`}>
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Statistical Highlights */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Peak Window</span>
                <span className="font-extrabold text-main">2:00 - 6:00 PM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Top Hall</span>
                <span className="font-extrabold text-main truncate block">Innovation Arena</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Next Fixture</span>
                <span className="font-extrabold text-main truncate block">Oct 12 • 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between mt-4">
            <span className="text-xs font-bold text-muted">Inspect Interactive Schedule</span>
            <span className="card-action-link text-xs group-hover:translate-x-1">
              <span>View Global Calendar</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 2. EVENT APPROVALS & PIPELINE CARD */}
        <Link 
          to="/admin/approvals" 
          className="hero-visual-card group"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shadow-sm">
                  <ApprovalsIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-main">Event Proposals & Approvals</h2>
                  <span className="text-xs text-muted font-semibold block">Grant evaluations & scheduling permits</span>
                </div>
              </div>
              <span className="badge badge-warning text-xs font-extrabold">3 Awaiting Review</span>
            </div>

            {/* Visual SVG Donut Clearance Gauge + Status Counts */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 mb-4">
              <div className="flex items-center justify-between gap-6">
                <div className="donut-gauge-container">
                  <svg viewBox="0 0 88 88" className="donut-gauge-svg">
                    <circle cx="44" cy="44" r="38" className="donut-gauge-bg" />
                    <circle 
                      cx="44" 
                      cy="44" 
                      r="38" 
                      className="donut-gauge-fill"
                      stroke="#10b981"
                      strokeDasharray="238.76"
                      strokeDashoffset="38.2"
                    />
                  </svg>
                  <div className="donut-gauge-center">
                    <span className="text-lg font-black text-main leading-none">84%</span>
                    <span className="text-[9px] font-bold text-muted uppercase mt-0.5">Cleared</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Approved
                    </span>
                    <strong className="text-main">16 Fixtures</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      In Review
                    </span>
                    <strong className="text-amber-600 dark:text-amber-400">3 Pending</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Rejected
                    </span>
                    <strong className="text-muted">1 Archived</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistical Highlights */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Grants Evaluated</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">$28.4k</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Avg Decision</span>
                <span className="font-extrabold text-main">1.8 Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Permit Compliance</span>
                <span className="font-extrabold text-main">100% Verified</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between mt-4">
            <span className="text-xs font-bold text-muted">Review Proposal Pipeline</span>
            <span className="card-action-link text-xs group-hover:translate-x-1">
              <span>Open Approval Queue</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* ===================================================================
          ROW 2: THREE (3) CARDS
          3. Clubs & Societies  |  4. Members & Governance  |  5. Event Reviews & Audits
          =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        {/* 3. CLUBS & SOCIETIES CARD */}
        <Link 
          to="/admin/clubs" 
          className="dashboard-visual-card group"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                  <ClubsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-main">Clubs & Societies</h3>
                  <span className="text-[10px] text-muted font-bold block">Chartered Organizations</span>
                </div>
              </div>
              <span className="badge badge-purple text-[10px]">6 Chartered</span>
            </div>

            {/* Visual Multi-Category Segmented Distribution Bar */}
            <div className="py-2 mb-3">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-muted text-[11px]">Category Affiliation</span>
                <span className="font-extrabold text-main">362 Student Members</span>
              </div>

              <div className="segmented-dist-bar mb-2">
                <div style={{ width: '45%', background: '#3b82f6' }} className="segmented-dist-seg" title="Technical: 45%" />
                <div style={{ width: '30%', background: '#8b5cf6' }} className="segmented-dist-seg" title="Cultural & Arts: 30%" />
                <div style={{ width: '15%', background: '#10b981' }} className="segmented-dist-seg" title="Sports: 15%" />
                <div style={{ width: '10%', background: '#f59e0b' }} className="segmented-dist-seg" title="Science: 10%" />
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-muted">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Technical (2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Cultural (2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Sports (1)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Science (1)</span>
                </div>
              </div>
            </div>

            {/* Statistical summary pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Leadership</span>
                <span className="font-extrabold text-main">100% Appointed</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Co-Curriculars</span>
                <span className="font-extrabold text-main">17 Events Hosted</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-muted">Manage Organizations</span>
            <span className="card-action-link text-xs group-hover:translate-x-0.5">
              <span>Open Clubs</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 4. MEMBERS & GOVERNANCE CARD */}
        <Link 
          to="/admin/members" 
          className="dashboard-visual-card group"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-main">Members & Staffing</h3>
                  <span className="text-[10px] text-muted font-bold block">Governance & Coordinator Roster</span>
                </div>
              </div>
              <span className="badge badge-success text-[10px]">100% Active</span>
            </div>

            {/* Visual Staffing Allocation Ratio Bar */}
            <div className="py-2 mb-3">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-muted text-[11px]">Staffing Role Split</span>
                <span className="font-extrabold text-main">8 Appointed Staff</span>
              </div>

              <div className="staffing-ratio-track mb-2">
                <div style={{ width: '62%', background: '#3b82f6' }} title="Club Coordinators: 62%" />
                <div style={{ width: '38%', background: '#8b5cf6' }} title="Administrators: 38%" />
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-muted">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  5 Coords (62%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  3 Admins (38%)
                </span>
              </div>
            </div>

            {/* Statistical summary pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Academic Depts</span>
                <span className="font-extrabold text-main">8 Faculties</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Roster Health</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">6 Active • 2 Inactive</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-muted">Manage Staff Roster</span>
            <span className="card-action-link text-xs group-hover:translate-x-0.5">
              <span>Open Members</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 5. EVENT REVIEWS & AUDITS CARD */}
        <Link 
          to="/admin/reviews" 
          className="dashboard-visual-card group"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                  <ReviewsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-main">Event Reviews & Audits</h3>
                  <span className="text-[10px] text-muted font-bold block">Delegate Quality & Ratings</span>
                </div>
              </div>
              <span className="badge badge-warning text-[10px] flex items-center gap-1 font-extrabold">
                <StarIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" filled={true} />
                <span>4.8 / 5.0</span>
              </span>
            </div>

            {/* Visual 5-Star Quality Score & Sentiment Meter */}
            <div className="py-2 mb-3">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <StarIcon className="w-3.5 h-3.5" filled={true} />
                  <StarIcon className="w-3.5 h-3.5" filled={true} />
                  <StarIcon className="w-3.5 h-3.5" filled={true} />
                  <StarIcon className="w-3.5 h-3.5" filled={true} />
                  <StarIcon className="w-3.5 h-3.5" filled={true} />
                </div>
                <span className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">
                  96% Positive
                </span>
              </div>

              {/* Sentiment Fill Bar */}
              <div className="capacity-progress-track mb-2">
                <div 
                  className="capacity-progress-fill" 
                  style={{ width: '96%', background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)' }}
                />
              </div>

              <span className="text-[10px] text-muted font-bold block truncate">
                1,280 Student Reviews Audited
              </span>
            </div>

            {/* Statistical summary pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Institutional Status</span>
                <span className="font-extrabold text-main">100% Audited</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
                <span className="text-muted block text-[10px]">Top Rated Event</span>
                <span className="font-extrabold text-main truncate block">Career Fair (4.8)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-muted">Review Feedback</span>
            <span className="card-action-link text-xs group-hover:translate-x-0.5">
              <span>Open Reviews</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

      </div>

      {/* ===================================================================
          ROW 3: ONE (1) CARD - ADMINISTRATIVE ACTIVITY & AUDIT LOG
          Recent actions: approvals made, clubs registered, budget updates, timestamps
          =================================================================== */}
      {/* ===================================================================
          ROW 3: ONE (1) CARD - ADMINISTRATIVE ACTIVITY & AUDIT LOG
          Redesigned: Dual-column layout with recent feed & governance telemetry
          =================================================================== */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="showcase-visual-card">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shadow-sm">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-main">Administrative Activity & Audit Log</h2>
                <span className="text-xs text-muted font-semibold block">Live institutional ledger of permits, grants, and registrations</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-success text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Audit Stream Live
              </span>
              <span className="badge badge-blue text-xs font-bold">14 Logged Today</span>
            </div>
          </div>

          {/* Redesigned 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (7 of 12 cols): Recent Operations Feed */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Recent Governance Operations</span>
                <span className="text-[11px] font-semibold text-muted">Auto-Synchronized</span>
              </div>

              <div className="audit-feed-list">
                {/* Item 1 */}
                <div className="audit-feed-card">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-main">Event Permit Cleared</span>
                          <span className="badge badge-success text-[10px] font-bold py-0.5 px-2">Approved</span>
                        </div>
                        <span className="text-[11px] font-bold text-main bg-white dark:bg-neutral-800 py-0.5 px-2 rounded-md border border-gray-100 dark:border-neutral-700">
                          Today, 2:45 PM
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium mb-1">
                        "Annual Robotics Grand Prix 2026" venue permit approved for Main Auditorium
                      </p>
                      <span className="text-[11px] text-muted font-semibold block">
                        Authorized by: <strong className="text-main font-bold">Dr. Robert Vance (Admin)</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="audit-feed-card">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CurrencyDollarIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-main">Activity Grant Authorized</span>
                          <span className="badge badge-blue text-[10px] font-bold py-0.5 px-2">Budget Update</span>
                        </div>
                        <span className="text-[11px] font-bold text-main bg-white dark:bg-neutral-800 py-0.5 px-2 rounded-md border border-gray-100 dark:border-neutral-700">
                          Today, 11:30 AM
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium mb-1">
                        $4,500 prize & equipment grant released to Tech & Innovation Society
                      </p>
                      <span className="text-[11px] text-muted font-semibold block">
                        Authorized by: <strong className="text-main font-bold">Finance Desk</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="audit-feed-card">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ClubsIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-main">New Organization Provisioned</span>
                          <span className="badge badge-purple text-[10px] font-bold py-0.5 px-2">Club Registered</span>
                        </div>
                        <span className="text-[11px] font-bold text-main bg-white dark:bg-neutral-800 py-0.5 px-2 rounded-md border border-gray-100 dark:border-neutral-700">
                          Yesterday, 4:15 PM
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium mb-1">
                        "Quantum Computing Society" chartered under Department of Computer Science
                      </p>
                      <span className="text-[11px] text-muted font-semibold block">
                        Authorized by: <strong className="text-main font-bold">Student Affairs Registry</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="audit-feed-card">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <NoticeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-main">Official Bulletin Broadcasted</span>
                          <span className="badge badge-warning text-[10px] font-bold py-0.5 px-2">Notice</span>
                        </div>
                        <span className="text-[11px] font-bold text-main bg-white dark:bg-neutral-800 py-0.5 px-2 rounded-md border border-gray-100 dark:border-neutral-700">
                          Sep 11, 10:00 AM
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium mb-1">
                        "Fall Term Lab Safety Protocol & Access Hours" delivered to all enrolled students
                      </p>
                      <span className="text-[11px] text-muted font-semibold block">
                        Authorized by: <strong className="text-main font-bold">Dean of Academic Affairs</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 of 12 cols): Governance Telemetry & Compliance Panel */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Governance Status</span>
                <span className="badge badge-success text-[10px] font-bold">Verified Compliant</span>
              </div>

              <div className="audit-summary-panel flex-1">
                {/* Institutional Compliance Seal */}
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/70 border border-emerald-200/80 dark:border-emerald-800/40 mb-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-main leading-tight">100% Policy Compliant</h4>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                        Tamper-Evident System Audit Active
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted font-medium leading-relaxed">
                    All administrative actions, permit approvals, and budget allocations are automatically verified under Fall 2026 Academic Governance Bylaws.
                  </p>
                </div>

                {/* 2x2 Telemetry Metric Boxes */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700/60">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Actions Today</span>
                    <span className="text-base font-black text-main">14 Recorded</span>
                    <span className="text-[10px] text-muted block mt-0.5">Across all modules</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700/60">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Grants Released</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">$28.4k</span>
                    <span className="text-[10px] text-muted block mt-0.5">Semester to date</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700/60">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Permits Cleared</span>
                    <span className="text-base font-black text-main">100%</span>
                    <span className="text-[10px] text-muted block mt-0.5">0 Safety flags</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700/60">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Active Officers</span>
                    <span className="text-base font-black text-main">3 On Duty</span>
                    <span className="text-[10px] text-muted block mt-0.5">Session synchronized</span>
                  </div>
                </div>

                {/* Audit Seal Footer Info */}
                <div className="pt-3 border-t border-gray-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-muted font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SHA-256 Ledger Synchronized
                  </span>
                  <span>Campus OS v2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          MODALS: Register Club & Broadcast Notice
          =================================================================== */}
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
    </div>
  );
}
