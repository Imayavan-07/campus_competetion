import React, { useEffect, useRef } from 'react';
import { ClockIcon, ArrowRightIcon } from './Icons';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onConfirm,
}: SessionExpiredModalProps): React.JSX.Element | null {
  const okButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus OK button on open and handle Enter / Escape keypresses
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        okButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          onConfirm();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'unisyncBackdropFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <style>{`
        @keyframes unisyncBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes unisyncModalPop {
          0% {
            opacity: 0;
            transform: scale(0.94) translateY(14px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .unisync-modal-clean {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 
            0 25px 60px -15px rgba(15, 23, 42, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset;
        }
        body.dark-mode .unisync-modal-clean {
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 
            0 25px 70px -15px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset;
        }
        .unisync-clean-title {
          color: #0f172a;
        }
        body.dark-mode .unisync-clean-title {
          color: #f8fafc;
        }
        .unisync-clean-desc {
          color: #64748b;
        }
        body.dark-mode .unisync-clean-desc {
          color: #94a3b8;
        }
        .unisync-clean-btn {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
          box-shadow: 0 10px 24px -4px rgba(37, 99, 235, 0.45);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .unisync-clean-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.58);
          filter: brightness(1.04);
        }
        .unisync-clean-btn:active {
          transform: translateY(0) scale(0.99);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .unisync-clean-btn:focus-visible {
          outline: 3px solid rgba(59, 130, 246, 0.6);
          outline-offset: 2px;
        }
      `}</style>

      {/* Clean Glassmorphic Dialog Shell */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-desc"
        className="unisync-modal-clean"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          overflow: 'hidden',
          animation: 'unisyncModalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          zIndex: 10,
        }}
      >
        {/* Subtle Top Gradient Line */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #3b82f6 100%)',
          }}
        />

        <div style={{ padding: '36px 32px 30px', textAlign: 'center' }}>
          
          {/* Friendly Minimalist Clock Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              margin: '0 auto 20px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #fff7ed 0%, #fee2e2 100%)',
              border: '1.5px solid rgba(254, 202, 202, 0.8)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.2)',
            }}
          >
            <ClockIcon className="w-8 h-8 text-rose-600" />
          </div>

          {/* Heading */}
          <h2
            id="session-expired-title"
            className="unisync-clean-title"
            style={{
              margin: '0 0 10px',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
            }}
          >
            Session Expired
          </h2>

          {/* Simple, polite end-user description */}
          <p
            id="session-expired-desc"
            className="unisync-clean-desc"
            style={{
              margin: '0 0 28px',
              fontSize: '0.925rem',
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            Your session has timed out due to inactivity. Please sign in again to continue.
          </p>

          {/* Prominent OK Button */}
          <button
            ref={okButtonRef}
            id="btn-session-expired-ok"
            onClick={onConfirm}
            className="unisync-clean-btn"
            style={{
              width: '100%',
              padding: '14px 24px',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>OK</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </button>

          {/* Micro hint */}
          <p
            style={{
              margin: '12px 0 0',
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontWeight: 500,
            }}
          >
            Press Enter or click OK to sign in
          </p>

        </div>
      </div>
    </div>
  );
}
