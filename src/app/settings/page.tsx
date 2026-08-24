"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  Check,
  AlertTriangle,
  LogOut,
  Trash2,
} from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import {
  getPendingSignup,
  savePendingSignup,
  getProfile,
  clearAllIdentishareData,
  type PendingSignup,
  type Profile,
} from "@/lib/storage";

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<PendingSignup | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [resetConfirming, setResetConfirming] = useState(false);

  useEffect(() => {
    setPending(getPendingSignup());
    setProfile(getProfile());
    setReady(true);
  }, []);

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pending) return;

    const next: PasswordErrors = {};

    if (currentPassword !== pending.password) {
      next.currentPassword = "That's not your current password.";
    }
    if (!newPassword) {
      next.newPassword = "Enter a new password.";
    } else if (newPassword.length < 8) {
      next.newPassword = "New password must be at least 8 characters.";
    }
    if (confirmPassword !== newPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(next);
    if (Object.keys(next).length > 0) {
      setPasswordSaved(false);
      return;
    }

    // Prototype only: password lives in local storage for demo purposes.
    // A production build must never do this — see spec §22.
    savePendingSignup({ ...pending, password: newPassword });
    setPending({ ...pending, password: newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
  }

  function handleSignOut() {
    clearAllIdentishareData();
    router.push("/");
  }

  function handleResetData() {
    clearAllIdentishareData();
    router.push("/");
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

  if (!pending && !profile) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">No account found yet.</p>
          <Link href="/signup" className="text-sm text-gold font-medium">
            Create your profile
          </Link>
        </div>
      </PhoneViewport>
    );
  }

  const email = profile?.personalEmail || pending?.email || "—";
  const phone = profile?.personalPhone || pending?.phone || "—";
  const accountType = pending?.accountType ?? profile?.accountType ?? "personal";
  const username = profile?.username;

  return (
    <PhoneViewport>
      <div className="min-h-full flex flex-col">
        <div className="flex-1 px-8 py-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-ink">
            Settings
          </h1>

          {/* Account information */}
          <div className="mt-8">
            <h2 className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-3">
              Account
            </h2>
            <div className="rounded-xl border border-gold-line bg-paper p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Account type</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-ink font-medium">
                  {accountType === "corporate" ? (
                    <Building2 className="w-3.5 h-3.5 text-gold" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-gold" />
                  )}
                  {accountType === "corporate" ? "Corporate" : "Personal"}
                </span>
              </div>
              {username && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">Username</span>
                  <span className="text-sm font-mono text-ink">{username}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Email</span>
                <span className="text-sm text-ink truncate max-w-[180px]">{email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Phone</span>
                <span className="text-sm text-ink">{phone}</span>
              </div>
            </div>
          </div>

          {/* Change password */}
          {pending && (
            <div className="mt-8">
              <h2 className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-3">
                Change password
              </h2>
              <form
                onSubmit={handlePasswordSubmit}
                className="rounded-xl border border-gold-line bg-paper p-4 flex flex-col gap-4"
                noValidate
              >
                <TextField
                  label="Current password"
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={passwordErrors.currentPassword}
                />
                <TextField
                  label="New password"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                  placeholder="At least 8 characters"
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordErrors.confirmPassword}
                />

                {passwordSaved && (
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <Check className="w-3.5 h-3.5" />
                    Password updated.
                  </div>
                )}

                <PrimaryButton type="submit">Update password</PrimaryButton>
              </form>
            </div>
          )}

          {/* Sign out */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-gold-line py-3.5 text-sm font-medium text-ink hover:border-gold/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>

          {/* Danger zone */}
          <div className="mt-8">
            <h2 className="text-xs font-medium text-red-600 uppercase tracking-wide mb-3">
              Danger zone
            </h2>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-ink">Reset all profile data</p>
              <p className="mt-1 text-xs text-ink-soft">
                Permanently deletes your account, profile and uploads from
                this browser. This cannot be undone.
              </p>

              {!resetConfirming ? (
                <button
                  type="button"
                  onClick={() => setResetConfirming(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-600 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset all data
                </button>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Are you sure? This is permanent.
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="flex-1 rounded-full bg-red-600 text-white py-2.5 text-sm font-medium"
                    >
                      Yes, reset everything
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetConfirming(false)}
                      className="flex-1 rounded-full border border-gold-line py-2.5 text-sm font-medium text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </PhoneViewport>
  );
}