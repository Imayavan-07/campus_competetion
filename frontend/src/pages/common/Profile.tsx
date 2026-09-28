import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldIcon, 
  ArrowLeftIcon, 
  EditIcon, 
  CheckIcon, 
  MailIcon, 
  PhoneIcon, 
  BuildingIcon, 
  AcademicCapIcon, 
  ClubsIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  UserCircleIcon,
  CalendarIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function UserProfile(): React.JSX.Element {
  const { user, updateUser, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dept: user?.dept || '',
    assigned_club: user?.assigned_club || '',
  });

  // Keep edit form in sync with user state
  useEffect(() => {
    if (user) {
      setEditFormData({
        name: user.name || '',
        phone: user.phone || '',
        dept: user.dept || '',
        assigned_club: user.assigned_club || '',
      });
    }
  }, [user]);

  // Refresh user data from server on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleBackToDashboard = () => {
    const role = user?.role || 'admin';
    navigate(`/${role}`);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await refreshUser();
    setTimeout(() => {
      setLoading(false);
      showToast('Profile data synchronized from directory', 'success');
    }, 350);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      showToast('Full Legal Name is required', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.updateProfile(editFormData);
      if (res.user) {
        updateUser(res.user);
        showToast(res.message || 'Profile updated successfully!', 'success');
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update member profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Role metadata
  const roleMeta = {
    admin: {
      title: 'Chief Administrator',
      badgeColor: '#7c3aed',
      badgeBg: 'rgba(124, 58, 237, 0.1)',
      tier: 'Tier 1 • Central Governance',
    },
    club: {
      title: 'Club Coordinator',
      badgeColor: '#ea580c',
      badgeBg: 'rgba(234, 88, 12, 0.1)',
      tier: 'Tier 2 • Executive Leadership',
    },
    student: {
      title: 'Student Participant',
      badgeColor: '#16a34a',
      badgeBg: 'rgba(22, 163, 74, 0.1)',
      tier: 'Tier 3 • Campus Competitor',
    }
  }[user?.role || 'admin'];

  const formattedCreatedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'September 2026';

  return (
    <div className="profile-page-wrapper" style={{ paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Header Navigation & Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button 
          onClick={handleBackToDashboard}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Refresh latest data from database"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <EditIcon className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Dynamic Gradient Hero Profile Header Card */}
      <div 
        style={{
          padding: '30px 34px',
          marginBottom: '26px',
          borderRadius: '22px',
          boxShadow: '0 20px 45px -12px rgba(29, 78, 216, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 75%, #3b82f6 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background watermarks */}
        <div 
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          
          {/* Avatar and Identity Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            
            {/* Avatar Squircle with Online Indicator */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div 
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.35)',
                  border: '3.5px solid rgba(255, 255, 255, 0.95)',
                }}
              >
                {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
              </div>
              
              {/* Online indicator */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '3px solid #1e3a8a',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.9)',
                }}
                title="Active Account"
              />
            </div>

            {/* Name, Role & Email */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.025em', color: '#ffffff', textShadow: '0 2px 6px rgba(0, 0, 0, 0.25)' }}>
                  {user?.name || 'Chief Administrator'}
                </h1>
                
                {/* Frosted Glass Role Pill Badge */}
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    letterSpacing: '0.02em',
                  }}
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
                  {roleMeta.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MailIcon className="w-4 h-4 text-blue-200" />
                  <span>{user?.email || 'admin@university.edu'}</span>
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <AcademicCapIcon className="w-4 h-4 text-indigo-200" />
                  <span>{user?.dept || 'Central Administration'}</span>
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#86efac', fontWeight: 600 }}>
                  <ShieldIcon className="w-4 h-4 text-emerald-300" />
                  <span>Verified Institutional Member</span>
                </span>
              </div>
            </div>

          </div>

          {/* Quick Frosted Badges on the right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div 
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.75)', display: 'block', fontWeight: 700, marginBottom: '2px' }}>
                Onboarding ID
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#ffffff' }}>
                #UNISYNC-00{user?.id || 1}
              </span>
            </div>

            <div 
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.75)', display: 'block', fontWeight: 700, marginBottom: '2px' }}>
                Account Status
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <CheckIcon className="w-4 h-4 text-emerald-300" />
                {user?.status || 'Active'}
              </span>
            </div>
          </div>

        </div>
      </div>


      {/* Full-Width Member Onboarding Details Grid */}
      <div 
        className="card"
        style={{
          padding: '28px 32px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main, #0f172a)' }}>
              Member Onboarding Details
            </h2>
            <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-muted, #64748b)' }}>
              Official institutional record and identity attributes established during member registration
            </p>
          </div>

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <EditIcon className="w-3.5 h-3.5" />
            <span>Update Details</span>
          </button>
        </div>

        {/* 3-Column Balanced Details Grid Occupying Entire Space */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Tile 1: Full Legal Name */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <UserCircleIcon className="w-4 h-4 text-blue-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Full Legal Name
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                {user?.name || 'Chief Administrator'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
              ✓ Verified Identity on Record
            </div>
          </div>

          {/* Tile 2: Assigned Role */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldIcon className="w-4 h-4 text-purple-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Assigned Institutional Role
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                {roleMeta.title}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: roleMeta.badgeColor, fontWeight: 700 }}>
              {roleMeta.tier}
            </div>
          </div>

          {/* Tile 3: University Email */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MailIcon className="w-4 h-4 text-amber-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  University Email Address
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', wordBreak: 'break-all' }}>
                {user?.email || 'admin@university.edu'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Primary SSO Authentication Login
            </div>
          </div>

          {/* Tile 4: Direct Contact Phone */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <PhoneIcon className="w-4 h-4 text-emerald-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Direct Contact Phone
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', fontFamily: 'monospace' }}>
                {user?.phone || '+1 (555) 987-4321'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Verified Mobile / Emergency Contact
            </div>
          </div>

          {/* Tile 5: Academic Department */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AcademicCapIcon className="w-4 h-4 text-indigo-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Academic Department
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                {user?.dept || 'Central Administration'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Faculty / Departmental Affiliation
            </div>
          </div>

          {/* Tile 6: Assigned Club / Organization */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ClubsIcon className="w-4 h-4 text-blue-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Assigned Club / Organization
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                {user?.assigned_club || (user?.role === 'admin' ? 'Central Governance (All Clubs)' : 'Independent Student')}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Campus Activity Unit
            </div>
          </div>

          {/* Tile 7: Membership Status */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Membership Account Status
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                {user?.status || 'Active'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
              Full Operational Campus Access
            </div>
          </div>

          {/* Tile 8: Onboarding Enrollment Date */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CalendarIcon className="w-4 h-4 text-rose-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Onboarding Enrollment Date
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                {formattedCreatedDate}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Established Directory Record
            </div>
          </div>

          {/* Tile 9: Campus Registry ID */}
          <div 
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'var(--bg-canvas, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BuildingIcon className="w-4 h-4 text-blue-600" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', letterSpacing: '0.05em' }}>
                  Campus Registry ID
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary-color, #1d4ed8)' }}>
                #UNISYNC-00{user?.id || 1}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
              Unique University Member Key
            </div>
          </div>

        </div>

        {/* Bottom Verification Footer Strip */}
        <div 
          style={{
            marginTop: '24px',
            padding: '14px 20px',
            borderRadius: '14px',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldIcon className="w-5 h-5 text-blue-600" />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color, #1d4ed8)' }}>
                Official Campus Directory Record
              </span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted, #64748b)' }}>
                Institutional onboarding credentials securely verified under university governance protocols
              </p>
            </div>
          </div>

          <span 
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#16a34a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckIcon className="w-4 h-4" />
            Active & Verified
          </span>
        </div>

      </div>

      {/* MODAL: Edit Profile Record */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Member Onboarding Dossier"
        subtitle="Update legal name, direct contact phone, and campus affiliation records"
        size="md"
        footer={
          <>
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="btn btn-primary" 
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile}>
          
          {/* Row 1: Full Name */}
          <div className="form-group mb-4">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              placeholder="e.g. Chief Administrator"
              required
            />
          </div>

          {/* Row 2: Phone Number & Department */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Direct Contact Phone</label>
              <input
                type="tel"
                className="form-input font-mono"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                placeholder="+1 (555) 987-4321"
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Academic Department</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.dept}
                onChange={(e) => setEditFormData({ ...editFormData, dept: e.target.value })}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          {/* Row 3: Assigned Club / Organization */}
          <div className="form-group mb-4">
            <label className="form-label">Assigned Club / Governance Unit</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.assigned_club}
              onChange={(e) => setEditFormData({ ...editFormData, assigned_club: e.target.value })}
              placeholder="e.g. Robotics Society or Central Governance"
            />
          </div>

          {/* Readonly: University Email & Role */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 text-xs text-muted">
            <div>
              <span className="font-bold block text-gray-500">University Email:</span>
              <span className="font-mono">{user?.email}</span>
            </div>
            <div>
              <span className="font-bold block text-gray-500">Security Clearance:</span>
              <span>{roleMeta.title} ({roleMeta.tier})</span>
            </div>
          </div>

        </form>
      </Modal>

    </div>
  );
}
