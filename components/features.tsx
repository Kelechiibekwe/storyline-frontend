import { Lightbulb, Volume, Podcast, MessageCircle } from "lucide-react"

const features = [
    {
      title: "Personalized Prompts",
      description: "Powered by ChatGPT, Storyline analyzes your past entries and journaling habits to craft prompts that spark genuine insight.",
      icon: Lightbulb, // Or BookOpen, Sparkles, etc.
    },
    {
      title: "Text‑to‑Speech Playback",
      description: "Your journal entries come alive as natural-sounding audio, thanks to ElevenLabs' advanced text-to-speech engine.",
      icon: Volume, // Or Speaker, AudioWave, etc.
    },
    {
      title: "AI‑Generated Podcasts",
      description: "Turn your reflections into engaging podcast episodes using the Autocontent API (NotebookLM), making your story truly audible.",
      icon: Podcast, // Or Radio, Mic, etc.
    },
    {
        title: "Interactive Reflection",
        description: "As you write, Storyline asks real-time, thought-provoking questions to help you explore your feelings, challenge assumptions, and dive deeper into your thoughts.",
        icon: MessageCircle, // Or ChatBubble, QuestionMarkCircle, etc.
      },
  ]

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
