import type { Profile } from "@/lib/storage";
import { withProtocol } from "@/lib/url";

// Basic vCard 3.0 field escaping per RFC 2426: backslash, comma, semicolon,
// and newline all need escaping inside a field value.
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// RFC 2425/2426 requires long content lines to be folded at 75 characters,
// with continuation lines starting with a single space. Without this, very
// long lines (the base64 PHOTO field especially) can be rejected or
// mis-parsed by strict vCard readers.
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const chunks: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);

  while (rest.length > 0) {
    chunks.push(rest.slice(0, 74)); // 74 + 1 leading space on continuation = 75
    rest = rest.slice(74);
  }

  return chunks.join("\r\n ");
}

// Generates a vCard including every available phone number and contact
// field on the profile. Missing fields are simply omitted — never filled
// with placeholder data. See spec §15.
export function generateVCard(profile: Profile): string {
  const fullName = [profile.prefix, profile.firstName, profile.lastName, profile.suffix]
    .filter(Boolean)
    .join(" ");

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(profile.lastName)};${escapeVCardValue(profile.firstName)};;${escapeVCardValue(
      profile.prefix
    )};${escapeVCardValue(profile.suffix)}`,
    `FN:${escapeVCardValue(fullName || profile.username)}`,
  ];

  if (profile.title) lines.push(`TITLE:${escapeVCardValue(profile.title)}`);
  if (profile.company) lines.push(`ORG:${escapeVCardValue(profile.company)}`);

  // Every available phone number must be represented — spec §15.
  if (profile.personalPhone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.personalPhone)}`);
  }
  if (profile.officialPhone) {
    lines.push(`TEL;TYPE=WORK:${escapeVCardValue(profile.officialPhone)}`);
  }
  if (profile.whatsapp) {
    lines.push(`TEL;TYPE=WHATSAPP:${escapeVCardValue(profile.whatsapp)}`);
  }

  if (profile.personalEmail) {
    lines.push(`EMAIL;TYPE=HOME:${escapeVCardValue(profile.personalEmail)}`);
  }
  if (profile.officialEmail) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVCardValue(profile.officialEmail)}`);
  }

  // No TYPE label — this is a single general-purpose address field, not
  // necessarily a work address, so we don't assume one.
  if (profile.address) {
    lines.push(`ADR:;;${escapeVCardValue(profile.address)};;;;`);
  }
  if (profile.website) {
    lines.push(`URL:${escapeVCardValue(withProtocol(profile.website))}`);
  }

  if (profile.profilePhoto) {
    const base64 = profile.profilePhoto.split(",")[1];
    if (base64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${base64}`);
  }

  if (profile.bio) lines.push(`NOTE:${escapeVCardValue(profile.bio)}`);

  lines.push("END:VCARD");

  return lines.map(foldLine).join("\r\n");
}

export function downloadVCard(profile: Profile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  const safeName = `${profile.firstName}-${profile.lastName}`.trim().replace(/\s+/g, "-") || profile.username;
  link.download = `${safeName}.vcf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}