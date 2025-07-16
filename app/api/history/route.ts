import { NextResponse } from "next/server";

export async function GET() {
  const history = [
    {
      id: 4,
      title: "Morning Meditation",
      lastPlayed: "2 hours ago",
      duration: "10:30",
      playCount: 3,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      title: "Productivity Tips",
      lastPlayed: "Yesterday",
      duration: "12:15",
      playCount: 1,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      title: "Sleep Stories",
      lastPlayed: "2 days ago",
      duration: "20:00",
      playCount: 5,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      title: "Breathing Exercises",
      lastPlayed: "3 days ago",
      duration: "8:20",
      playCount: 2,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      title: "Focus Music",
      lastPlayed: "4 days ago",
      duration: "45:00",
      playCount: 8,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 9,
      title: "Daily Affirmations",
      lastPlayed: "1 week ago",
      duration: "5:30",
      playCount: 12,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(history);
}
