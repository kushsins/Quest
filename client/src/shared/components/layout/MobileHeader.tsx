import { QuestLogo } from "@/shared/components/layout/QuestLogo";
import { MobileMenuButton } from "@/shared/components/layout/MobileMenuButton";

/**
 * Persistent top bar shown only on mobile.
 * Matches the sidebar's glass visual language so branding is always
 * visible even when the drawer is closed.
 */
export function MobileHeader() {
  return (
    <header className="glass-floating mb-[var(--layout-gap)] flex shrink-0 items-center justify-between px-4 py-3">
      <QuestLogo />
      <MobileMenuButton />
    </header>
  );
}
