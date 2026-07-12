import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <PageHeader
        title="Page not found"
        description="The page you requested does not exist."
      />
      <Button asChild>
        <Link to="/">Back to system status</Link>
      </Button>
    </div>
  );
}
