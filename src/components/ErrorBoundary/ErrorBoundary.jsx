import React from "react";
import PropTypes from "prop-types";
import { HiExclamationCircle } from "react-icons/hi";

/**
 * Top-level error boundary: catches render-time crashes anywhere in the
 * tree and offers a friendly recovery UI instead of a white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real app this would report to an error-tracking service.
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="panel w-full max-w-md rounded-3xl p-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/50">
              <HiExclamationCircle
                className="h-6 w-6"
                aria-hidden="true"
              />
            </span>
            <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mt-2 break-words text-sm text-slate-400">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-ghost">
                Try again
              </button>
              <a href="/" className="btn-primary">
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
