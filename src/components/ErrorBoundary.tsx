import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled FreeCanvas UI Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#F8F3EC',
            color: '#30312D',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: 24,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFEFA',
              border: '1px solid #E8DED2',
              borderRadius: 20,
              padding: '36px 32px',
              maxWidth: 460,
              boxShadow: '0 12px 36px -4px rgba(70, 60, 45, 0.1)'
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12, color: '#4F543C' }}>
              Something interrupted your canvas
            </h2>
            <p style={{ fontSize: 14, color: '#79766F', marginBottom: 24, lineHeight: 1.5 }}>
              Your creative work was preserved in auto-save. Click below to refresh and resume where you left off.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                backgroundColor: '#777D5E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#676C4F')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#777D5E')}
            >
              Reload Canvas
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
