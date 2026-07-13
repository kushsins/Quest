import { Loader2, Sparkles } from "lucide-react";

import { AmbientBackground } from "@/shared/components/layout/AmbientBackground";

export function AuthSplash() {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <AmbientBackground />

      <div className="glass-floating relative z-10 flex flex-col items-center gap-5 rounded-[var(--panel-radius)] px-10 py-12 shadow-[var(--glass-shadow-elevated)]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary glow-primary-soft ring-1 ring-primary/25">
          <Sparkles className="size-7" />
        </span>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quest
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restoring your session…
          </p>
        </div>

        <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
      </div>
    </div>
  );
}
