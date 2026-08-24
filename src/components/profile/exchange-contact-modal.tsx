"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { TextAreaField } from "@/components/ui/text-area-field";
import { PrimaryButton } from "@/components/ui/primary-button";

interface ExchangeContactModalProps {
  open: boolean;
  onClose: () => void;
  ownerName: string;
  ownerEmail: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

export function ExchangeContactModal({
  open,
  onClose,
  ownerName,
  ownerEmail,
}: ExchangeContactModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: FormErrors = {};

    if (!fullName.trim()) next.fullName = "Your name is required.";
    if (!email.trim()) {
      next.email = "Your email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = encodeURIComponent(
      `New contact via IdentiShare — ${fullName.trim()}`
    );
    const bodyLines = [
      `Name: ${fullName.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      `Email: ${email.trim()}`,
      "",
      "Note:",
      note.trim() || "(no note)",
    ].filter(Boolean) as string[];
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-sm max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-paper p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-ink">
            Exchange contact
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-soft"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-ink-soft mb-5">
          Share your details with {ownerName || "this profile"} — this opens
          your email app to send it.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="Full name"
            name="visitorName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            placeholder="Your name"
          />
          <TextField
            label="Phone number"
            type="tel"
            name="visitorPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
          />
          <TextField
            label="Email address"
            type="email"
            name="visitorEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <TextAreaField
            label="Note"
            name="visitorNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Say a bit about why you're reaching out."
          />
          <PrimaryButton type="submit">Share your details</PrimaryButton>
        </form>
      </div>
    </div>
  );
}