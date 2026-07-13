import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/utils";

interface QuestLogoProps {
  className?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  variant?: "default" | "inverse";
  asLink?: boolean;
}

export function QuestLogo({
  className,
  collapsed = false,
  onNavigate,
  variant = "default",
  asLink = true,
}: QuestLogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center transition-shadow",
          variant === "inverse"
            ? "size-9"
            : "size-9 rounded-xl bg-primary/15 text-primary glow-primary-soft ring-1 ring-primary/20 group-hover:glow-primary",
        )}
      >
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className={cn(
            "object-contain",
            variant === "inverse" ? "size-8" : "size-[1.125rem]",
          )}
        />
      </span>
      {!collapsed ? (
        <span
          className={cn(
            "text-[1.125rem] font-bold tracking-tight",
            variant === "inverse" ? "text-white" : "text-foreground",
          )}
        >
          Quest
        </span>
      ) : null}
    </>
  );

  const rootClassName = cn(
    "group flex items-center gap-2.5 transition-opacity",
    asLink && "hover:opacity-90",
    collapsed && "justify-center",
    className,
  );

  if (!asLink) {
    return <div className={rootClassName}>{content}</div>;
  }

  return (
    <Link to="/" onClick={onNavigate} className={rootClassName}>
      {content}
    </Link>
  );
}
