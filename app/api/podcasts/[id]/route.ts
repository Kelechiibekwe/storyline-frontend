import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const episodeId = Number.parseInt(id);

  // Dummy podcast data - in a real app this would come from a database
  const podcasts = [
    {
      id: 1,
      title: "The Science of Sleep",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 1800,
      createdAt: "2024-01-15",
      description:
        "Explore the fascinating world of sleep science and learn how to optimize your rest for better health and productivity.",
    },
    {
      id: 2,
      title: "Morning Meditation Journey",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 900,
      createdAt: "2024-01-14",
      description:
        "Start your day with mindfulness and inner peace through guided meditation practices.",
    },
  ];

  const podcast = podcasts.find((p) => p.id === episodeId);

  if (!podcast) {
    return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
  }

  return NextResponse.json(podcast);
}
