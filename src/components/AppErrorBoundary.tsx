import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  failed: boolean;
};

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("YNX application render failed", error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-ink">
        <section className="w-full max-w-xl rounded-[2rem] border border-line bg-white p-8 shadow-xl shadow-klein/10">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-klein">Page recovery</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">The page could not update safely.</h1>
          <p className="mt-4 leading-7 text-muted">
            A browser extension may have modified this page. Reload to restore the original English interface.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-full bg-klein px-6 py-3 font-semibold text-white transition-colors hover:bg-klein-dark"
          >
            Reload page
          </button>
        </section>
      </main>
    );
  }
}
