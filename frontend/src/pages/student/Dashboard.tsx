import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrophyIcon, 
  CalendarIcon, 
  UsersIcon, 
  SparklesIcon, 
  CheckIcon, 
  ArrowRightIcon, 
  ChartBarIcon, 
  MapPinIcon, 
  SupportIcon,
  StarIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { eventsService, EventItem } from '../../services/eventsService';
import { registrationsService } from '../../services/registrationsService';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'grades' | 'map' | 'metricModal'
  const [metricDetail, setMetricDetail] = useState<{ title: string; count: string; desc: string } | null>(null);

  const [registeredFixtures, setRegisteredFixtures] = useState<any[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [allEventsRes, allRegsRes] = await Promise.all([
          eventsService.getEvents(),
          registrationsService.getRegistrations()
        ]);
        const allEvents = Array.isArray(allEventsRes) ? allEventsRes : (allEventsRes?.data || []);
        const allRegistrations = Array.isArray(allRegsRes) ? allRegsRes : (allRegsRes?.data || []);
        setEvents(allEvents);

        if (allRegistrations && allRegistrations.length > 0) {
          const mapped = allRegistrations.map((r: any) => {
            const evt = (allEvents || []).find((e: any) => e.id === r.event_id || e.id === r.eventId);
            return {
              id: r.id,
              title: evt ? evt.title : `Event #${r.event_id || r.eventId || r.id}`,
              club: evt ? evt.club : 'Campus Guild',
              date: evt ? evt.date : 'Upcoming Session',
              venue: evt ? evt.venue : 'Main Campus Complex',
              passId: `SYN-${String(r.id).padStart(4, '0')}`,
              status: r.status === 'confirmed' ? 'Confirmed Seat' : 'Registered Delegate',
              statusColor: 'badge-success'
            };
          });
          setRegisteredFixtures(mapped);
        } else if (allEvents && allEvents.length > 0) {
          const sample = allEvents.slice(0, 3).map((e: any, idx: number) => ({
            id: e.id,
            title: e.title,
            club: e.club,
            date: e.date,
            venue: e.venue,
            passId: `SYN-${8800 + idx}`,
            status: idx === 0 ? 'Confirmed Delegate' : 'Registered Seat',
            statusColor: idx === 0 ? 'badge-success' : 'badge-blue'
          }));
          setRegisteredFixtures(sample);
        }
      } catch (err: any) {
        console.warn('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMetricClick = (title: string, count: string, desc: string) => {
    setMetricDetail({ title, count, desc });
    setActiveModal('metricModal');
  };

  return (
    <div>
      <div className="page-header-row mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Student Hub</span>
            <span className="badge badge-success text-[10px] font-extrabold">Fall Academic Term 2026</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="page-description text-xs text-muted">
            Track registered fixtures, browse campus competitions, and monitor merit credits.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('map')}
          >
            Campus Map
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/student/competitions')}
          >
            <TrophyIcon className="w-4 h-4" />
            <span>Browse Competitions</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-6">
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Active Registrations', '3', 'You are currently confirmed as an active contestant in 3 campus fixtures: Hackathon 2026, Robotics Trials, and Inter-College Chess.')}
        >
          <div className="metric-icon-box blue">
            <TrophyIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Reg.</span>
            <span className="metric-value">3</span>
          </div>
          <div className="metric-card-blob bg-primary"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Upcoming Events', '5', '5 campus-wide seminars, workshops, and guest lectures are marked on your personalized calendar this month.')}
        >
          <div className="metric-icon-box yellow">
            <CalendarIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Upcoming Fixtures</span>
            <span className="metric-value">5</span>
          </div>
          <div className="metric-card-blob bg-amber-500"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Merit & Activity Credits', '450', 'Earned 450 verified campus activity points across hackathons, workshops, and student council contributions.')}
        >
          <div className="metric-icon-box green">
            <SparklesIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Merit Points</span>
            <span className="metric-value">450</span>
          </div>
          <div className="metric-card-blob bg-secondary"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Club Memberships', '4', 'You hold active voting memberships in: Computer Science Society, Robotics Guild, Photography Club, and Chess Club.')}
        >
          <div className="metric-icon-box purple">
            <UsersIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Clubs Enrolled</span>
            <span className="metric-value">4</span>
          </div>
          <div className="metric-card-blob bg-purple-600"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Registered Fixtures & Fast-Pass Badges */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-main">Your Registered Fixtures & Passes</h2>
                <p className="text-xs text-muted">Show your digital pass ID at the registration gate</p>
              </div>
              <button onClick={() => navigate('/student/competitions')} className="btn btn-ghost btn-sm text-primary font-bold">
                Find More Events →
              </button>
            </div>
            
            <div className="flex flex-col gap-3.5">
              {registeredFixtures.map((fixture) => (
                <div 
                  key={fixture.id}
                  className="p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${fixture.statusColor}`}>{fixture.status}</span>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {fixture.passId}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-main">{fixture.title}</h4>
                    <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                      <span>{fixture.club}</span>
                      <span>•</span>
                      <span>{fixture.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3 text-secondary" />
                        {fixture.venue}
                      </span>
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline btn-sm shrink-0"
                    onClick={() => showToast(`Digital gate pass ${fixture.passId} active and verified!`, 'success')}
                  >
                    View Pass
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Competition Hero Card */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-main">Featured Campus Competition</h2>
              <span className="badge badge-blue">Registration Open</span>
            </div>

            <div className="card p-6 border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-black text-main">Collegiate AI & Hackathon Sprint 2026</h3>
                  <p className="text-xs text-muted mt-0.5">Computer Science Club • Scheduled for Next Friday</p>
                </div>
                <span className="badge badge-success">Prize Pool: $5,000</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Build cutting-edge distributed web applications and machine intelligence agents. 24 hours of non-stop innovation with cloud GPU sponsorships.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex gap-2">
                  <span className="badge badge-purple">Team of 2-4</span>
                  <span className="badge badge-blue">Certificates Included</span>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/student/competitions')}
                >
                  <span>Register Team</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Schedule & Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="text-base font-bold text-main mb-4 pb-3 border-b border-gray-100 dark:border-neutral-800">
              Personal Week Schedule
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold text-main">Data Structures Quiz</h4>
                  <p className="text-[11px] text-muted">Tomorrow at 10:00 AM • Room 204</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold text-main">Robotics Club Workshop</h4>
                  <p className="text-[11px] text-muted">Thursday at 4:30 PM • Makerspace</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold text-main">Hackathon Kickoff Briefing</h4>
                  <p className="text-[11px] text-muted">Friday at 9:00 AM • Auditorium</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-base font-bold text-main mb-4">Student Services</h3>
            <div className="flex flex-col gap-3">
              <button 
                className="btn btn-outline w-full justify-start text-xs" 
                onClick={() => setActiveModal('grades')}
              >
                <ChartBarIcon className="w-4 h-4 text-primary mr-2 inline flex-shrink-0" />
                <span>View Academic Standing & Credits</span>
              </button>
              <button 
                className="btn btn-outline w-full justify-start text-xs" 
                onClick={() => setActiveModal('map')}
              >
                <MapPinIcon className="w-4 h-4 text-secondary mr-2 inline flex-shrink-0" />
                <span>Campus Building Directory</span>
              </button>
              <button 
                className="btn btn-outline w-full justify-start text-xs" 
                onClick={() => showToast('Dispatched emergency student support ticket to Student Affairs!')}
              >
                <SupportIcon className="w-4 h-4 text-tertiary mr-2 inline flex-shrink-0" />
                <span>Student Helpdesk Beacon</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Academic Standing / Grades */}
      <Modal
        isOpen={activeModal === 'grades'}
        onClose={() => setActiveModal(null)}
        title="Official Academic Transcript Snippet"
        subtitle="Enrolled: Bachelor of Technology (Computer Science) • Semester 5"
        size="md"
        footer={
          <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Close</button>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">Cumulative GPA</p>
              <span className="text-xs text-muted">Credits Completed: 88 / 120</span>
            </div>
            <span className="text-2xl font-black text-primary">3.88 / 4.0</span>
          </div>
          <div className="p-3 rounded-xl border border-gray-100 dark:border-neutral-800 flex justify-between text-xs font-semibold">
            <span>CS301: Advanced Algorithms</span>
            <span className="badge badge-success">Grade: A</span>
          </div>
          <div className="p-3 rounded-xl border border-gray-100 dark:border-neutral-800 flex justify-between text-xs font-semibold">
            <span>CS304: Distributed Databases</span>
            <span className="badge badge-success">Grade: A-</span>
          </div>
          <div className="p-3 rounded-xl border border-gray-100 dark:border-neutral-800 flex justify-between text-xs font-semibold">
            <span>CS312: Artificial Intelligence Principles</span>
            <span className="badge badge-success">Grade: A</span>
          </div>
        </div>
      </Modal>

      {/* MODAL: Campus Map */}
      <Modal
        isOpen={activeModal === 'map'}
        onClose={() => setActiveModal(null)}
        title="Interactive Campus Building Directory"
        subtitle="GPS-calibrated campus facility locator"
        size="md"
        footer={
          <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Close Map</button>
        }
      >
        <div className="flex flex-col gap-3 py-2">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center">
              <MapPinIcon className="w-4 h-4 text-primary inline mr-1.5 flex-shrink-0" />
              North Quadrangle: Innovation Hub & Labs
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">Home to Hackathons, Robotics Arenas, and High-Performance Compute Clusters.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
            <h4 className="font-bold text-sm flex items-center">
              <MapPinIcon className="w-4 h-4 text-secondary inline mr-1.5 flex-shrink-0" />
              Central Wing: Main Auditorium & Dean's Hall
            </h4>
            <p className="text-xs text-muted mt-1">Capacity: 1,200 delegates. Venue for annual symposiums and guest keynotes.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
            <h4 className="font-bold text-sm flex items-center">
              <MapPinIcon className="w-4 h-4 text-tertiary inline mr-1.5 flex-shrink-0" />
              South Quadrangle: Sports Pavilion & Recreation
            </h4>
            <p className="text-xs text-muted mt-1">Gymnasiums, indoor chess halls, and collegiate esports arena.</p>
          </div>
        </div>
      </Modal>

      {/* MODAL: Metric breakdown */}
      {metricDetail && (
        <Modal
          isOpen={activeModal === 'metricModal'}
          onClose={() => setActiveModal(null)}
          title={metricDetail.title}
          subtitle="Student Portal Telemetry"
          size="sm"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Understood</button>
          }
        >
          <div className="text-center py-4">
            <div className="text-4xl font-black text-primary mb-2">{metricDetail.count}</div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
              {metricDetail.desc}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
