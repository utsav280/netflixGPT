import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.08)_0%,_transparent_70%)] pointer-events-none" />

          {/* Icon */}
          <div className="text-6xl mb-6">🎬</div>

          <h1 className="text-white text-3xl font-black mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-base mb-8 max-w-md">
            We hit an unexpected error. Try refreshing the page — your watchlist
            is safely saved.
          </p>

          {/* Error details (dev only) */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="text-red-400 text-xs text-left bg-white/5 border border-red-500/20 rounded-xl p-4 mb-8 max-w-lg overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
