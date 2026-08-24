"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  getPendingSignup,
  saveUsername,
  RESERVED_USERNAMES,
} from "@/lib/storage";

type CheckState = "idle" | "checking" | "available" | "taken" | "invalid";

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,18}[a-z0-9])?$/;

// Prototype-only: since there's no backend yet, we simulate a small set of
// already-taken usernames alongside the reserved route names. See spec §13.
const SIMULATED_TAKEN = ["amara", "john", "jane", "test", "demo"];

function getInvalidReason(username: string): string | null {
  if (username.length === 0) return null;
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 20) return "Username must be 20 characters or fewer.";
  if (!USERNAME_PATTERN.test(username)) {
    return "Use lowercase letters, numbers and hyphens only. Can't start or end with a hyphen.";
  }
  if (RESERVED_USERNAMES.includes(username)) {
    return "This username is reserved.";
  }
  return null;
}

export default function UsernamePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [username, setUsername] = useState("");
  const [state, setState] = useState<CheckState>("idle");
  const [invalidReason, setInvalidReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const pending = getPendingSignup();
    if (!pending || !pending.verified) {
      setBlocked(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const cleaned = username.trim().toLowerCase();

    if (!cleaned) {
      setState("idle");
      setInvalidReason(null);
      return;
    }

    const reason = getInvalidReason(cleaned);
    if (reason) {
      setState("invalid");
      setInvalidReason(reason);
      return;
    }

    setInvalidReason(null);
    setState("checking");

    const timer = setTimeout(() => {
      setState(SIMULATED_TAKEN.includes(cleaned) ? "taken" : "available");
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state !== "available") return;

    setSubmitting(true);
    saveUsername(username.trim().toLowerCase());
    router.push("/profile-setup");
  }

  if (!ready) {
    return (
      <PhoneViewport>
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-ink-soft">Loading...</p>
        </div>
      </PhoneViewport>
    );
  }

  if (blocked) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            Please verify your email before choosing a username.
          </p>
          <Link href="/signup" className="text-sm text-gold font-medium">
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
          Choose your username
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          This becomes your public IdentiShare link — pick something you&apos;ll
          want to share.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-ink-soft mb-1.5">
              Username
            </label>
            <div
              className={`flex items-center rounded-xl border bg-paper pl-4 pr-3 py-3 transition-colors ${
                state === "invalid" || state === "taken"
                  ? "border-red-400"
                  : state === "available"
                  ? "border-green-500"
                  : "border-gold-line focus-within:border-gold"
              }`}
            >
              <span className="text-sm text-ink-soft font-mono whitespace-nowrap">
                identishare.com/
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm font-mono text-ink"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <span className="ml-2 shrink-0">
                {state === "checking" && (
                  <Loader2 className="w-4 h-4 text-ink-soft animate-spin" />
                )}
                {state === "available" && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                {(state === "taken" || state === "invalid") && (
                  <X className="w-4 h-4 text-red-500" />
                )}
              </span>
            </div>

            {state === "invalid" && invalidReason && (
              <p className="mt-1.5 text-xs text-red-600">{invalidReason}</p>
            )}
            {state === "taken" && (
              <p className="mt-1.5 text-xs text-red-600">
                That username is already taken.
              </p>
            )}
            {state === "available" && (
              <p className="mt-1.5 text-xs text-green-600">
                identishare.com/{username.trim().toLowerCase()} is available.
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            loading={submitting}
            disabled={state !== "available"}
            className="mt-2"
          >
            Continue
          </PrimaryButton>
        </form>
      </div>
    </PhoneViewport>
  );
}