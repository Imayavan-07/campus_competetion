import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldIcon, SparklesIcon } from './common/Icons';

export interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps {
  brandName?: string;
  subtitle?: string;
  sections?: NavSection[];
  links?: NavItem[];
}

export default function Sidebar({
  brandName = "UniSync",
  subtitle = "Campus Platform",
  sections = [],
  links = []
}: SidebarProps): React.JSX.Element {
  // Normalize links if passed as flat array
  const menuSections: NavSection[] = sections.length > 0 ? sections : [
    {
      title: "Menu",
      items: links
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-logo">
          <ShieldIcon className="w-6 h-6" />
        </div>
        <div className="sidebar-brand-text">
          <h2>{brandName}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      {/* Portal Navigation */}
      <nav className="sidebar-nav custom-scrollbar">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-section">
            {section.title && (
              <p className="sidebar-section-title">{section.title}</p>
            )}
            <ul className="sidebar-links">
              {section.items.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <li key={idx}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                      end={item.exact}
                    >
                      {IconComp && <IconComp className="w-5 h-5" />}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Info Widget */}
      <div className="sidebar-footer">
        <div className="sidebar-badge-card">
          <div className="flex items-center gap-1.5 badge-tag">
            <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus OS v2.4</span>
          </div>
          <p className="footer-subtext">Verified University Node</p>
        </div>
      </div>
    </aside>
  );
}
