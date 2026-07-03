"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  context?: string;
}

/**
 * Global React Error Boundary.
 * Catches any uncaught client-side errors and displays a user-friendly message
 * instead of crashing the entire page. Use it to wrap page sections or whole pages.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `err_${Date.now().toString(36)}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { context = "unknown", onError } = this.props;
    // Structured error log
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        context: `ErrorBoundary:${context}`,
        errorId: this.state.errorId,
        message: error.message,
        componentStack: errorInfo.componentStack,
      })
    );

    onError?.(error, errorInfo);
    // TODO: Forward to Sentry when integrated
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) return <>{fallback}</>;

      return (
        <div className="flex min-h-72 flex-col items-center justify-center radius-lg border border-destructive/20 bg-destructive/5 p-space-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center radius-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mt-space-4 text-body-md  text-foreground">
            Something went wrong
          </h3>
          <p className="mt-space-2 max-w-md text-body-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred in this section. Our team has been notified.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <pre className="mt-space-4 max-w-full overflow-auto rounded bg-card p-space-3 text-caption text-destructive text-left">
              {error.message}
            </pre>
          )}
          {errorId && (
            <p className="mt-space-2 font-mono text-caption text-muted-foreground/60">
              Error ID: {errorId}
            </p>
          )}
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="mt-space-6 gap-space-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      );
    }

    return <>{children}</>;
  }
}
