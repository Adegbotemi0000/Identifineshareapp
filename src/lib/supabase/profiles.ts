import { supabase } from "./client";
import type { Profile } from "@/lib/storage";

export async function saveProfileToCloud(profile: Profile) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: profile.id,
      username: profile.username.toLowerCase(),
      profile_data: profile,
    },
    {
      onConflict: "username",
    }
  );

  if (error) {
    console.error("Failed to save profile to Supabase:", error);
    return false;
  }

  return true;
}

export async function getProfileFromCloud(
  username: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("profile_data")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile from Supabase:", error);
    return null;
  }

  return (data?.profile_data as Profile) ?? null;
}