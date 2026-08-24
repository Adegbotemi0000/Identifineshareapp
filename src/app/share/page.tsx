"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  Share2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { PhoneViewport } from "@/components/layout/phone-viewport";
import { getProfile, type Profile } from "@/lib/storage";

export default function SharePage() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setProfile(getProfile());
    setReady(true);
  }, []);

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

  if (profile === null) {
    return (
      <PhoneViewport>
        <div className="px-8 py-10 h-full flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-ink-soft">
            No profile found yet. Let&apos;s get you set up.
          </p>

          <Link
            href="/signup"
            className="text-sm text-gold font-medium"
          >
            Create your profile
          </Link>
        </div>
      </PhoneViewport>
    );
  }

  const currentProfile: Profile = profile;

  const publicUrl = `https://identishare.com/${currentProfile.username}`;

  const fullName = [
    currentProfile.firstName,
    currentProfile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  function handleDownload() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = `${currentProfile.username}-qr.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable.
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fullName || currentProfile.username,
          text: `Check out ${
            fullName || currentProfile.username
          }'s IdentiShare profile`,
          url: publicUrl,
        });
      } catch {
        // User cancelled the share sheet.
      }

      return;
    }

    handleCopy();
  }

  return (
    <PhoneViewport>
      <div className="px-8 py-10 min-h-full flex flex-col">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <span className="mt-4 font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gold">
          IdentiShare
        </span>

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
          Share your profile
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Anyone who scans this code, or opens your link,
          lands straight on your public profile.
        </p>

        <div className="mt-8 flex flex-col items-center">
          <div className="rounded-2xl border border-gold-line bg-white p-6 shadow-sm">
            <QRCodeCanvas
              value={publicUrl}
              size={200}
              fgColor="#1b1a17"
              bgColor="#ffffff"
              level="M"
              marginSize={2}
              ref={canvasRef}
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-mono text-gold"
          >
            identishare.com/{currentProfile.username}

            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-ink text-paper py-3.5 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download QR (PNG)
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-gold-line py-3.5 text-sm font-medium text-ink hover:border-gold/50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Link
          </button>

          <Link
            href={`/profile/${currentProfile.username}`}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-gold-line py-3.5 text-sm font-medium text-ink hover:border-gold/50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Public Profile
          </Link>
        </div>
      </div>
    </PhoneViewport>
  );
}