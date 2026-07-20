import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

interface TicketPanelSelectOption<T extends string> {
  value: T;
  label: string;
  leading?: ReactNode;
  labelClassName?: string;
}

interface TicketPanelSelectProps<T extends string> {
  label: string;
  value: T;
  options: TicketPanelSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  renderValue: (value: T) => ReactNode;
}

export function TicketPanelSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  renderValue,
}: TicketPanelSelectProps<T>) {
  if (disabled) {
    return (
      <div className="space-y-1.5">
        <p className="ticket-panel-field-label">{label}</p>
        <div className="ticket-panel-field-trigger" aria-disabled="true">
          <div className="ticket-panel-field-value">{renderValue(value)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="ticket-panel-field-label">{label}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ticket-panel-field-trigger text-left"
            aria-label={`Change ${label.toLowerCase()}`}
          >
            <div className="ticket-panel-field-value">{renderValue(value)}</div>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem]">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
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
    </div>
  );
}

export function StatusDot({ className }: { className: string }) {
  return (
    <span
      className={cn("ticket-semantic-dot", className)}
      aria-hidden="true"
    />
  );
}
