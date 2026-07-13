import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/validation/login.schema";
import { ApiClientError } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

interface LoginLocationState {
  from?: {
    pathname: string;
  };
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    void (async () => {
      setFormError(null);

      try {
        await login(values);

        const state = location.state as LoginLocationState | null;
        const redirectTo = state?.from?.pathname ?? "/";

        void navigate(redirectTo, { replace: true });
        toast.success("Welcome back.");
      } catch (error) {
        if (error instanceof ApiClientError) {
          if (error.errors.length > 0) {
            for (const fieldError of error.errors) {
              if (
                fieldError.field === "email" ||
                fieldError.field === "password"
              ) {
                setError(fieldError.field, { message: fieldError.message });
              }
            }
            return;
          }

          setFormError(error.message);
          return;
        }

        setFormError("An unexpected error occurred. Please try again.");
      }
    })();
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="login-form"
      noValidate
    >
      <div>
        <Label htmlFor="email" className="login-form-label">
          Email address
        </Label>
        <div className="relative">
          <Mail
            className="login-form-field-icon"
            aria-hidden="true"
            strokeWidth={1.75}
          />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className="login-form-input"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="password" className="login-form-label">
          Password
        </Label>
        <div className="relative">
          <Lock
            className="login-form-field-icon"
            aria-hidden="true"
            strokeWidth={1.75}
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            className="login-form-input login-form-input--password"
            {...register("password")}
          />
          <button
            type="button"
            className="login-form-eye"
            onClick={() => {
              setShowPassword((current) => !current);
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        className={cn(
          "login-form-submit",
          isSubmitting && "opacity-90",
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="size-4" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  );
}
