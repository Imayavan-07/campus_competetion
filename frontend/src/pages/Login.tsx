import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldIcon,
  UsersIcon,
  TrophyIcon,
  ArrowRightIcon,
  MailIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  SparklesIcon
} from '../components/common/Icons';

export default function Login() {
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [activePersona, setActivePersona] = useState('student');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const lower = email.toLowerCase();
    if (lower.includes('admin')) {
      navigate('/admin');
    } else if (lower.includes('club') || lower.includes('coord')) {
      navigate('/club');
    } else {
      navigate('/student');
    }
  };

  const handleSelectPersona = (role) => {
    setActivePersona(role);
    if (role === 'admin') {
      setEmail('admin@university.edu');
      setPassword('admin_pass_2026');
      navigate('/admin');
    } else if (role === 'club') {
      setEmail('club.lead@university.edu');
      setPassword('club_pass_2026');
      navigate('/club');
    } else {
      setEmail('student@university.edu');
      setPassword('student_pass_2026');
      navigate('/student');
    }
  };

  return (
    <div className="auth-viewport">
      {/* Enhanced Subtle Blue & Green Void Background (Light Mode) */}
      <div className="auth-void-bg" aria-hidden="true">
        <div className="void-ambient-mesh" />
        <div className="void-glow-orb void-orb-blue" />
        <div className="void-glow-orb void-orb-green" />
        <div className="void-glow-orb void-orb-center" />
        <div className="void-portal-core" />
        <div className="void-core-inner-glow" />

        <div className="void-rings-wrapper">
          {/* Primary Concentric Resonance Rings */}
          <svg className="void-rings-svg-primary" viewBox="0 0 800 800" fill="none">
            <defs>
              <linearGradient id="voidBlueGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#16A34A" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="voidGreenBlueGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Concentric rings */}
            <circle cx="400" cy="400" r="75" stroke="url(#voidBlueGreenGrad)" strokeWidth="1" strokeDasharray="3 5" />
            <circle cx="400" cy="400" r="140" stroke="url(#voidGreenBlueGrad)" strokeWidth="1.2" strokeOpacity="0.8" />
            <circle cx="400" cy="400" r="215" stroke="url(#voidBlueGreenGrad)" strokeWidth="1" strokeDasharray="6 8" />
            <circle cx="400" cy="400" r="295" stroke="url(#voidGreenBlueGrad)" strokeWidth="1.3" strokeDasharray="8 6" strokeOpacity="0.75" />
            <circle cx="400" cy="400" r="375" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="4 10" strokeOpacity="0.12" />

            {/* Cardinal telemetry alignment tick marks */}
            <line x1="400" y1="20" x2="400" y2="40" stroke="#1D4ED8" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="400" y1="760" x2="400" y2="780" stroke="#16A34A" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="20" y1="400" x2="40" y2="400" stroke="#16A34A" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="760" y1="400" x2="780" y2="400" stroke="#1D4ED8" strokeWidth="1.5" strokeOpacity="0.25" />

            {/* Orbiting Stardust Nodes */}
            <circle cx="400" cy="185" r="3" fill="#16A34A" fillOpacity="0.4" />
            <circle cx="400" cy="615" r="3" fill="#1D4ED8" fillOpacity="0.4" />
            <circle cx="615" cy="400" r="3.5" fill="#3b82f6" fillOpacity="0.35" />
            <circle cx="185" cy="400" r="3.5" fill="#16A34A" fillOpacity="0.35" />
          </svg>

          {/* 3D Gyroscopic Inclined Elliptical Orbit Paths (Counter-Rotating) */}
          <svg className="void-rings-svg-inclined" viewBox="0 0 800 800" fill="none">
            <ellipse
              cx="400"
              cy="400"
              rx="330"
              ry="175"
              stroke="#1D4ED8"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              strokeOpacity="0.18"
              transform="rotate(-28 400 400)"
            />
            <ellipse
              cx="400"
              cy="400"
              rx="250"
              ry="130"
              stroke="#16A34A"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.16"
              transform="rotate(32 400 400)"
            />
            {/* Inclined Orbit Nodes */}
            <circle cx="680" cy="400" r="3" fill="#1D4ED8" fillOpacity="0.4" transform="rotate(-28 400 400)" />
            <circle cx="120" cy="400" r="3" fill="#16A34A" fillOpacity="0.4" transform="rotate(-28 400 400)" />
          </svg>
        </div>

        <div className="void-perspective-plane" />
      </div>

      {/* Main Foreground Stage - Fits 100vh Without Scroll */}
      <div className="auth-stage">
        
        {/* LEFT COLUMN: 3D Glassmorphic Brand Showcase */}
        <div className="auth-hero-column">
          {/* Brand Insignia Pill */}
          <div className="auth-brand-pill">
            <div className="brand-icon-box">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-slate-900">UniSync</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                Campus OS
              </span>
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="auth-hero-title">
            Next-Generation <span className="highlight-blue">Campus</span> Governance & <span className="highlight-green">Competitions</span>.
          </h1>

          {/* Subtitle */}
          <p className="auth-hero-desc">
            Empowering students, faculty coordinators, and club executives with synchronized schedules, competitive tournaments, and instant digital approvals.
          </p>

          {/* Straight 3D Glass Feature Matrix (No Slants) */}
          <div className="auth-feature-matrix">
            <div className="auth-glass-feature-card card-blue">
              <div className="auth-glass-feature-icon icon-box-blue">
                <ShieldIcon className="w-4 h-4" />
              </div>
              <div className="auth-glass-feature-title">Vault SSO</div>
              <div className="auth-glass-feature-desc">256-Bit campus directory auth</div>
            </div>

            <div className="auth-glass-feature-card card-green">
              <div className="auth-glass-feature-icon icon-box-green">
                <CheckIcon className="w-4 h-4" />
              </div>
              <div className="auth-glass-feature-title">Governance</div>
              <div className="auth-glass-feature-desc">Real-time digital approvals</div>
            </div>

            <div className="auth-glass-feature-card card-amber">
              <div className="auth-glass-feature-icon icon-box-amber">
                <TrophyIcon className="w-4 h-4" />
              </div>
              <div className="auth-glass-feature-title">Tournaments</div>
              <div className="auth-glass-feature-desc">Varsity brackets & grants</div>
            </div>
          </div>

          {/* Live Telemetry Dock */}
          <div className="auth-telemetry-dock">
            <div className="telemetry-item">
              <span className="telemetry-dot blue" />
              <span><strong className="text-slate-800 font-bold">45</strong> Clubs</span>
            </div>
            <div className="telemetry-divider" />
            <div className="telemetry-item">
              <span className="telemetry-dot green" />
              <span><strong className="text-slate-800 font-bold">3,400+</strong> Students</span>
            </div>
            <div className="telemetry-divider" />
            <div className="telemetry-item">
              <span className="telemetry-dot amber" />
              <span><strong className="text-slate-800 font-bold">100%</strong> Digital</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Glassmorphic Authentication Card (Straight Placement) */}
        <div className="auth-card-column">
          <div className="auth-glass-card">
            
            {/* Card Header */}
            <div className="auth-card-header">
              <div className="auth-gateway-badge">
                <span className="auth-pulse-dot" />
                <span>Single Sign-On Gateway</span>
              </div>
              <h2 className="auth-card-title">Sign In to UniSync</h2>
              <p className="auth-card-subtitle">
                Authenticate with university ID or select a verified demo persona.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              {/* University Email Input */}
              <div className="auth-input-group">
                <label className="auth-input-label">
                  <span className="auth-input-label-left">
                    <MailIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>University Email</span>
                  </span>
                </label>
                <input
                  type="email"
                  className="auth-glass-input"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="auth-input-group">
                <div className="auth-input-label">
                  <span className="auth-input-label-left">
                    <LockClosedIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Password</span>
                  </span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Password recovery link dispatched to student inbox.'); }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 transition-colors normal-case tracking-normal font-semibold hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="auth-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-glass-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Enter Portal Submit Button */}
              <button type="submit" className="auth-submit-btn">
                <span>Enter University Portal</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>

            {/* Quick-Switch Persona Dock */}
            <div className="auth-persona-dock">
              <p className="persona-dock-label">
                Instant Demo Personas
              </p>
              <div className="persona-buttons-grid">
                <button
                  type="button"
                  onClick={() => handleSelectPersona('admin')}
                  className={`persona-btn btn-admin ${activePersona === 'admin' ? 'ring-1 ring-blue-500' : ''}`}
                  title="Authenticate as Campus Chief Administrator"
                >
                  <span className="font-extrabold text-slate-800">Chief Admin</span>
                  <span className="persona-role-tag text-blue-600">Governance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPersona('student')}
                  className={`persona-btn btn-student ${activePersona === 'student' ? 'ring-1 ring-emerald-500' : ''}`}
                  title="Authenticate as University Student"
                >
                  <span className="font-extrabold text-slate-800">Student</span>
                  <span className="persona-role-tag text-emerald-600">Competitions</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPersona('club')}
                  className={`persona-btn btn-club ${activePersona === 'club' ? 'ring-1 ring-amber-500' : ''}`}
                  title="Authenticate as Club Coordinator / Executive"
                >
                  <span className="font-extrabold text-slate-800">Club Lead</span>
                  <span className="persona-role-tag text-amber-600">Operations</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
