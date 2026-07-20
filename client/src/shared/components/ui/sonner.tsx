import { useLayoutEffect } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/shared/theme/useTheme";

const SONNER_OVERRIDE_STYLE_ID = "quest-sonner-overrides";

const SONNER_OVERRIDE_CSS = `
  [data-sonner-toaster][dir='ltr'] {
    --toast-close-button-start: unset;
    --toast-close-button-end: 0;
    --toast-close-button-transform: translate(35%, -35%);
  }

  [data-sonner-toast][data-styled='true'] [data-close-button] {
    left: auto !important;
    right: 0 !important;
    transform: translate(35%, -35%) !important;
  }

  [data-sonner-toast].glass-elevated {
    overflow: visible !important;
  }

  [data-sonner-toast].glass-elevated [data-close-button] {
    z-index: 5;
    border-color: var(--glass-border-subtle);
    background: var(--glass-surface-elevated);
    color: var(--foreground);
    box-shadow: var(--glass-border-glow-subtle);
  }
`;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  useLayoutEffect(() => {
    let styleEl = document.getElementById(SONNER_OVERRIDE_STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = SONNER_OVERRIDE_STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = SONNER_OVERRIDE_CSS;
  }, []);

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "glass-elevated overflow-visible group-[.toaster]:text-foreground group-[.toaster]:border-border",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:z-[5] group-[.toast]:border-[var(--glass-border-subtle)] group-[.toast]:bg-[var(--glass-surface-elevated)] group-[.toast]:text-foreground group-[.toast]:shadow-[var(--glass-border-glow-subtle)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
