import type { ReactElement, ReactNode } from "react";

import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

/**
 * Wrapper component that provides a MemoryRouter, needed by components and
 * hooks that rely on react-router (useSearchParams, Navigate, etc.).
 */
export function createRouterWrapper(initialEntries: string[] = ["/"]) {
  return function RouterWrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  };
}

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
}

/**
 * Renders a component inside a MemoryRouter. Use for components that read
 * routing context but do not need to be mounted through <Routes>.
 */
export function renderWithRouter(
  ui: ReactElement,
  { initialEntries = ["/"], ...options }: RenderWithRouterOptions = {},
) {
  return render(ui, {
    wrapper: createRouterWrapper(initialEntries),
    ...options,
  });
}
