import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ApiClientError } from "@/shared/api/types";
import { cn } from "@/shared/lib/utils";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyIcon?: React.ComponentProps<typeof EmptyState>["icon"];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRetry?: () => void;
  skeleton?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashboardWidget({
  title,
  description,
  isLoading = false,
  error,
  isEmpty = false,
  emptyIcon,
  emptyTitle = "No data available",
  emptyDescription = "There is nothing to show right now.",
  emptyAction,
  onRetry,
  skeleton,
  className,
  children,
}: DashboardWidgetProps) {
  const apiError = error instanceof ApiClientError ? error : null;

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        {isLoading ? (
          skeleton ?? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )
        ) : null}

        {!isLoading && apiError ? (
          <div className="flex flex-1 flex-col justify-center gap-3 py-4">
            <p className="text-sm text-destructive">{apiError.message}</p>
            {onRetry ? (
              <Button variant="outline" size="sm" className="w-fit" onClick={onRetry}>
                <RefreshCw className="size-3.5" />
                Retry
              </Button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !apiError && error ? (
          <p className="py-4 text-sm text-destructive">
            An unexpected error occurred while loading this widget.
          </p>
        ) : null}

        {!isLoading && !error && isEmpty ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className="py-10"
          />
        ) : null}

        {!isLoading && !error && !isEmpty ? children : null}
      </CardContent>
    </Card>
  );
}
