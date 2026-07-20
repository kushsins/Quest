import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginLayout } from "@/features/auth/components/LoginLayout";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { HealthStatus } from "@/features/health/components/HealthStatus";
import { TicketsLayout } from "@/features/tickets/components/TicketsLayout";
import { AuthGate } from "@/shared/components/auth/AuthGate";
import { GuestRoute } from "@/shared/components/auth/GuestRoute";
import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { SidebarProvider } from "@/shared/hooks/useSidebar";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    ),
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <LoginLayout />,
            children: [
              {
                path: "/login",
                element: <LoginPage />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <SidebarProvider>
                <AppLayout />
              </SidebarProvider>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <DashboardPage />,
              },
              {
                path: "health",
                element: <HealthStatus />,
              },
              {
                path: "tickets",
                element: <TicketsLayout />,
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
