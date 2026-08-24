// src/app/api/profiles/route.ts
import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const profile = await request.json();

    if (!profile?.username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const username = String(profile.username).toLowerCase().trim();

    const blob = await put(
      `profiles/${username}.json`,
      JSON.stringify(profile),
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      }
    );

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Failed to save profile." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toLowerCase().trim();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    let blobMeta;
    try {
      blobMeta = await head(`profiles/${username}.json`);
    } catch {
      return NextResponse.json({ profile: null }, { status: 404 });
    }

    const response = await fetch(blobMeta.url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ profile: null }, { status: 404 });
    }

    const profile = await response.json();
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile load error:", error);
    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}