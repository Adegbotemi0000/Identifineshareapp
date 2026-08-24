"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { OtpInput } from "@/components/ui/otp-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  getPendingSignup,
  markPendingSignupVerified,
  type PendingSignup,
} from "@/lib/storage";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const RESEND_COOLDOWN = 30;

export default function VerifyPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingSignup | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [expectedCode, setExpectedCode] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    const data = getPendingSignup();
    setPending(data);
    setCheckedStorage(true);
    if (data) {
      setExpectedCode(generateCode());
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(() => {
    setExpectedCode(generateCode());
    setDigits(Array(6).fill(""));
    setError("");
    setCooldown(RESEND_COOLDOWN);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const entered = digits.join("");

    if (entered.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    if (entered !== expectedCode) {
      setError("That code doesn't match. Check and try again.");
      return;
    }

    setSubmitting(true);
    setError("");
    markPendingSignupVerified();
    router.push("/username");
  }

  if (!checkedStorage) {
    return (
      <PhoneViewport>
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-ink-soft">Loading...</p>
        </div>
      </PhoneViewport>
    );
  }

  if (!pending) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            We couldn&apos;t find a signup in progress. Please start again.
          </p>
          <Link
            href="/signup"
            className="text-sm text-gold font-medium"
          >
            Back to sign up
          </Link>
        </div>
      </PhoneViewport>
    );
  }

  return (
    <PhoneViewport>
      <div className="px-8 py-10 min-h-full flex flex-col">
        <span className="font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gold">
          IdentiShare
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter the 6-digit code sent to{" "}
          <span className="text-ink font-medium">{pending.email}</span>.
        </p>

        <div className="mt-3 rounded-xl border border-gold-line bg-gold/5 px-4 py-3 text-xs text-ink-soft">
          Prototype mode — no email is actually sent yet. Your code is{" "}
          <span className="font-mono text-gold font-medium">{expectedCode}</span>.
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <OtpInput value={digits} onChange={setDigits} error={error} />

          <PrimaryButton type="submit" loading={submitting}>
            Verify
          </PrimaryButton>
        </form>

        <div className="mt-6 text-center text-sm text-ink-soft">
          {cooldown > 0 ? (
            <span>Resend code in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-gold font-medium"
            >
              Resend code
            </button>
          )}
        </div>

        <Link
          href="/signup"
          className="mt-2 text-center text-sm text-ink-soft hover:text-ink"
        >
          Wrong email? Go back
        </Link>
      </div>
    </PhoneViewport>
  );
}