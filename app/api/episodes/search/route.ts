import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  const allEpisodes = [
    {
      id: 1,
      title: "Morning Meditation Journey",
      duration: "15:30",
      category: "wellness",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Meditation",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-15",
      description: "Start your day with mindfulness and inner peace.",
    },
    {
      id: 2,
      title: "Productivity Hacks for Entrepreneurs",
      duration: "32:15",
      category: "business",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Business",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-14",
      description: "Learn the secrets of highly productive entrepreneurs.",
    },
    {
      id: 9,
      title: "JavaScript Fundamentals",
      duration: "42:30",
      category: "technology",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Code",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-07",
      description: "Master the basics of JavaScript programming.",
    },
  ];

  let filteredEpisodes = allEpisodes;

  // Filter by search query
  if (query) {
    filteredEpisodes = filteredEpisodes.filter(
      (episode) =>
        episode.title.toLowerCase().includes(query.toLowerCase()) ||
        episode.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by category
  if (category !== "all") {
    filteredEpisodes = filteredEpisodes.filter(
      (episode) => episode.category === category
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    episodes: filteredEpisodes,
    total: filteredEpisodes.length,
    query,
    category,
  });
}
