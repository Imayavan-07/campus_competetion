import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  SunIcon, 
  MoonIcon, 
  LogoutIcon 
} from './common/Icons';
import { useAuth } from '../context/AuthContext';

export interface HeaderProps {
  roleLabel?: string;
  userName?: string;
}

export default function Header({
  roleLabel = "Administrator",
  userName = "Ares Mitchell"
}: HeaderProps): React.JSX.Element {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dummyNotifications = [
    { id: 1, title: "New Event Proposal Submitted", desc: "Robotics Club submitted 'RoboWar 2026' for review.", time: "10 mins ago", unread: true },
    { id: 2, title: "Membership Verification", desc: "18 new students completed competition registration.", time: "1 hour ago", unread: true },
    { id: 3, title: "Global Calendar Synchronized", desc: "Auditorium slot confirmed for Oct 24th.", time: "Yesterday", unread: false }
  ];

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <p className="portal-tag">Integrated Portal</p>
          <h2 className="portal-title">{roleLabel} Console</h2>
        </div>
      </div>

      <div className="header-right">
        {/* Dark Mode Switcher */}
        <button 
          onClick={toggleTheme} 
          className="header-icon-btn" 
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <SunIcon className="w-5 h-5 text-amber-500" /> : <MoonIcon className="w-5 h-5" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)} 
          className="header-icon-btn"
          title="Notifications"
        >
          <BellIcon className="w-5 h-5" />
          <span className="header-icon-badge"></span>
        </button>

        <div className="header-divider"></div>

        {/* User Profile Pill */}
        <div 
          className="user-profile-pill"
          onClick={() => alert(`Active User: ${userName || 'User'} (${roleLabel})`)}
          title="View profile settings"
        >
          <div className="user-avatar-box">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info-text">
            <p className="user-name">{userName || (roleLabel === 'Administrator' ? 'Chief Admin' : 'Campus Member')}</p>
            <p className="user-role">{roleLabel}</p>
          </div>
        </div>

        {/* Red Logout Button */}
        <button 
          onClick={handleLogout} 
          className="header-logout-btn" 
          title="Sign out of UniSync"
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications Popover Dropdown */}
      {isNotifOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
            onClick={() => setIsNotifOpen(false)} 
          />
          <div className="notification-dropdown">
            <div className="notification-header">
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Notifications & Alerts</h4>
                <p style={{ fontSize: '0.75rem' }} className="text-muted">Live campus updates</p>
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="btn btn-ghost btn-xs text-blue-600 font-bold"
              >
                Close
              </button>
            </div>

            <div className="notification-list custom-scrollbar">
              {dummyNotifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notification-item ${n.unread ? 'unread' : ''}`}
                >
                  <div style={{ marginTop: '2px' }}>
                    <span className={`inline-block w-2 h-2 rounded-full ${n.unread ? 'bg-blue-600' : 'bg-gray-300 dark:bg-neutral-600'}`}></span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between gap-2">
                      <h5 style={{ fontSize: '0.82rem', fontWeight: 700 }} className="truncate">{n.title}</h5>
                      <span style={{ fontSize: '0.68rem' }} className="text-muted">{n.time}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem' }} className="text-muted mt-1 leading-snug">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
