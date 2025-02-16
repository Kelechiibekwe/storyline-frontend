import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { content } = await req.json()
  console.log("Received content:", content.substring(0, 50) + "...") // Log the first 50 characters

  // This is where you'd normally send the content to your ChatGPT API
  // For now, we'll just return a dummy prompt
  const dummyPrompts = [
    "What emotions are you feeling as you write this?",
    "How does this experience relate to your personal goals?",
    "If you could change one thing about this situation, what would it be?",
    "What's a metaphor that describes your current state of mind?",
    "How might this experience look different in five years?",
  ]

  const randomPrompt = dummyPrompts[Math.floor(Math.random() * dummyPrompts.length)]
  console.log("Returning prompt:", randomPrompt)

  return NextResponse.json({ prompt: randomPrompt })
}

