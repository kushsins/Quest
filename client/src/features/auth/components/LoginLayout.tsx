import { Outlet } from "react-router-dom";

import { LoginBrandingPanel } from "@/features/auth/components/LoginBrandingPanel";
import { AmbientBackground } from "@/shared/components/layout/AmbientBackground";
import { QuestLogo } from "@/shared/components/layout/QuestLogo";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";

export function LoginLayout() {
  return (
    <div className="login-page relative min-h-dvh overflow-x-hidden">
      <AmbientBackground />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle collapsed />
      </div>

      <div className="login-page-frame relative z-10 flex min-h-dvh items-center justify-center">
        <div className="login-shell">
          <div className="login-shell-inner">
            <LoginBrandingPanel />

            <section className="login-form-panel">
              <div className="login-form-content">
                <QuestLogo
                  asLink={false}
                  className="login-mobile-logo lg:hidden"
                />

                <div>
                  <h2 className="login-form-title">
                    Welcome back <span aria-hidden="true">👋</span>
                  </h2>
                  <p className="login-form-subtitle">
                    Sign in to continue to Quest
                  </p>
                </div>

                <Outlet />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
