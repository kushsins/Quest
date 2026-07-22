import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";

const useAuthMock = vi.fn();

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => useAuthMock() as unknown,
}));

function renderProtectedTree() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected content</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it("renders nothing while auth is initializing", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isInitializing: true,
    });

    renderProtectedTree();

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects to /login when unauthenticated", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
    });

    renderProtectedTree();

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders the protected outlet when authenticated", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isInitializing: false,
    });

    renderProtectedTree();

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
