"use client";

import {
  useState,
  useEffect,
  type CSSProperties,
  type ComponentType,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Share2,
  Check,
  Link2,
  Contact,
  Handshake,
  UserPlus,
  Download,
} from "lucide-react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { ActionButton } from "@/components/profile/action-button";
import { ExchangeContactModal } from "@/components/profile/exchange-contact-modal";
import { ImageLightbox } from "@/components/profile/image-lightbox";
import {
  LinkedinIcon,
  InstagramIcon,
  TwitterXIcon,
  FacebookIcon,
  WhatsAppIcon,
} from "@/components/ui/social-icons";
import { type Profile } from "@/lib/storage";
import { downloadVCard } from "@/lib/vcard";
import { formatFileSize } from "@/lib/image";
import { getContrastTextColor } from "@/lib/color";
import { getYouTubeEmbedUrl } from "@/lib/video";
import { withProtocol } from "@/lib/url";

type ThemeStyle = CSSProperties & Record<string, string>;

type IconComponent = ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

const SOCIAL_ICONS: {
  key: keyof Profile;
  label: string;
  icon: IconComponent;
}[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: TwitterXIcon,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    key: "linktree",
    label: "Linktree",
    icon: Link2,
  },
  {
    key: "customLink1",
    label: "Link",
    icon: Link2,
  },
  {
    key: "customLink2",
    label: "Link",
    icon: Link2,
  },
];

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [shareCopied, setShareCopied] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const username = params.username?.toLowerCase();

    if (!username) {
      setReady(true);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch(
          `/api/profiles?username=${encodeURIComponent(username)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          if (!cancelled) setReady(true);
          return;
        }

        const data = await response.json();

        if (cancelled) return;

        if (data?.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [params.username]);

  async function handleShare() {
    if (!profile) return;

    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://identishareapp.vercel.app/profile/${profile.username}`;

    const fullName = [
      profile.firstName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    if (navigator.share) {
      try {
        await navigator.share({
          title: fullName || profile.username,
          text: `Check out ${
            fullName || profile.username
          }'s IdentiShare profile`,
          url,
        });
      } catch {
        // User cancelled the share sheet.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      setShareCopied(true);

      setTimeout(() => {
        setShareCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable.
    }
  }

  if (!ready) {
    return (
      <PhoneViewport>
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-ink-soft">
            Loading...
          </p>
        </div>
      </PhoneViewport>
    );
  }

  if (!profile) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            This profile isn&apos;t available. It may not exist,
            or there was a problem loading it.
          </p>

          <Link
            href="/"
            className="text-sm text-gold font-medium"
          >
            Back to IdentiShare
          </Link>
        </div>
      </PhoneViewport>
    );
  }

  const fullName = [
    profile.prefix,
    profile.firstName,
    profile.lastName,
    profile.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const initials =
    `${profile.firstName?.[0] ?? ""}${
      profile.lastName?.[0] ?? ""
    }`.toUpperCase() || "?";

  const phoneActions = [
    {
      label: "Personal phone",
      value: profile.personalPhone,
    },
    {
      label: "Official phone",
      value: profile.officialPhone,
    },
  ].filter((p) => p.value);

  const emailActions = [
    {
      label: "Personal email",
      value: profile.personalEmail,
    },
    {
      label: "Official email",
      value: profile.officialEmail,
    },
  ].filter((e) => e.value);

  const filledSocials = SOCIAL_ICONS.filter((s) =>
    Boolean(profile[s.key])
  );

  const ownerEmail =
    profile.officialEmail || profile.personalEmail;

  const backgroundColor =
    profile.backgroundColor || "#fefdfb";

  const accentColor =
    profile.accentColor || "#ad8a3f";

  const pageTextColor =
    getContrastTextColor(backgroundColor);

  const accentForeground =
    getContrastTextColor(accentColor);

  const videoEmbedUrl = profile.portfolioVideo
    ? getYouTubeEmbedUrl(profile.portfolioVideo)
    : null;

  const themeStyle: ThemeStyle = {
    "--color-paper": backgroundColor,
    "--color-ink": pageTextColor,
    "--color-ink-soft":
      pageTextColor === "#ffffff"
        ? "rgba(255,255,255,0.72)"
        : "rgba(23,21,15,0.65)",
    "--color-ivory": `color-mix(in srgb, ${backgroundColor} 90%, ${pageTextColor} 10%)`,
    "--color-gold-line": `color-mix(in srgb, ${pageTextColor} 18%, transparent)`,
    "--color-gold": accentColor,
    "--color-gold-soft": accentColor,
  };

  return (
    <div style={themeStyle}>
      <PhoneViewport>
        <div className="min-h-full relative flex flex-col pb-10">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-ivory to-gold-soft/40">
            {profile.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverImage}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-paper to-transparent" />
          </div>

          <div className="relative z-10 px-6 -mt-14 text-center">
            <div
              className="mx-auto w-28 h-28 rounded-full border-4 border-paper overflow-hidden flex items-center justify-center font-[family-name:var(--font-display)] text-3xl shadow-lg"
              style={
                profile.profilePhoto
                  ? undefined
                  : {
                      backgroundColor: accentColor,
                      color: accentForeground,
                    }
              }
            >
              {profile.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profilePhoto}
                  alt={
                    fullName || "Profile photo"
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-ink">
              {fullName || profile.username}
            </h1>

            {profile.title && (
              <p className="text-sm text-ink-soft">
                {profile.title}
              </p>
            )}

            {profile.company && (
              <p className="text-xs text-ink-soft/80">
                {profile.company}
              </p>
            )}

            {profile.bio && (
              <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  downloadVCard(profile)
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: accentColor,
                  color: accentForeground,
                }}
              >
                <Contact className="w-4 h-4" />
                Save Contact
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share profile"
                className="w-[52px] shrink-0 flex items-center justify-center rounded-full border hover:opacity-80 transition-opacity"
                style={{
                  borderColor: accentColor,
                  color: pageTextColor,
                }}
              >
                {shareCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {(phoneActions.length > 0 ||
              emailActions.length > 0 ||
              profile.whatsapp ||
              profile.website ||
              profile.address) && (
              <div className="mt-6 grid grid-cols-3 gap-2 text-left">
                {phoneActions.map((p) => (
                  <ActionButton
                    key={p.label}
                    icon={Phone}
                    label={p.label}
                    href={`tel:${p.value}`}
                    accentColor={accentColor}
                  />
                ))}

                {emailActions.map((e) => (
                  <ActionButton
                    key={e.label}
                    icon={Mail}
                    label={e.label}
                    href={`mailto:${e.value}`}
                    accentColor={accentColor}
                  />
                ))}

                {profile.whatsapp && (
                  <ActionButton
                    icon={WhatsAppIcon}
                    label="WhatsApp"
                    href={`https://wa.me/${profile.whatsapp.replace(
                      /\D/g,
                      ""
                    )}`}
                    external
                    accentColor={accentColor}
                  />
                )}

                {profile.website && (
                  <ActionButton
                    icon={Globe}
                    label="Website"
                    href={withProtocol(
                      profile.website
                    )}
                    external
                    accentColor={accentColor}
                  />
                )}

                {profile.address && (
                  <ActionButton
                    icon={MapPin}
                    label="Address"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      profile.address
                    )}`}
                    external
                    accentColor={accentColor}
                  />
                )}
              </div>
            )}

            {filledSocials.length > 0 && (
              <div className="mt-7 flex items-center justify-center flex-wrap gap-3">
                {filledSocials.map((s) => (
                  <a
                    key={s.key}
                    href={withProtocol(
                      profile[s.key] as string
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: accentColor,
                    }}
                  >
                    <s.icon
                      className="w-5 h-5"
                      style={{
                        color: accentForeground,
                      }}
                    />
                  </a>
                ))}
              </div>
            )}

            {profile.workImages.length > 0 && (
              <div className="mt-8 text-left">
                <h2 className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-2">
                  Images
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {profile.workImages.map(
                    (src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setLightboxIndex(i)
                        }
                        className="block aspect-square rounded-lg overflow-hidden border border-gold-line hover:opacity-90 transition-opacity"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {videoEmbedUrl && (
              <div className="mt-8 text-left">
                <h2 className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-2">
                  Video
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden border border-gold-line">
                  <iframe
                    src={videoEmbedUrl}
                    title="Portfolio video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {profile.portfolio && (
              <div className="mt-8 text-left">
                <h2 className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-2">
                  Portfolio
                </h2>

                <div className="flex items-center gap-2.5 rounded-xl border border-gold-line bg-paper px-4 py-3">
                  <FileText className="w-4 h-4 text-gold shrink-0" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">
                      {profile.portfolioFileName || "Portfolio file"}
                    </p>

                    {profile.portfolioFileSize > 0 && (
                      <p className="text-xs text-ink-soft">
                        {formatFileSize(
                          profile.portfolioFileSize
                        )}
                      </p>
                    )}
                  </div>

                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold font-medium shrink-0"
                  >
                    Preview
                  </a>

                  <a
                    href={profile.portfolio}
                    download={
                      profile.portfolioFileName || undefined
                    }
                    aria-label="Download portfolio"
                    className="text-ink-soft shrink-0"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {ownerEmail && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() =>
                    setExchangeOpen(true)
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: accentColor,
                    color: accentForeground,
                  }}
                >
                  <Handshake className="w-4 h-4" />
                  Exchange Contact
                </button>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-gold-line bg-ivory px-5 py-6 text-center">
              <p className="text-xs text-ink-soft">
                Like what you see?
              </p>

              <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-ink">
                Create your own IdentiShare profile
              </h3>

              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </PhoneViewport>

      {ownerEmail && (
        <ExchangeContactModal
          open={exchangeOpen}
          onClose={() =>
            setExchangeOpen(false)
          }
          ownerName={
            fullName || profile.username
          }
          ownerEmail={ownerEmail}
        />
      )}

      <ImageLightbox
        src={
          lightboxIndex !== null
            ? profile.workImages[
                lightboxIndex
              ]
            : null
        }
        alt={`Image ${
          (lightboxIndex ?? 0) + 1
        }`}
        downloadName={`${profile.username}-image-${
          (lightboxIndex ?? 0) + 1
        }.jpg`}
        onClose={() =>
          setLightboxIndex(null)
        }
      />
    </div>
  );
}