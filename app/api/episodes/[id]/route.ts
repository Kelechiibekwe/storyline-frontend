import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { progress, currentTime } = await request.json();
//   const episodeId = params.id;

//   // Simulate saving progress to database
//   await new Promise((resolve) => setTimeout(resolve, 150));

//   return NextResponse.json({
//     success: true,
//     episodeId: Number.parseInt(episodeId),
//     progress,
//     currentTime,
//     message: "Progress saved successfully",
//   });
// }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← note the Promise here
) {
  const { id } = await params; // ← await the params
  const episodeId = Number.parseInt(id);

  // …fetch from DB, etc.
  return NextResponse.json({ episodeId });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← same change here
) {
  const { id } = await params;
  const episodeId = Number.parseInt(id);
  const { progress, currentTime } = await request.json();

  // …save progress …

  return NextResponse.json({
    success: true,
    episodeId,
    progress,
    currentTime,
    message: "Progress saved successfully",
  });
}
