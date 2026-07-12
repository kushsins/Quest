import { RefreshCw } from "lucide-react";

import { useHealth } from "@/features/health/hooks/useHealth";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ApiClientError } from "@/shared/api/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

function StatusBadge({
  label,
  healthy,
}: {
  label: string;
  healthy: boolean;
}) {
  return (
    <Badge variant={healthy ? "success" : "destructive"}>
      {label}: {healthy ? "Healthy" : "Unavailable"}
    </Badge>
  );
}

export function HealthStatus() {
  const { data, error, isLoading, isFetching, refetch } = useHealth();

  const apiError = error instanceof ApiClientError ? error : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Status"
        description="Milestone 1 integration check against the Quest backend health endpoint."
        action={
          <Button
            variant="outline"
            onClick={() => {
              void refetch();
            }}
            disabled={isFetching}
          >
            <RefreshCw className={isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Backend Connectivity</CardTitle>
          <CardDescription>
            Verifies communication with `GET /api/v1/health`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : null}

          {!isLoading && data ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge label="API" healthy />
                <StatusBadge label="Database" healthy={data.database} />
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="glass-subtle rounded-xl p-4">
                  <p className="text-muted-foreground">Service status</p>
                  <p className="mt-1 font-medium capitalize text-foreground">
                    {data.status}
                  </p>
                </div>
                <div className="glass-subtle rounded-xl p-4">
                  <p className="text-muted-foreground">Last checked</p>
                  <p className="mt-1 font-medium text-foreground">
                    {new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Frontend successfully communicated with the backend.
              </p>
            </div>
          ) : null}

          {!isLoading && apiError ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive">
                  HTTP {apiError.statusCode}
                </Badge>
                <Badge variant="destructive">Connection failed</Badge>
              </div>
              <p className="text-sm text-destructive">{apiError.message}</p>
              <p className="text-sm text-muted-foreground">
                Ensure the backend is running on port 3000 and PostgreSQL is
                available.
              </p>
            </div>
          ) : null}

          {!isLoading && error && !apiError ? (
            <p className="text-sm text-destructive">
              An unexpected error occurred while checking backend health.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
