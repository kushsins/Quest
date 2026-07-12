import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/utils";

interface QuestLogoProps {
  className?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function QuestLogo({
  className,
  collapsed = false,
  onNavigate,
}: QuestLogoProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-2.5 transition-opacity hover:opacity-90",
        collapsed && "justify-center",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary glow-primary-soft ring-1 ring-primary/20 transition-shadow group-hover:glow-primary">
        <Sparkles className="size-[1.125rem]" />
      </span>
      {!collapsed ? (
        <span className="text-[1.125rem] font-bold tracking-tight text-foreground">
          Quest
        </span>
      ) : null}
    </Link>
  );
}
