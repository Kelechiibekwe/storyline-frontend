import { NextResponse } from "next/server";

export async function GET() {
  const recentEpisodes = [
    {
      id: 1,
      title: "Morning Meditation Journey",
      lastPlayed: "2 hours ago",
      duration: "15:30",
      progress: 85, // percentage completed
      imageUrl: "/placeholder.svg?height=100&width=100&text=Meditation",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-15",
      description: "Start your day with mindfulness and inner peace.",
    },
    {
      id: 2,
      title: "Productivity Hacks for Entrepreneurs",
      lastPlayed: "Yesterday",
      duration: "32:15",
      progress: 45,
      imageUrl: "/placeholder.svg?height=100&width=100&text=Business",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-14",
      description: "Learn the secrets of highly productive entrepreneurs.",
    },
    {
      id: 3,
      title: "Deep Sleep Stories",
      lastPlayed: "2 days ago",
      duration: "28:00",
      progress: 100,
      imageUrl: "/placeholder.svg?height=100&width=100&text=Sleep",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-13",
      description: "Relaxing stories to help you fall asleep peacefully.",
    },
    {
      id: 4,
      title: "Focus Music for Work",
      lastPlayed: "3 days ago",
      duration: "45:00",
      progress: 67,
      imageUrl: "/placeholder.svg?height=100&width=100&text=Focus",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-12",
      description: "Instrumental music designed to enhance concentration.",
    },
    {
      id: 5,
      title: "Daily Affirmations",
      lastPlayed: "1 week ago",
      duration: "12:30",
      progress: 30,
      imageUrl: "/placeholder.svg?height=100&width=100&text=Mindset",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-11",
      description: "Positive affirmations to start your day right.",
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json(recentEpisodes);
}
