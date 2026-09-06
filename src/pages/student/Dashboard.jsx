import React from 'react';
import NoticeCard from '../../components/NoticeCard';
import EventCard from '../../components/EventCard';

export default function StudentDashboard() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ marginBottom: '4px' }}>Welcome back, Student!</h1>
          <p className="text-muted">Here's an overview of your campus life.</p>
        </div>
        <button className="btn btn-primary">Find Competitions</button>
      </div>

      <div className="grid grid-cols-4 mb-10 gap-6">
        <div className="card" style={{ background: 'var(--primary-color)', color: 'white', border: 'none' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.9)' }}>Active Reg.</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '8px 0 0' }}>3</p>
        </div>
        <div className="card">
          <h3>Upcoming Events</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '8px 0 0', color: 'var(--primary-color)' }}>5</p>
        </div>
        <div className="card">
          <h3>Unread Notices</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '8px 0 0', color: 'var(--tertiary-color)' }}>2</p>
        </div>
        <div className="card">
          <h3>Club Memberships</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '8px 0 0', color: 'var(--secondary-color)' }}>4</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex-col gap-6" style={{ gridColumn: 'span 2' }}>
          <h2 className="mb-4">Recent Notices</h2>
          <div className="flex flex-col gap-6 mb-8">
            <NoticeCard
              title="Campus Wifi Maintenance"
              author="IT Services"
              date="Today"
              priority="High"
              content="The main library wifi will be down for maintenance from 2 AM to 4 AM."
            />
            <NoticeCard
              title="Library Hours Extended"
              author="Librarian"
              date="Yesterday"
              content="Library will remain open until midnight during finals week."
            />
          </div>

          <h2 className="mb-4">Upcoming Events</h2>
          <EventCard
            title="Annual Hackathon"
            club="Computer Science Club"
            date="Next Friday"
            tags={['Coding', 'Team']}
            description="Join the 24-hour hackathon and win amazing prizes! Bring your best ideas."
            linkTo="/student/competitions"
          />
        </div>

        <div>
          <div className="card mb-8">
            <h3 className="mb-6 border-b pb-4" style={{ borderColor: 'var(--border-light)' }}>Weekly Schedule</h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)', marginTop: '6px', flexShrink: 0 }}></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '2px' }}>Data Structures Quiz</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Tomorrow at 10:00 AM</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--secondary-color)', marginTop: '6px', flexShrink: 0 }}></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '2px' }}>Photography Club</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Thursday at 4:30 PM</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--tertiary-color)', marginTop: '6px', flexShrink: 0 }}></div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '2px' }}>Hackathon Kickoff</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Friday at 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-6">Quick Links</h3>
            <div className="flex flex-col gap-4">
              <button className="btn btn-outline" style={{ width: '100%' }}>View Grades</button>
              <button className="btn btn-outline" style={{ width: '100%' }}>Campus Map</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
