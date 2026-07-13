import { BarChart3, Shield, Ticket, Users } from "lucide-react";

import loginBrandingDark from "@/assets/images/auth/login-branding-dark.png";
import loginBrandingLight from "@/assets/images/auth/login-branding-light.png";
import { QuestLogo } from "@/shared/components/layout/QuestLogo";

const features = [
  {
    icon: Ticket,
    title: "Track & Manage",
    description:
      "Organize, prioritize and resolve tickets with complete visibility.",
  },
  {
    icon: Users,
    title: "Collaborate",
    description:
      "Stay aligned with your team and keep conversations in context.",
  },
  {
    icon: BarChart3,
    title: "Gain Insights",
    description:
      "View smart dashboards and reports to improve support performance.",
  },
] as const;

export function LoginBrandingPanel() {
  return (
    <section className="login-branding-panel">
      <div className="login-branding-backdrop" aria-hidden="true">
        <img
          src={loginBrandingLight}
          alt=""
          className="login-branding-backdrop-image login-branding-backdrop-image--light"
        />
        <img
          src={loginBrandingDark}
          alt=""
          className="login-branding-backdrop-image login-branding-backdrop-image--dark"
        />
      </div>

      <div className="login-branding-content">
        <QuestLogo variant="inverse" asLink={false} />

        <div className="login-branding-body">
          <div className="login-branding-intro">
            <h1 className="login-branding-title">
              Resolve issues.
              <br />
              Deliver <span className="login-branding-accent">clarity.</span>
            </h1>
            <p className="login-branding-copy">
              Quest helps teams manage support tickets efficiently and keep every
              customer happy.
            </p>
          </div>

          <ul className="login-feature-list">
            {features.map((feature) => (
              <li key={feature.title}>
                <div className="login-feature-card">
                  <span className="login-feature-icon">
                    <feature.icon className="size-[1.05rem]" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="login-feature-title">{feature.title}</p>
                    <p className="login-feature-desc">{feature.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="login-branding-footer">
          <Shield className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span>Enterprise grade security</span>
        </div>
      </div>
    </section>
  );
}
