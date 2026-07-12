import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/shared/components/layout/AppLayout";
import { HealthStatus } from "@/features/health/components/HealthStatus";
import { SidebarProvider } from "@/shared/hooks/useSidebar";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { PlaceholderPage } from "@/shared/pages/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SidebarProvider>
        <AppLayout />
      </SidebarProvider>
    ),
    children: [
      {
        index: true,
        element: <HealthStatus />,
      },
      {
        path: "dashboard",
        element: (
          <PlaceholderPage
            title="Dashboard"
            description="Overview statistics and recent activity will appear here."
          />
        ),
      },
      {
        path: "tickets",
        element: (
          <PlaceholderPage
            title="Tickets"
            description="Ticket workspace will appear here."
          />
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
