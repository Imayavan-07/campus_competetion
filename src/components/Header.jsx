import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ roleLabel }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <header className="header">
      <div>
        <h3 style={{ margin: 0, fontWeight: 600 }}>{roleLabel} Portal</h3>
      </div>
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '1rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Simple role switcher for demo purposes */}
        <div className="flex gap-2">
          <Link to="/student" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Student</Link>
          <Link to="/club" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Club</Link>
          <Link to="/admin" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Admin</Link>
        </div>
        <div style={{ width: '40px', height: '40px', background: 'var(--card-edge)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          U
        </div>
      </div>
    </header>
  );
}
