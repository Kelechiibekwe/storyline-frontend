import { NextResponse } from "next/server";

export async function GET() {
  const favorites = [
    {
      id: 2,
      title: "Productivity Hacks for Entrepreneurs",
      duration: "32:15",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Business",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-14",
      isFavorited: true,
      favoritedAt: "2024-01-16T10:30:00Z",
    },
    {
      id: 3,
      title: "Deep Sleep Stories",
      duration: "28:00",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Sleep",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-13",
      isFavorited: true,
      favoritedAt: "2024-01-15T22:15:00Z",
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const { episodeId } = await request.json();

  // Simulate adding to favorites
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    success: true,
    episodeId,
    isFavorited: true,
    message: "Episode added to favorites",
  });
}

export async function DELETE(request: Request) {
  const { episodeId } = await request.json();

  // Simulate removing from favorites
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    success: true,
    episodeId,
    isFavorited: false,
    message: "Episode removed from favorites",
  });
}
