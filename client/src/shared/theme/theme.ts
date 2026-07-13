export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "quest-theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme: Theme): "light" | "dark" {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);

  return resolved;
}

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

export function storeTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
