import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  leading?: ReactNode;
  labelClassName?: string;
}

interface SelectProps<T extends string> {
  id?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function Select<T extends string>({
  id,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  "aria-label": ariaLabel,
  className,
}: SelectProps<T>) {
  const selectedOption = options.find((option) => option.value === value);

  if (disabled) {
    return (
      <div
        id={id}
        aria-label={ariaLabel}
        aria-disabled="true"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[var(--control-radius)] border border-[var(--glass-border-subtle)] bg-[var(--glass-surface-subtle)] px-3 text-sm text-foreground opacity-50 shadow-[var(--glass-border-glow-subtle)] backdrop-blur-sm",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selectedOption?.leading}
          <span
            className={cn("truncate", selectedOption?.labelClassName)}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          id={id}
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-[var(--control-radius)] border border-[var(--glass-border-subtle)] bg-[var(--glass-surface-subtle)] px-3 text-sm text-foreground shadow-[var(--glass-border-glow-subtle)] backdrop-blur-sm transition-colors hover:bg-[var(--glass-surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {selectedOption?.leading}
            <span
              className={cn("truncate", selectedOption?.labelClassName)}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value || "__empty__"}
            className="gap-2"
            onSelect={() => {
              if (option.value !== value) {
                onChange(option.value);
              }
            }}
          >
            {option.leading}
            <span className={cn("flex-1", option.labelClassName)}>
              {option.label}
            </span>
            {option.value === value ? (
              <Check className="size-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
