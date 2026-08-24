"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";
import { savePendingSignup, type AccountType } from "@/lib/storage";

interface FormErrors {
  fullName?: string;
  companyName?: string;
  adminName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("personal");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleNotice, setGoogleNotice] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (accountType === "personal" && !fullName.trim()) {
      next.fullName = "Full name is required.";
    }

    if (accountType === "corporate") {
      if (!companyName.trim()) next.companyName = "Company name is required.";
      if (!adminName.trim()) next.adminName = "Contact person name is required.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!phone.trim()) {
      next.phone = "Phone number is required.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      next.terms = "You must agree to the Terms & Privacy Policy.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Prototype only: simulates account creation locally.
    // A production build must send this to a real auth provider and
    // never store a raw password in localStorage. See spec §22.
    savePendingSignup({
      accountType,
      fullName: accountType === "personal" ? fullName.trim() : undefined,
      companyName: accountType === "corporate" ? companyName.trim() : undefined,
      adminName: accountType === "corporate" ? adminName.trim() : undefined,
      email: email.trim(),
      phone: phone.trim(),
      password,
      termsAccepted,
      verified: false,
    });

    router.push("/verify");
  }

  return (
    <PhoneViewport>
      <div className="px-8 py-10 min-h-full flex flex-col">
        <span className="font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gold">
          IdentiShare
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Choose your account type and set up your sign in details.
        </p>

        {/* Account type */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType("personal")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
              accountType === "personal"
                ? "border-gold bg-gold/5 text-ink"
                : "border-gold-line text-ink-soft hover:border-gold/50"
            )}
            aria-pressed={accountType === "personal"}
          >
            <User className="w-5 h-5" />
            Personal
          </button>
          <button
            type="button"
            onClick={() => setAccountType("corporate")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
              accountType === "corporate"
                ? "border-gold bg-gold/5 text-ink"
                : "border-gold-line text-ink-soft hover:border-gold/50"
            )}
            aria-pressed={accountType === "corporate"}
          >
            <Building2 className="w-5 h-5" />
            Corporate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          {accountType === "personal" ? (
            <TextField
              label="Full name"
              type="text"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              placeholder="Amara Kofi"
            />
          ) : (
            <>
              <TextField
                label="Company / Organisation name"
                type="text"
                name="companyName"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={errors.companyName}
                placeholder="Acme Inc."
              />
              <TextField
                label="Admin / Contact person name"
                type="text"
                name="adminName"
                autoComplete="name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                error={errors.adminName}
                placeholder="Jane Doe"
              />
            </>
          )}

          <TextField
            label={accountType === "corporate" ? "Work email address" : "Email address"}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />

          <TextField
            label="Phone number"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="+234 800 000 0000"
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="At least 8 characters"
          />

          <TextField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
          />

          <label className="flex items-start gap-2.5 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gold-line accent-[var(--color-gold)]"
            />
            <span>
              I agree to the{" "}
              <span className="text-gold font-medium">Terms of Service</span>{" "}
              and{" "}
              <span className="text-gold font-medium">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms && (
            <p className="-mt-2 text-xs text-red-600">{errors.terms}</p>
          )}

          <PrimaryButton type="submit" loading={submitting} className="mt-2">
            {accountType === "corporate" ? "Create Corporate Account" : "Create Account"}
          </PrimaryButton>

          {accountType === "personal" && (
            <>
              <div className="flex items-center gap-3 my-1">
                <div className="h-px flex-1 bg-gold-line" />
                <span className="text-xs text-ink-soft">or</span>
                <div className="h-px flex-1 bg-gold-line" />
              </div>

              <button
                type="button"
                onClick={() => setGoogleNotice(true)}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-gold-line px-6 py-3.5 text-sm font-medium text-ink hover:border-gold/50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.89c2.28-2.1 3.56-5.2 3.56-8.8Z" fill="#4285F4"/>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.89-2.98c-1.08.72-2.45 1.15-4.04 1.15-3.11 0-5.74-2.1-6.68-4.92H1.3v3.07C3.27 21.3 7.31 24 12 24Z" fill="#34A853"/>
                  <path d="M5.32 14.33A7.2 7.2 0 0 1 4.96 12c0-.81.14-1.6.36-2.33V6.6H1.3A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.3 5.4l4.02-3.07Z" fill="#FBBC05"/>
                  <path d="M12 4.75c1.76 0 3.34.61 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.6l4.02 3.07C6.26 6.85 8.89 4.75 12 4.75Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              {googleNotice && (
                <p className="text-xs text-center text-ink-soft">
                  Google sign-in isn&apos;t connected in this prototype yet — coming in a later phase.
                </p>
              )}
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/signin" className="text-gold font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </PhoneViewport>
  );
}