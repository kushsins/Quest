import { cn } from "@/shared/lib/utils";
import { useSidebar } from "@/shared/hooks/useSidebar";

export function SidebarBackdrop() {
  const { viewport, isMobileOpen, closeMobile } = useSidebar();

  if (viewport !== "mobile") {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Close navigation menu"
      className={cn(
        "overlay-transition fixed inset-0 z-40 backdrop-blur-[2px] md:hidden",
        isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={closeMobile}
    />
  );
}
