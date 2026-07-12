import { Menu } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useSidebar } from "@/shared/hooks/useSidebar";

export function MobileMenuButton() {
  const { viewport, toggleMobile } = useSidebar();

  if (viewport !== "mobile") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="glass-subtle shrink-0 rounded-xl"
      onClick={toggleMobile}
      aria-label="Open navigation menu"
    >
      <Menu className="size-5" />
    </Button>
  );
}
