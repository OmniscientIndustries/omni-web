"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; onError: () => void };

/** Any WebGL/scene failure falls back to the static composition instead of a blank hero. */
export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
