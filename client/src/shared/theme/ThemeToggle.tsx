import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useTheme } from "@/shared/theme/useTheme";
import type { Theme } from "@/shared/theme/theme";
import { cn } from "@/shared/lib/utils";

const themeOptions: Array<{
  value: Theme;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const activeOption = themeOptions.find((option) => option.value === theme);

  if (!activeOption) {
    throw new Error("Invalid theme option.");
  }

  const ActiveIcon = activeOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "glass-subtle h-auto w-full justify-between rounded-[var(--control-radius)] px-3 py-2.5 text-sidebar-foreground",
            collapsed && "size-10 justify-center px-0 py-0",
          )}
        >
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              collapsed && "justify-center",
            )}
          >
            <ActiveIcon className="size-4 text-primary" />
            {!collapsed ? <span className="font-medium">Theme</span> : null}
          </span>
          {!collapsed ? (
            <span className="text-sm text-muted-foreground">
              {activeOption.label}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            setTheme(value as Theme);
          }}
        >
          {themeOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <option.icon className="size-4" />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
