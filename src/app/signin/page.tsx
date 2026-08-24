"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getPendingSignup, getUsername, getProfile } from "@/lib/storage";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: FormErrors = {};

    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);

    // Prototype only: checks against the single locally stored signup
    // record. A production build must verify credentials against a real
    // authentication provider — see spec §22.
    const pending = getPendingSignup();

    if (!pending || pending.email.toLowerCase() !== email.trim().toLowerCase() || pending.password !== password) {
      setErrors({ general: "Incorrect email or password." });
      setSubmitting(false);
      return;
    }

    if (!pending.verified) {
      router.push("/verify");
      return;
    }

    const username = getUsername();
    if (!username) {
      router.push("/username");
      return;
    }

    const profile = getProfile();
    if (!profile) {
      router.push("/profile-setup");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <PhoneViewport>
      <div className="px-8 py-10 min-h-full flex flex-col">
        <span className="font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gold">
          IdentiShare
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in to manage your profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
          <TextField
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          {errors.general && (
            <p className="text-xs text-red-600">{errors.general}</p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gold-line accent-[var(--color-gold)]"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-xs text-gold font-medium">
              Forgot password?
            </Link>
          </div>

          <PrimaryButton type="submit" loading={submitting} className="mt-2">
            Sign In
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold font-medium">
            Create one
          </Link>
        </p>
      </div>
    </PhoneViewport>
  );
}