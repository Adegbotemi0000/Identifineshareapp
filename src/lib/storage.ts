// Prototype-only storage layer. Not production architecture — see spec §10.
// Centralised here so localStorage keys are never scattered across the app.

export const STORAGE_KEYS = {
  pendingSignup: "identishare_pending_signup",
  profile: "identishare_profile",
  username: "identishare_username",
  profileCompleted: "identishare_profile_completed",
  workImages: "identishare_work_images",
  portfolioName: "identishare_portfolio_name",
  portfolioSize: "identishare_portfolio_size",
} as const;

export type AccountType = "personal" | "corporate";

export interface PendingSignup {
  accountType: AccountType;
  fullName?: string;
  companyName?: string;
  adminName?: string;
  email: string;
  phone: string;
  password: string;
  termsAccepted: boolean;
  verified: boolean;
}

// Theming is driven by two independent colors: backgroundColor (the page
// base) and accentColor (buttons, icon badges, "text & symbols"). Both feed
// into computed contrast-safe foregrounds — see lib/color.ts. This two-color
// pattern is meant to be reused as-is for corporate branding later.
export interface Profile {
  id: string;
  accountType: AccountType;
  username: string;

  prefix: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  suffix: string;
  bio: string;

  personalEmail: string;
  officialEmail: string;
  personalPhone: string;
  officialPhone: string;
  address: string;

  website: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  whatsapp: string;
  linktree: string;
  customLink1: string;
  customLink2: string;

  backgroundColor: string;
  accentColor: string;
  profilePhoto: string;
  coverImage: string;

  workImages: string[];
  portfolio: string;
  portfolioFileName: string;
  portfolioFileSize: number;
  portfolioVideo: string;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function savePendingSignup(data: PendingSignup) {
  try {
    localStorage.setItem(STORAGE_KEYS.pendingSignup, JSON.stringify(data));
  } catch {
    // ignore — calling UI surfaces its own error state
  }
}

export function getPendingSignup(): PendingSignup | null {
  if (typeof window === "undefined") return null;
  return safeParse<PendingSignup>(localStorage.getItem(STORAGE_KEYS.pendingSignup));
}

export function markPendingSignupVerified() {
  const current = getPendingSignup();
  if (!current) return;
  savePendingSignup({ ...current, verified: true });
}

export function clearPendingSignup() {
  try {
    localStorage.removeItem(STORAGE_KEYS.pendingSignup);
  } catch {
    // ignore
  }
}

export const RESERVED_USERNAMES = [
  "signup",
  "verify",
  "username",
  "signin",
  "forgot-password",
  "profile-setup",
  "dashboard",
  "share",
  "settings",
  "profile",
  "api",
  "admin",
  "help",
  "about",
  "contact",
  "terms",
  "privacy",
  "identishare",
];

export function saveUsername(username: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.username, username);
  } catch {
    // ignore
  }
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.username);
}

function splitName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export function defaultProfile(seed: {
  accountType: AccountType;
  username: string;
  fullName?: string;
  companyName?: string;
  email: string;
  phone: string;
}): Profile {
  const { firstName, lastName } = splitName(seed.fullName);

  return {
    id: `${Date.now()}`,
    accountType: seed.accountType,
    username: seed.username,
    prefix: "",
    firstName,
    lastName,
    title: "",
    company: seed.companyName ?? "",
    suffix: "",
    bio: "",
    personalEmail: seed.email,
    officialEmail: "",
    personalPhone: seed.phone,
    officialPhone: "",
    address: "",
    website: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    facebook: "",
    whatsapp: "",
    linktree: "",
    customLink1: "",
    customLink2: "",
    backgroundColor: "#fefdfb",
    accentColor: "#ad8a3f",
    profilePhoto: "",
    coverImage: "",
    workImages: [],
    portfolio: "",
    portfolioFileName: "",
    portfolioFileSize: 0,
    portfolioVideo: "",
  };
}

export function saveProfile(profile: Profile): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error(
      "Failed to save profile — likely exceeded local storage capacity.",
      err
    );
    return false;
  }
}

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return safeParse<Profile>(localStorage.getItem(STORAGE_KEYS.profile));
}

export function markProfileCompleted() {
  try {
    localStorage.setItem(STORAGE_KEYS.profileCompleted, "true");
  } catch {
    // ignore
  }
}

export function isProfileCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.profileCompleted) === "true";
}

export function saveWorkImagesCache(images: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.workImages, JSON.stringify(images));
  } catch {
    // ignore
  }
}

export function getWorkImagesCache(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.workImages)) ?? [];
}

export function savePortfolioMeta(name: string, size: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.portfolioName, name);
    localStorage.setItem(STORAGE_KEYS.portfolioSize, String(size));
  } catch {
    // ignore
  }
}

export function getPortfolioMeta(): { name: string; size: number } | null {
  if (typeof window === "undefined") return null;
  const name = localStorage.getItem(STORAGE_KEYS.portfolioName);
  const size = localStorage.getItem(STORAGE_KEYS.portfolioSize);
  if (!name || !size) return null;
  return { name, size: Number(size) };
}

const COMPLETION_FIELDS: { key: keyof Profile; weight: number }[] = [
  { key: "firstName", weight: 1 },
  { key: "lastName", weight: 1 },
  { key: "title", weight: 1 },
  { key: "company", weight: 1 },
  { key: "bio", weight: 1 },
  { key: "personalEmail", weight: 1 },
  { key: "personalPhone", weight: 1 },
  { key: "address", weight: 1 },
  { key: "website", weight: 1 },
  { key: "profilePhoto", weight: 2 },
  { key: "portfolio", weight: 1 },
];

export function calculateProfileCompletion(profile: Profile): number {
  const totalWeight = COMPLETION_FIELDS.reduce((sum, f) => sum + f.weight, 0);
  const filledWeight = COMPLETION_FIELDS.reduce((sum, f) => {
    const value = profile[f.key];
    const filled = Array.isArray(value) ? value.length > 0 : Boolean(value);
    return filled ? sum + f.weight : sum;
  }, 0);

  const linkFields: (keyof Profile)[] = [
    "linkedin",
    "instagram",
    "twitter",
    "facebook",
    "whatsapp",
  ];
  const hasAnyLink = linkFields.some((key) => Boolean(profile[key]));
  const linkWeight = 1;

  const combinedWeight = totalWeight + linkWeight;
  const combinedFilled = filledWeight + (hasAnyLink ? linkWeight : 0);

  return Math.round((combinedFilled / combinedWeight) * 100);
}

export function clearAllIdentishareData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}