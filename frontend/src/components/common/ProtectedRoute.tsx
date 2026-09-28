import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Array<'admin' | 'club' | 'student'>;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps): React.JSX.Element {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-main, #f8fafc)',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.02em',
          }}
        >
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  // 1. Authentication Check: must be logged in with active token
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authorization Check: user must possess one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    let fallbackPath = '/student';
    if (user.role === 'admin') fallbackPath = '/admin';
    else if (user.role === 'club') fallbackPath = '/club';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
