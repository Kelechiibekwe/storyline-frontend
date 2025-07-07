"use client"
import { useState } from "react"
import { Bot, Play, Volume2, Mic, MessageCircle, Sparkles, Brain } from "lucide-react"

import localFont from 'next/font/local'

// register your font files and their weights/styles
const myFont = localFont({
  src: [
    {
      path: '../public/fonts/Larken/LarkenDEMO-Medium.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-myfont', // optional CSS variable
})

export default function FeatureShowcase() {
  const [frontCard, setFrontCard] = useState<"first" | "second" | null>(null)

  return (
    // <div className="py-12 md:py-24 lg:py-32 w-full">
    <div className="py-12 md:py-24 lg:py-32 w-full">
      <h1 className="container mx-auto text-center font-bold pb-16 sm:text-5xl xl:text-6xl/none">
        <span>Explore endless</span>
        <br />
        <span>possibilities</span>
      </h1>
      <div className="max-w-4xl mx-auto">
        {/* Custom grid layout to match the screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_3fr] grid-rows-4 lg:grid-rows-[4fr_3fr] gap-6 lg:gap-8 h-auto lg:h-[700px]">
          {/* Personalized Prompts Section - Takes up left column, full height */}
          <div className="lg:row-span-2 bg-[#c3b2e7] rounded-3xl p-6 md:p-6 lg:p-10 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer min-h-[500px] lg:h-auto">
            <h2 className={` text-3xl font-bold text-[#52225E] mb-4 md:mb-6 group-hover:text-gray-900`}>
              Personalized Prompts
            </h2>

            {/* AI Prompt mockups */}
            <div className="relative mb-6 md:mb-8">
              <div
                className="absolute top-0 left-4 transform rotate-12 z-10 transition-all duration-700 group-hover:rotate-6 group-hover:-translate-y-2 cursor-pointer"
                onClick={() => setFrontCard(frontCard === "first" ? null : "first")}
                style={{ zIndex: frontCard === "first" ? 50 : 10 }}
              >
                <div
                  className={`bg-white rounded-lg shadow-lg p-4 w-32 md:w-40 h-72 md:h-88 hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    frontCard === "first" ? "scale-110 shadow-2xl" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <Bot className="w-4 h-4 text-blue-500 mr-1 transition-colors duration-300 group-hover/tool:text-blue-700" />
                      <span className="text-xs font-semibold text-blue-500 transition-colors duration-300 group-hover/tool:text-blue-700">
                        AI Prompt
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed transition-transform duration-300 hover:scale-105 flex-1">
                      "What emotions came up for you today that you haven't felt in a while?"
                    </div>
                  </div>
                  <div className="mt-auto pt-2">
                    <div className="w-full h-1 bg-blue-100 rounded-full">
                      <div className="w-3/4 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="ml-8 md:ml-12 mt-4 transition-all duration-700 group-hover:translate-x-2 group-hover:-translate-y-1 cursor-pointer"
                onClick={() => setFrontCard(frontCard === "second" ? null : "second")}
                style={{ zIndex: frontCard === "second" ? 50 : "auto" }}
              >
                <div
                  className={`bg-white rounded-lg shadow-lg p-4 w-40 md:w-48 h-72 md:h-88 hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    frontCard === "second" ? "scale-110 shadow-2xl" : ""
                  }`}
                >
                  <div>
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded p-3 mb-3 relative">
                      <div className="text-center">
                        <Sparkles className="w-6 h-6 text-white mx-auto mb-1" />
                        <div className="text-white font-bold text-sm">ChatGPT Powered</div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        SMART
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 transition-transform duration-300 hover:scale-105 flex-1 flex flex-col justify-between">
                      <div>Analyzes your past entries for deeper insights</div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="text-xs text-gray-500">Pattern Recognition</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="text-xs text-gray-500">Emotional Tracking</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="text-xs text-gray-500">Growth Insights</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-gray-700">Stats</div>
                    <div className="flex justify-between text-xxs text-gray-500">
                      <div>342</div>
                      <div>😃</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Features bar */}
            <div className="bg-white rounded-2xl p-4 shadow-lg transition-all lg:-ml-20  duration-300 hover:shadow-xl group-hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center group/tool cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 group-hover/tool:scale-110 group-hover/tool:rotate-3">
                    <Brain className="w-5 h-5 text-blue-500 transition-colors duration-300 group-hover/tool:text-blue-700" />
                  </div>
                  <span className="text-xs text-gray-600 transition-colors duration-300 group-hover/tool:text-blue-700">
                    Analysis
                  </span>
                </div>
                <div className="flex flex-col items-center group/tool cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 group-hover/tool:scale-110 group-hover/tool:rotate-3">
                    <Bot className="w-5 h-5 text-purple-500 transition-colors duration-300 group-hover/tool:text-purple-700" />
                  </div>
                  <span className="text-xs text-gray-600 transition-colors duration-300 group-hover/tool:text-purple-700">
                    AI
                  </span>
                </div>
                <div className="flex flex-col items-center group/tool cursor-pointer">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 group-hover/tool:scale-110 group-hover/tool:rotate-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 transition-colors duration-300 group-hover/tool:text-yellow-700" />
                  </div>
                  <span className="text-xs text-gray-600 transition-colors duration-300 group-hover/tool:text-yellow-700">
                    Insights
                  </span>
                </div>
                <div className="flex flex-col items-center group/tool cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 group-hover/tool:scale-110 group-hover/tool:rotate-3">
                    <MessageCircle className="w-5 h-5 text-green-500 transition-colors duration-300 group-hover/tool:text-green-700" />
                  </div>
                  <span className="text-xs text-gray-600 transition-colors duration-300 group-hover/tool:text-green-700">
                    Prompts
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mt-4 md:mt-8 text-base md:text-[15px] group-hover:text-gray-900">
              Powered by ChatGPT, Storyline analyzes your past entries and journaling habits to craft prompts that spark
              genuine insight.
            </p>
          </div>

          {/* Text-to-Speech Playback Section - Top right */}
          <div className="lg:col-span-2 bg-[#f682a5] rounded-3xl p-6 relative transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer min-h-[200px] lg:h-auto">
            <h2 className={` text-3xl md:text-[2rem] font-bold text-[#52225E] mb-2 group-hover:text-gray-900`}>
              Text‑to‑Speech Playback
            </h2>
            <p className="text-gray-700 mb-4 text-sm md:text-[15px] group-hover:text-gray-900">
              Your journal entries come alive as natural-sounding audio, thanks to ElevenLabs' advanced text-to-speech
              engine.
            </p>

            {/* Audio player and waveform mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-4 mr-8 md:mr-12 md:mb-4 transition-all duration-500 hover:shadow-xl group-hover:bg-gray-50 group-hover:translate-x-2">
                <div className="text-sm text-gray-600 mb-4">Listen to your journal entry</div>

                {/* Audio player interface */}
                <div className="space-y-4 mb-4">
                  <div className="text-sm font-medium">"Today I reflected on my goals..."</div>

                  {/* Waveform visualization */}
                  <div className="flex items-center space-x-1 py-2">
                    {[...Array(50)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded ${i < 16 ? "bg-blue-500 h-6 animate-pulse" : "bg-gray-300 h-3"}`}
                      ></div>
                    ))}
                  </div>

                  {/* Player controls */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>0:23</span>
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>ElevenLabs Voice</span>
                    </div>
                    <span>2:15</span>
                  </div>
                </div>

                <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300 hover:bg-gray-900 hover:scale-105 hover:shadow-lg active:scale-95">
                  <Play className="w-4 h-4 mr-2" />
                  Play Audio
                </button>
              </div>
            </div>
          </div>

          {/* AI-Generated Podcasts Section - Bottom left */}
          <div className="bg-[#c9da8f] rounded-3xl p-6 md:p-8 relative transition-all duration-500 hover:shadow-2xl hover:scale-105 group cursor-pointer min-h-[200px] lg:h-auto">
            {/* Podcast player mockup */}
            <div className="relative flex flex-col items-center md:-right-8 md:-top-2 md:rotate-12 sm:items-start">
              <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-4 text-white shadow-lg w-full max-w-sm sm:max-w-md md:max-w-sm md:w-[190px] md:h-[150px] transition-all duration-500 hover:shadow-2xl hover:scale-105 group-hover:bg-gray-900 cursor-pointer">
                <div className="flex justify-between items-start mb-4 md:mb-2">
                  <span className="text-sm md:text-xs font-medium transition-all duration-300 group-hover:text-green-200">
                    Your Story Podcast
                  </span>
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-lg md:text-sm font-bold mb-2 transition-all duration-300 group-hover:text-green-200">
                  Episode #47
                </div>
                <div className="text-sm text-gray-300 mb-4 transition-all duration-300 group-hover:text-green-200">
                  My Journey This Week
                </div>
                <div className="flex justify-between items-center">
                  <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-xs font-medium flex items-center transition-all duration-300 hover:bg-green-100 hover:scale-105 hover:shadow-md active:scale-95">
                    <Play className="w-3 h-3 mr-1" />
                    PLAY
                  </button>
                  <span className="text-xs text-gray-400">12:34</span>
                </div>
              </div>
            </div>
            <div className={` text-3xl md:text-[1.5rem] font-bold text-[#1c471f] group-hover:text-gray-900`}>
              Stories
            </div>
            <p className="text-gray-700 mb-6 text-sm md:text-[14px] group-hover:text-gray-900">
              Turn your reflections into engaging podcast episodes
            </p>
          </div>

          {/* Interactive Reflection Section - Bottom right */}
          <div className="bg-[#F9A474] rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer min-h-[200px] lg:h-auto">
            <h2 className={` text-3xl md:text-[1.5rem] font-bold text-[#582614] group-hover:text-gray-900`}>
              Reflection
            </h2>
            <p className="text-gray-700 mb-6 md:mb-2 text-sm md:text-[15px] group-hover:text-gray-900">
              As you write, Storyline asks real-time.
            </p>

            {/* Interactive chat threads */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-start space-x-3 p-2 rounded-lg transition-all duration-300  cursor-pointer group/message">
                {/* <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover/message:scale-110">
                  <Bot className="w-5 h-5 text-white" />
                </div> */}
                <div className="flex-1 p-3">
                  <div className="font-semibold text-[12px] text-blue-600 mb-1">Storyline AI</div>
                  <div className="text-[10px] text-gray-700">
                    "What do you think triggered that feeling? Let's explore it together."
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2 rounded-lg transition-all duration-300 cursor-pointer group/message">
                {/* <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover/message:scale-110">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div> */}
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <div className="font-semibold text-[12px] text-purple-600 mb-1">Deep Question</div>
                  <div className="text-[10px] text-gray-700 transition-colors duration-300 group-hover/message:text-gray-900">
                    "How might this experience change your perspective going forward?"
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-yellow-200 hover:scale-105 cursor-pointer group/message">
                {/* <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover/message:scale-110">
                  <Sparkles className="w-5 h-5 text-white" />
                </div> */}
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <div className="font-semibold text-sm text-green-600 mb-1">Insight Prompt</div>
                  <div className="text-xs text-gray-700 transition-colors duration-300 group-hover/message:text-gray-900">
                    "I notice you mentioned growth. What does growth mean to you right now?"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
