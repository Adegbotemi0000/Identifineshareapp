"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { TextField } from "@/components/ui/text-field";
import { TextAreaField } from "@/components/ui/text-area-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { StepIndicator } from "@/components/profile-setup/step-indicator";
import { ImageUpload } from "@/components/profile-setup/image-upload";
import { WorkGallery } from "@/components/profile-setup/work-gallery";
import { FileUpload } from "@/components/profile-setup/file-upload";
import { ColorPicker } from "@/components/profile-setup/color-picker";
import {
  getPendingSignup,
  getUsername,
  getProfile,
  saveProfile,
  defaultProfile,
  markProfileCompleted,
  saveWorkImagesCache,
  savePortfolioMeta,
  getPortfolioMeta,
  type Profile,
} from "@/lib/storage";

const STEPS = ["Basic Info", "Contact", "Links & Socials", "Visual", "Assets"];

const BACKGROUND_PRESETS = [
  "#fefdfb",
  "#f6f2ea",
  "#fdf3e7",
  "#17150f",
  "#101828",
  "#1b1a17",
];

interface BasicInfoErrors {
  firstName?: string;
  lastName?: string;
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [basicErrors, setBasicErrors] = useState<BasicInfoErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const [portfolioFileName, setPortfolioFileName] = useState("");
  const [portfolioFileSize, setPortfolioFileSize] = useState(0);

