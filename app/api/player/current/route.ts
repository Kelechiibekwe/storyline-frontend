import { NextResponse } from "next/server";

export async function GET() {
  const currentEpisode = {
    id: 1,
    title: "Morning Meditation Journey",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Now+Playing",
    duration: 930, // 15:30 in seconds
    createdAt: "2024-01-15",
    description:
      "Start your day with mindfulness and inner peace through guided meditation practices.",
    currentTime: 450, // 7:30 in seconds
    isPlaying: false,
  };

  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(currentEpisode);
}

export async function PUT(request: Request) {
  const { currentTime, isPlaying } = await request.json();

  // Simulate updating playback state
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json({
    success: true,
    currentTime,
    isPlaying,
    message: "Playback state updated",
  });
}
