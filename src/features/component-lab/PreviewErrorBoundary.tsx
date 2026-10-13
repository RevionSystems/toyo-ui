import Alert from '@mui/material/Alert';
import { Component, type ReactNode } from 'react';

interface State {
  error?: Error;
}

/** Keeps a broken preview configuration from taking down the whole lab. */
export class PreviewErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: undefined });
  }

  render() {
    if (this.state.error) {
      return (
        <Alert severity="error" sx={{ width: '100%' }}>
          The preview failed to render with this configuration: {this.state.error.message}
        </Alert>
      );
    }
    return this.props.children;
  }
}
