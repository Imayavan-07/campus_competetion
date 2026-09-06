import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ brandName, links }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div style={{ width: '32px', height: '32px', background: 'var(--primary-color)', borderRadius: '8px' }}></div>
        {brandName}
      </div>
      <nav className="nav-links">
        {links.map((link, idx) => (
          <NavLink 
            key={idx} 
            to={link.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={link.exact}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
