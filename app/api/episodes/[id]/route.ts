import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { progress, currentTime } = await request.json();
  const episodeId = params.id;

  // Simulate saving progress to database
  await new Promise((resolve) => setTimeout(resolve, 150));

  return NextResponse.json({
    success: true,
    episodeId: Number.parseInt(episodeId),
    progress,
    currentTime,
    message: "Progress saved successfully",
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const episodeId = Number.parseInt(params.id);

  // Simulate fetching progress from database
  const progressData = {
    episodeId,
    progress: Math.floor(Math.random() * 100), // Random progress for demo
    currentTime: Math.floor(Math.random() * 1800), // Random time up to 30 minutes
    lastUpdated: new Date().toISOString(),
  };

  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(progressData);
}
