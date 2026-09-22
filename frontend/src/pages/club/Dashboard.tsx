import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  UsersIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  StarIcon,
  ReviewsIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShieldIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { eventsService, EventItem } from '../../services/eventsService';
import { reviewsService, ReviewGroup } from '../../services/reviewsService';
import { registrationsService } from '../../services/registrationsService';

export default function ClubDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const currentClubName = (user as any)?.assigned_club || (user as any)?.club || 'Robotics Society';

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [metricDetail, setMetricDetail] = useState<{ title: string; count: string; desc: string } | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [reviews, setReviews] = useState<ReviewGroup[]>([]);
  const [regCount, setRegCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClubData() {
      try {
        setLoading(true);
        const [evts, revs, regs] = await Promise.all([
          eventsService.getEvents({ club: currentClubName }),
          reviewsService.getReviews(),
          registrationsService.getRegistrations()
        ]);
        const eventList = Array.isArray(evts) ? evts : (evts?.data || []);
        const reviewList = Array.isArray(revs) ? revs : (revs?.data || []);
        const regList = Array.isArray(regs) ? regs : (regs?.data || []);
        setEvents(eventList);
        setReviews(reviewList);
        setRegCount(regList.length);
      } catch (err: any) {
        console.warn('Error loading club dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClubData();
  }, [currentClubName]);

  const safeEvents = Array.isArray(events) ? events : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const roboticsReview = safeReviews.find(r => 
    (r?.club && r.club.toLowerCase().includes('robotics')) || 
    (r?.club && currentClubName && r.club.toLowerCase().includes(currentClubName.toLowerCase()))
  ) || safeReviews[0] || null;

  const handleMetricClick = (title: string, count: string, desc: string) => {
    setMetricDetail({ title, count, desc });
    setActiveModal('metricDetail');
  };

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header Row (Clean, uncluttered, no quick action buttons) */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Club Lead Portal</span>
            <span className="badge badge-success text-[10px] font-extrabold">Autonomous Guild #24</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            {currentClubName}
          </h1>
          <p className="page-description text-xs text-muted">
            Executive Operations, Event Supervision, Calendar Fixtures & Delegate Feedback
          </p>
        </div>
      </div>
      
      {/* 4 Key Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Total Events Hosted', `${safeEvents.length}`, `${safeEvents.length} approved competitions, guest symposia, and engineering clinics.`)}
        >
          <div className="metric-icon-box blue">
            <CalendarIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Club Fixtures</span>
            <span className="metric-value">{safeEvents.length}</span>
          </div>
          <div className="metric-card-blob bg-primary"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => navigate('/club/registrations')}
          title="Inspect and manage delegate registrations"
        >
          <div className="metric-icon-box green">
            <UsersIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Registrations</span>
            <span className="metric-value">
              {regCount || safeEvents.reduce((sum, e) => sum + (e.attendees || 0), 0)}
            </span>
          </div>
          <div className="metric-card-blob bg-secondary"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => navigate('/club/reviews')}
          title="Inspect delegate reviews and ratings"
        >
          <div className="metric-icon-box orange">
            <StarIcon className="w-6 h-6 text-tertiary" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Avg Feedback</span>
            <span className="metric-value">{roboticsReview ? roboticsReview.overallRating : '4.9'}<span className="text-sm font-semibold text-muted">/5.0</span></span>
          </div>
          <div className="metric-card-blob bg-tertiary"></div>
        </div>

        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Allocated Grant Utilization', '$5,000', 'Institutional seed grant allocated with active utilization across events.')}
        >
          <div className="metric-icon-box purple">
            <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Grant Budget</span>
            <span className="metric-value">$5.0k</span>
          </div>
          <div className="metric-card-blob bg-purple-600"></div>
        </div>
      </div>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active & Upcoming Club Fixtures */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-main">Club Events & Competitions</h3>
                <p className="text-xs text-muted">Scheduled dates, registered delegates, and clearance</p>
              </div>
              <button onClick={() => navigate('/club/events')} className="btn btn-outline btn-xs">
                Manage Events →
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {safeEvents.length === 0 && !loading && (
                <p className="text-xs text-muted py-4 text-center">No events found for {currentClubName}.</p>
              )}
              {safeEvents.slice(0, 4).map((evt) => {
                const month = evt.month || 'OCT';
                const day = evt.day || '15';
                return (
                  <div 
                    key={evt.id}
                    className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 hover:border-primary/40 transition-all cursor-pointer flex justify-between items-center"
                    onClick={() => navigate(`/club/events/${evt.id}`)}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`event-date-tile ${evt.status === 'Ongoing' ? 'ongoing' : ''}`}>
                        <span className="event-date-month">{month}</span>
                        <span className="event-date-day">{day}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-main hover:text-primary transition-colors">{evt.title}</h4>
                        <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                          <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
                          {evt.venue} • {evt.attendees || 0} Registered
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${
                      evt.approvalStatus === 'Approved' ? 'badge-blue' :
                      evt.approvalStatus === 'Rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {evt.approvalStatus || evt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
            <span className="text-xs text-muted font-semibold">Track all club schedules in Calendar</span>
            <button className="btn btn-ghost btn-xs text-primary font-bold" onClick={() => navigate('/club/calendar')}>
              Open Calendar →
            </button>
          </div>
        </div>

        {/* Club Standing, Grants & Post-Event Feedback Snippet */}
        <div className="flex flex-col gap-6">
          {/* Grant Card */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-main">Institutional Standing & Grant</h3>
                <span className="text-xs text-muted">Term 1 Allocation & Expense Tracking</span>
              </div>
              <span className="badge badge-success">Certified Club</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 mb-4">
              <span className="text-[10px] font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider">Allocated Term Grant</span>
              <div className="flex justify-between items-baseline mt-1 mb-2">
                <span className="text-2xl font-black text-blue-950 dark:text-blue-100">$2,400.00</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">$650.00 Remaining</span>
              </div>
              <div className="capacity-progress-track">
                <div className="capacity-progress-fill" style={{ width: '73%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  Dr
                </div>
                <div>
                  <p className="font-bold text-main">Faculty Advisor: Dr. Aris Thorne</p>
                  <span className="text-[11px] text-muted">Department of Robotics & Automation</span>
                </div>
              </div>
              <button 
                className="btn btn-outline btn-xs"
                onClick={() => showToast('Dispatched message to Faculty Advisor (Dr. Aris Thorne)!', 'success')}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Recent Attendee Feedback Snippet Card */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-main">Latest Attendee Feedback</h3>
                <span className="text-xs text-muted">Recent delegate reviews from completed events</span>
              </div>
              <button 
                onClick={() => navigate('/club/reviews')}
                className="btn btn-ghost btn-xs text-primary font-bold"
              >
                View All Reviews →
              </button>
            </div>

            {roboticsReview && (
              <div className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-extrabold text-xs text-main">{roboticsReview.title}</span>
                  <div className="flex items-center gap-1 text-tertiary">
                    <StarIcon className="w-3.5 h-3.5" />
                    <span className="text-xs font-black">{roboticsReview.overallRating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted italic line-clamp-2 leading-relaxed mb-3">
                  "{roboticsReview.reviews?.[0]?.feedback || 'Outstanding track design and responsive arbitration!'}"
                </p>
                <div className="flex justify-between items-center text-[11px] text-muted pt-2 border-t border-gray-100 dark:border-neutral-800">
                  <span className="font-bold">— {roboticsReview.reviews?.[0]?.name || 'Student Delegate'} ({roboticsReview.reviews?.[0]?.collegeName?.split(',')?.[0] || 'Campus'})</span>
                  <span className="badge badge-success text-[10px]">{roboticsReview.totalReviews || 0} Total Reviews</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Metric Breakdown */}
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
            <div className="text-4xl font-black text-primary mb-2">{metricDetail.count}</div>
            <p className="text-xs font-semibold text-muted leading-relaxed">
              {metricDetail.desc}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
