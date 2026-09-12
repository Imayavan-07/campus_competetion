import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrophyIcon, 
  CalendarIcon, 
  NoticeIcon, 
  UsersIcon, 
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ChartBarIcon,
  MapPinIcon,
  SupportIcon 
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null); // 'findComp' | 'grades' | 'map' | 'noticeDetail' | 'metricModal'
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [metricDetail, setMetricDetail] = useState(null);

  const notices = [
    {
      id: 1,
      title: "Campus Optical Fiber Maintenance",
      author: "IT Infrastructure Services",
      date: "Today at 08:30 AM",
      priority: "High",
      content: "Core library switchboard maintenance scheduled between 2:00 AM - 4:00 AM. Cloud storage and intranet portals will remain operational."
    },
    {
      id: 2,
      title: "Library Study Carrels Extended Hours",
      author: "University Library Dean",
      date: "Yesterday",
      priority: "Normal",
      content: "Main reading halls will remain open until 2:00 AM throughout the midterm examination period with late-night student shuttle access."
    }
  ];

  const handleMetricClick = (title, count, desc) => {
    setMetricDetail({ title, count, desc });
    setActiveModal('metricModal');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Welcome back, Alex!</h1>
          <p className="page-description">Student Portal • Fall Academic Semester 2026</p>
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
      <div className="grid grid-cols-4 mb-10 gap-6">
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
          <div className="metric-card-blob bg-blue-600"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Upcoming Events', '5', '5 campus-wide seminars, workshops, and guest lectures are marked on your personalized calendar this month.')}
        >
          <div className="metric-icon-box yellow">
            <CalendarIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Upcoming Events</span>
            <span className="metric-value">5</span>
          </div>
          <div className="metric-card-blob bg-amber-500"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => navigate('/student/notices')}
        >
          <div className="metric-icon-box red">
            <NoticeIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Unread Notices</span>
            <span className="metric-value">2</span>
          </div>
          <div className="metric-card-blob bg-rose-500"></div>
        </div>
        
        <div 
          className="card metric-card"
          onClick={() => handleMetricClick('Club Memberships', '4', 'You hold active voting memberships in: Computer Science Society, Robotics Guild, Photography Club, and Chess Club.')}
        >
          <div className="metric-icon-box green">
            <UsersIcon />
          </div>
          <div className="metric-info">
            <span className="metric-label">Clubs Enrolled</span>
            <span className="metric-value">4</span>
          </div>
          <div className="metric-card-blob bg-emerald-600"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-6" style={{ gridColumn: 'span 2' }}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Important Campus Notices</h2>
              <button onClick={() => navigate('/student/notices')} className="btn btn-ghost btn-sm">View all →</button>
            </div>
            
            <div className="flex flex-col gap-4">
              {notices.map((notice) => (
                <div 
                  key={notice.id}
                  onClick={() => {
                    setSelectedNotice(notice);
                    setActiveModal('noticeDetail');
                  }}
                  className="p-5 rounded-3xl border border-gray-100 dark:border-neutral-800 bg-card hover:border-blue-500/40 hover:shadow-md cursor-pointer transition-all flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {notice.priority === 'High' && <span className="badge badge-danger">Priority Alert</span>}
                      <h4 className="font-bold text-base">{notice.title}</h4>
                    </div>
                    <p className="text-xs text-muted mb-2">Published by {notice.author} • {notice.date}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{notice.content}</p>
                  </div>
                  <span className="btn btn-outline btn-sm shrink-0 ml-4">Read Notice</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Featured Competition</h2>
              <span className="badge badge-blue">Registration Open</span>
            </div>

            <div className="card p-6 border-blue-100 dark:border-blue-900/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-black">Collegiate AI & Hackathon Sprint 2026</h3>
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
        <div>
          <div className="card mb-8">
            <h3 className="text-base font-bold mb-4 pb-3 border-b border-gray-100 dark:border-neutral-800">Personal Week Schedule</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold">Data Structures Quiz</h4>
                  <p className="text-[11px] text-muted">Tomorrow at 10:00 AM • Room 204</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold">Robotics Club Workshop</h4>
                  <p className="text-[11px] text-muted">Thursday at 4:30 PM • Makerspace</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <h4 className="text-xs font-bold">Hackathon Kickoff Briefing</h4>
                  <p className="text-[11px] text-muted">Friday at 9:00 AM • Auditorium</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-base font-bold mb-4">Student Services</h3>
            <div className="flex flex-col gap-3">
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setActiveModal('grades')}
              >
                <ChartBarIcon className="w-4 h-4 text-blue-600 mr-2 inline flex-shrink-0" />
                <span>View Academic Standing & Credits</span>
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setActiveModal('map')}
              >
                <MapPinIcon className="w-4 h-4 text-emerald-600 mr-2 inline flex-shrink-0" />
                <span>Campus Building Directory</span>
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => showToast('Dispatched emergency student support ticket to Student Affairs!')}
              >
                <SupportIcon className="w-4 h-4 text-amber-500 mr-2 inline flex-shrink-0" />
                <span>Student Helpdesk Beacon</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Notice Detail */}
      {selectedNotice && (
        <Modal
          isOpen={activeModal === 'noticeDetail'}
          onClose={() => setActiveModal(null)}
          title={selectedNotice.title}
          subtitle={`Issued by ${selectedNotice.author} • ${selectedNotice.date}`}
          size="md"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Acknowledged</button>
          }
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed py-2">
            {selectedNotice.content}
          </p>
        </Modal>
      )}

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
            <span className="text-2xl font-black text-blue-600">3.88 / 4.0</span>
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
              <MapPinIcon className="w-4 h-4 text-blue-600 inline mr-1.5 flex-shrink-0" />
              North Quadrangle: Innovation Hub & Labs
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">Home to Hackathons, Robotics Arenas, and High-Performance Compute Clusters.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
            <h4 className="font-bold text-sm flex items-center">
              <MapPinIcon className="w-4 h-4 text-emerald-600 inline mr-1.5 flex-shrink-0" />
              Central Wing: Main Auditorium & Dean's Hall
            </h4>
            <p className="text-xs text-muted mt-1">Capacity: 1,200 delegates. Venue for annual symposiums and guest keynotes.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
            <h4 className="font-bold text-sm flex items-center">
              <MapPinIcon className="w-4 h-4 text-amber-500 inline mr-1.5 flex-shrink-0" />
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
