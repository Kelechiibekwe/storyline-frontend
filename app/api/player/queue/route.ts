import { NextResponse } from "next/server";

export async function GET() {
  const queue = [
    {
      id: 6,
      title: "Breathing Exercises for Anxiety",
      duration: "18:45",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Wellness",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-10",
      description: "Simple breathing techniques to manage anxiety.",
    },
    {
      id: 7,
      title: "Creative Writing Prompts",
      duration: "25:20",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Writing",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-09",
      description: "Spark your creativity with these writing exercises.",
    },
    {
      id: 8,
      title: "Investment Basics for Beginners",
      duration: "35:15",
      imageUrl: "/placeholder.svg?height=100&width=100&text=Finance",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      createdAt: "2024-01-08",
      description: "Learn the fundamentals of smart investing.",
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(queue);
}

export async function POST(request: Request) {
  const { episodeId } = await request.json();

  // Simulate adding episode to queue
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    success: true,
    message: `Episode ${episodeId} added to queue`,
  });
}

export async function DELETE(request: Request) {
  const { episodeId } = await request.json();

  // Simulate removing episode from queue
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    success: true,
    message: `Episode ${episodeId} removed from queue`,
  });
}
