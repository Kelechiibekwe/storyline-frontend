import { NextResponse } from "next/server";

export async function GET() {
  const preferences = {
    playbackSpeed: 1.0,
    autoPlay: true,
    skipSilence: false,
    sleepTimer: null,
    theme: "light",
    notifications: {
      newEpisodes: true,
      playbackReminders: false,
    },
    audioQuality: "high",
  };

  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(preferences);
}

export async function PUT(request: Request) {
  const preferences = await request.json();

  // Simulate saving preferences
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    success: true,
    preferences,
    message: "Preferences updated successfully",
  });
}
