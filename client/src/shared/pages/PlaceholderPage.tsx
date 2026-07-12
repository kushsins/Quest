import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Coming in a later milestone</CardTitle>
          <CardDescription>
            This route is wired for navigation only. Business logic arrives in a
            future milestone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to move between Dashboard, Tickets, and the system
            status page at the home route.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
