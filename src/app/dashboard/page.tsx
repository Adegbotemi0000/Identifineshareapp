"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Share2,
  Copy,
  Check,
  Globe,
  Link2,
  Briefcase,
  Camera,
  X,
  Users,
  MessageCircle,
  FileText,
  LogOut,
} from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { CompletionBar } from "@/components/dashboard/completion-bar";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import {
  getProfile,
  getPortfolioMeta,
  calculateProfileCompletion,
  clearAllIdentishareData,
  type Profile,
} from "@/lib/storage";
import { formatFileSize } from "@/lib/image";

const LINK_ICONS: { key: keyof Profile; label: string; icon: typeof Globe }[] = [
  { key: "website", label: "Website", icon: Globe },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
  { key: "instagram", label: "Instagram", icon: Camera },
  { key: "twitter", label: "Twitter / X", icon: X },
  { key: "facebook", label: "Facebook", icon: Users },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "linktree", label: "Linktree", icon: Link2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioMeta, setPortfolioMeta] = useState<{ name: string; size: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setPortfolioMeta(getPortfolioMeta());
    setReady(true);
  }, []);

  function handleSignOut() {
    clearAllIdentishareData();
    router.push("/");
  }

  async function handleCopyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable — fail quietly per spec §28.
    }
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

  if (!profile) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            No profile found yet. Let&apos;s get you set up.
          </p>
          <Link href="/signup" className="text-sm text-gold font-medium">
            Create your profile
          </Link>
        </div>
      </PhoneViewport>
    );
  }

  const fullName = [profile.prefix, profile.firstName, profile.lastName, profile.suffix]
    .filter(Boolean)
    .join(" ");
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const publicUrl = `identishare.com/${profile.username}`;
  const completion = calculateProfileCompletion(profile);
  const backgroundColor = profile.backgroundColor || "#fefdfb";
  const accentColor = profile.accentColor || "#ad8a3f";

  const filledContact = [
    { label: "Personal email", value: profile.personalEmail },
    { label: "Official email", value: profile.officialEmail },
    { label: "Personal phone", value: profile.personalPhone },
    { label: "Official phone", value: profile.officialPhone },
    { label: "Address", value: profile.address },
  ].filter((f) => f.value);

  const filledLinks = LINK_ICONS.filter((l) => Boolean(profile[l.key]));

  return (
    <PhoneViewport>
      <div className="min-h-full flex flex-col">
        <div className="flex-1 pb-6">
          {/* Cover + profile photo */}
          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-ivory to-gold-soft/40">
            {profile.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element -- data URL
              <img
                src={profile.coverImage}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <div className="relative z-10 px-6 -mt-9">
            <div className="w-[72px] h-[72px] rounded-full border-4 border-paper bg-ink text-paper overflow-hidden flex items-center justify-center font-[family-name:var(--font-display)] text-xl">
              {profile.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL
                <img
                  src={profile.profilePhoto}
                  alt={fullName || "Profile photo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-xl text-ink">
              {fullName || "Unnamed profile"}
            </h1>
            {profile.title && <p className="text-sm text-ink-soft">{profile.title}</p>}
            {profile.company && (
              <p className="text-xs text-ink-soft/80">{profile.company}</p>
            )}

            <button
              type="button"
              onClick={() => handleCopyLink(`https://${publicUrl}`)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-gold"
            >
              {publicUrl}
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <div className="mt-4">
              <CompletionBar percentage={completion} />
            </div>

            {/* Quick actions */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <Link
                href={`/profile/${profile.username}`}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-gold-line py-3 text-xs text-ink hover:border-gold/50 transition-colors"
              >
                <Eye className="w-4 h-4 text-gold" />
                Preview
              </Link>
              <Link
                href="/profile-setup"
                className="flex flex-col items-center gap-1.5 rounded-xl border border-gold-line py-3 text-xs text-ink hover:border-gold/50 transition-colors"
              >
                <Pencil className="w-4 h-4 text-gold" />
                Edit
              </Link>
              <Link
                href="/share"
                className="flex flex-col items-center gap-1.5 rounded-xl border border-gold-line py-3 text-xs text-ink hover:border-gold/50 transition-colors"
              >
                <Share2 className="w-4 h-4 text-gold" />
                Share
              </Link>
            </div>
            <p className="mt-2 text-[11px] text-ink-soft/60 text-center">
              Preview and Share will work once those pages are built in the
              next phases.
            </p>

            {/* Section summaries */}
            <div className="mt-6 flex flex-col gap-4">
              <SummaryCard title="Profile information" editHref="/profile-setup">
                {profile.bio ? (
                  <p className="text-sm text-ink-soft line-clamp-3">{profile.bio}</p>
                ) : (
                  <p className="text-sm text-ink-soft/60">No bio added yet.</p>
                )}
              </SummaryCard>

              <SummaryCard title="Contact details" editHref="/profile-setup">
                {filledContact.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {filledContact.map((f) => (
                      <li key={f.label} className="text-sm text-ink-soft">
                        <span className="text-ink-soft/70">{f.label}: </span>
                        {f.value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-soft/60">
                    No contact details added yet.
                  </p>
                )}
              </SummaryCard>

              <SummaryCard title="Links & socials" editHref="/profile-setup">
                {filledLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filledLinks.map((l) => (
                      <div
                        key={l.key}
                        className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center"
                        title={l.label}
                      >
                        <l.icon className="w-3.5 h-3.5 text-ink-soft" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft/60">No links added yet.</p>
                )}
              </SummaryCard>

              <SummaryCard title="Work gallery" editHref="/profile-setup">
                {profile.workImages.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {profile.workImages.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element -- data URL
                      <img
                        key={i}
                        src={src}
                        alt={`Work sample ${i + 1}`}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-gold-line"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft/60">
                    No work images added yet.
                  </p>
                )}
              </SummaryCard>

              <SummaryCard title="Portfolio / CV" editHref="/profile-setup">
                {profile.portfolio && portfolioMeta ? (
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">
                        {portfolioMeta.name}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {formatFileSize(portfolioMeta.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft/60">
                    No portfolio uploaded yet.
                  </p>
                )}
              </SummaryCard>

              <SummaryCard title="Appearance" editHref="/profile-setup">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full border border-gold-line"
                      style={{ backgroundColor }}
                    />
                    <span className="text-[10px] text-ink-soft">Background</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full border border-gold-line"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-[10px] text-ink-soft">Text & symbols</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-soft/60">
                  Applies to your public profile page, not this dashboard.
                </p>
              </SummaryCard>

              <SummaryCard title="Account">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">
                    {profile.personalEmail || "No email on file"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </SummaryCard>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </PhoneViewport>
  );
}