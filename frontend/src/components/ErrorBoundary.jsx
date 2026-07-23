import { Component } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Catches any render-time error anywhere below it in the tree and shows a
 * friendly recovery screen instead of an unhandled blank white page (React
 * unmounts the whole tree on an uncaught render error by default).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("CineMatch crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </span>
          <h1 className="font-display text-2xl font-extrabold">Something went wrong</h1>
          <p className="max-w-md text-sm text-white/55">
            CineMatch hit an unexpected error. This has been logged to the console — reloading
            usually fixes it.
          </p>
          <button onClick={this.handleReset} className="btn-primary mt-2 text-sm">
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
