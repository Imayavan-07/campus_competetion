import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '32px',
          maxWidth: '800px',
          margin: '40px auto',
          background: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          border: '1px solid #fee2e2',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.08)',
          fontFamily: 'inherit'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
                {this.props.fallbackTitle || 'Dashboard Display Error'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                An unexpected runtime error was caught safely.
              </p>
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            color: '#991b1b',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '13px',
            lineHeight: '1.5',
            fontFamily: 'monospace',
            marginBottom: '16px',
            border: '1px solid #fecaca'
          }}>
            {this.state.error?.message || this.state.error?.toString()}
          </div>

          {this.state.errorInfo?.componentStack && (
            <details style={{ marginBottom: '16px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#4b5563', fontWeight: 700 }}>
                View Component Stack Trace
              </summary>
              <pre style={{
                background: '#f9fafb',
                color: '#374151',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '11px',
                overflowX: 'auto',
                marginTop: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
              }}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Try Recovering
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