  useEffect(() => {
    const pending = getPendingSignup();
    const username = getUsername();

    if (!pending || !pending.verified || !username) {
      setBlocked(true);
      setReady(true);
      return;
    }

    const base = defaultProfile({
      accountType: pending.accountType,
      username,
      fullName: pending.fullName,
      companyName: pending.companyName,
      email: pending.email,
      phone: pending.phone,
    });

    const existing = getProfile();
    // Merge over defaults so anyone with a profile saved before this update
    // (which lacks the newer fields) still gets sensible values for them.
    setProfile(existing ? { ...base, ...existing } : base);

    const portfolioMeta = getPortfolioMeta();
    if (portfolioMeta) {
      setPortfolioFileName(portfolioMeta.name);
      setPortfolioFileSize(portfolioMeta.size);
    }

    setReady(true);
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function validateBasicInfo(): boolean {
    if (!profile) return false;
    const next: BasicInfoErrors = {};

    if (!profile.firstName.trim()) next.firstName = "First name is required.";
    if (!profile.lastName.trim()) next.lastName = "Last name is required.";

    setBasicErrors(next);
    return Object.keys(next).length === 0;
  }

  function persistAndAdvance() {
    if (!profile) return;

    if (stepIndex === 0 && !validateBasicInfo()) {
      return;
    }

    const saved = saveProfile(profile);
    if (!saved) {
      setSaveError(
        "Couldn't save your changes — your images or portfolio are likely too large for this prototype's storage. Try removing the portfolio, or removing/replacing a large image, then continue."
      );
      return;
    }
    setSaveError(null);

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    saveWorkImagesCache(profile.workImages);
    if (profile.portfolio && portfolioFileName) {
      savePortfolioMeta(portfolioFileName, portfolioFileSize);
    }
    markProfileCompleted();
    router.push("/dashboard");
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

  if (blocked || !profile) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            Please complete sign up and choose a username first.
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
          Set up your profile
        </h1>

        <div className="mt-5">
          <StepIndicator steps={STEPS} currentIndex={stepIndex} />
        </div>

        <div className="mt-8 flex-1">
          {/* Step 0 — Basic Info */}
          {stepIndex === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <TextField
                  label="Prefix"
                  name="prefix"
                  value={profile.prefix}
                  onChange={(e) => update("prefix", e.target.value)}
                  placeholder="Dr."
                  className="col-span-1"
                />
                <TextField
                  label="Suffix"
                  name="suffix"
                  value={profile.suffix}
                  onChange={(e) => update("suffix", e.target.value)}
                  placeholder="MBA"
                  className="col-span-2"
                />
              </div>

              <TextField
                label="First name *"
                name="firstName"
                value={profile.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                error={basicErrors.firstName}
                placeholder="Amara"
                className="text-base py-4"
              />
              <TextField
                label="Last name *"
                name="lastName"
                value={profile.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                error={basicErrors.lastName}
                placeholder="Kofi"
                className="text-base py-4"
              />

              <TextField
                label="Professional title"
                name="title"
                value={profile.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Creative Director"
              />
              <TextField
                label="Company / organisation"
                name="company"
                value={profile.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Acme Inc."
              />
              <TextAreaField
                label="Biography"
                name="bio"
                value={profile.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="A short introduction visitors will see on your public profile."
              />
            </div>
          )}

          {/* Step 1 — Contact Details */}
          {stepIndex === 1 && (
            <div className="flex flex-col gap-4">
              <TextField
                label="Personal email"
                type="email"
                name="personalEmail"
                value={profile.personalEmail}
                onChange={(e) => update("personalEmail", e.target.value)}
                placeholder="you@example.com"
              />
              <TextField
                label="Official email"
                type="email"
                name="officialEmail"
                value={profile.officialEmail}
                onChange={(e) => update("officialEmail", e.target.value)}
                placeholder="you@company.com"
              />
              <TextField
                label="Personal phone"
                type="tel"
                name="personalPhone"
                value={profile.personalPhone}
                onChange={(e) => update("personalPhone", e.target.value)}
                placeholder="+234 800 000 0000"
              />
              <TextField
                label="Official phone"
                type="tel"
                name="officialPhone"
                value={profile.officialPhone}
                onChange={(e) => update("officialPhone", e.target.value)}
                placeholder="+234 800 000 0001"
              />
              <TextField
                label="Address"
                name="address"
                value={profile.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="City, Country"
              />
            </div>
          )}

          {/* Step 2 — Links and Socials */}
          {stepIndex === 2 && (
            <div className="flex flex-col gap-4">
              <TextField
                label="Website"
                type="url"
                name="website"
                value={profile.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://yoursite.com"
              />
              <TextField
                label="LinkedIn"
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
              />
              <TextField
                label="Instagram"
                type="url"
                name="instagram"
                value={profile.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="https://instagram.com/yourname"
              />
              <TextField
                label="Twitter / X"
                type="url"
                name="twitter"
                value={profile.twitter}
                onChange={(e) => update("twitter", e.target.value)}
                placeholder="https://x.com/yourname"
              />
              <TextField
                label="Facebook"
                type="url"
                name="facebook"
                value={profile.facebook}
                onChange={(e) => update("facebook", e.target.value)}
                placeholder="https://facebook.com/yourname"
              />
              <TextField
                label="WhatsApp number"
                type="tel"
                name="whatsapp"
                value={profile.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="+234 800 000 0000"
              />
              <TextField
                label="Linktree"
                type="url"
                name="linktree"
                value={profile.linktree}
                onChange={(e) => update("linktree", e.target.value)}
                placeholder="https://linktr.ee/yourname"
              />
              <TextField
                label="Custom link 1"
                type="url"
                name="customLink1"
                value={profile.customLink1}
                onChange={(e) => update("customLink1", e.target.value)}
                placeholder="https://"
              />
              <TextField
                label="Custom link 2"
                type="url"
                name="customLink2"
                value={profile.customLink2}
                onChange={(e) => update("customLink2", e.target.value)}
                placeholder="https://"
              />
            </div>
          )}

          {/* Step 3 — Visual Identity */}
          {stepIndex === 3 && (
            <div className="flex flex-col gap-6">
              <ImageUpload
                label="Profile photo"
                value={profile.profilePhoto}
                onChange={(v) => update("profilePhoto", v)}
                maxDimension={480}
                heightClassName="h-32"
              />
              <ImageUpload
                label="Cover image"
                value={profile.coverImage}
                onChange={(v) => update("coverImage", v)}
                maxDimension={960}
                heightClassName="h-28"
              />

              <ColorPicker
                label="Background colour"
                value={profile.backgroundColor}
                onChange={(v) => update("backgroundColor", v)}
                presets={BACKGROUND_PRESETS}
              />
              <p className="-mt-4 text-xs text-ink-soft/70">
                The base background colour of your public profile page.
              </p>

              <ColorPicker
                label="Text & symbols colour"
                value={profile.accentColor}
                onChange={(v) => update("accentColor", v)}
              />
              <p className="-mt-4 text-xs text-ink-soft/70">
                Fills your buttons and icon badges on your public profile.
              </p>
            </div>
          )}

          {/* Step 4 — Professional Assets */}
          {stepIndex === 4 && (
            <div className="flex flex-col gap-6">
              <WorkGallery
                images={profile.workImages}
                onChange={(images) => update("workImages", images)}
              />

              <FileUpload
                label="Portfolio / CV (PDF)"
                value={profile.portfolio}
                fileName={portfolioFileName}
                fileSize={portfolioFileSize}
                onChange={(dataUrl, name, size) => {
                  update("portfolio", dataUrl);
                  setPortfolioFileName(name);
                  setPortfolioFileSize(size);
                }}
                onRemove={() => {
                  update("portfolio", "");
                  setPortfolioFileName("");
                  setPortfolioFileSize(0);
                }}
              />

              <TextField
                label="Portfolio video (YouTube link)"
                type="url"
                name="portfolioVideo"
                value={profile.portfolioVideo}
                onChange={(e) => update("portfolioVideo", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}
        </div>

        {saveError && (
          <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{saveError}</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink px-2 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <PrimaryButton
            type="button"
            onClick={persistAndAdvance}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {stepIndex < STEPS.length - 1 ? "Continue" : "Finish"}
            <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
        </div>
      </div>
    </PhoneViewport>
  );
}