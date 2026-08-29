import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-phase errors so one broken page shows a recoverable panel
 * instead of blanking the whole app. Still has to be a class component —
 * there is no hook equivalent.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Render error:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="card max-w-md p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-hard/10 text-lg text-hard">
            !
          </div>
          <h1 className="text-base font-semibold text-content">This page hit an error</h1>
          <p className="mt-1.5 text-sm text-content-muted">{this.state.error.message}</p>
          <div className="mt-5 flex justify-center gap-2">
            <Button onClick={() => this.setState({ error: null })}>Try again</Button>
            <Button variant="primary" onClick={() => window.location.assign('/')}>
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
