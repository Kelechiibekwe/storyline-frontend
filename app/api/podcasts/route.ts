import { NextResponse } from "next/server";

export async function GET() {
  // Dummy podcast data
  const podcasts = [
    {
      id: 1,
      title: "The Science of Sleep",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 1800, // 30 minutes in seconds
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Morning Meditation Journey",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 900, // 15 minutes in seconds
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      title: "Productivity Hacks for Entrepreneurs",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 2400, // 40 minutes in seconds
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      title: "Deep Focus Music",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 3600, // 60 minutes in seconds
      createdAt: "2024-01-12",
    },
    {
      id: 5,
      title: "Bedtime Stories for Adults",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg?height=300&width=300",
      duration: 1200, // 20 minutes in seconds
      createdAt: "2024-01-11",
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(podcasts);
}
