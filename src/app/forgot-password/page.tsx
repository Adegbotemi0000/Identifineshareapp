"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);

    // Prototype only: there's no email provider wired up yet, so this
    // doesn't actually send anything. A production build must send a real
    // reset link through an email service — see spec §22.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <PhoneViewport>
      <div className="px-8 py-10 min-h-full flex flex-col">
        <Link
          href="/signin"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <span className="mt-4 font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gold">
          IdentiShare
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
          Reset your password
        </h1>

        {!submitted ? (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              Enter the email on your account and we&apos;ll send reset
              instructions.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
              <TextField
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                placeholder="you@example.com"
              />

              <PrimaryButton type="submit" loading={submitting} className="mt-2">
                Send reset instructions
              </PrimaryButton>
            </form>

            <div className="mt-4 rounded-xl border border-gold-line bg-gold/5 px-4 py-3 text-xs text-ink-soft">
              Prototype mode — no email is actually sent yet. This is a
              placeholder for the real reset flow in production.
            </div>
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <MailCheck className="w-5 h-5 text-gold" />
            </div>
            <p className="text-sm text-ink">
              If an account exists for <span className="font-medium">{email}</span>,
              reset instructions have been sent.
            </p>
            <Link href="/signin" className="mt-2 text-sm text-gold font-medium">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </PhoneViewport>
  );
}