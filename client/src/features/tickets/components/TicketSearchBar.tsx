import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface TicketSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TicketSearchBar({
  value,
  onChange,
  className,
}: TicketSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Search tickets by ID, title or description..."
        className="h-11 rounded-xl border-[var(--glass-border-subtle)] bg-[var(--glass-surface-subtle)] py-2 pl-9 pr-14"
      />
      <button
        type="button"
        onClick={() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }}
        className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center rounded-md border border-[var(--glass-border-subtle)] bg-[var(--glass-surface-subtle)] px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Focus search"
      >
        <span>⌘</span>
        <span>K</span>
      </button>
    </div>
  );
}
