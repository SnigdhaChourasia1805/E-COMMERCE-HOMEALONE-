import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600">Something went wrong: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
