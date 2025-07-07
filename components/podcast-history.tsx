"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Search, X, Clock, PlayCircle } from "lucide-react"

type HistoryItem = {
  id: number
  title: string
  lastPlayed: string
  duration: string
  playCount: number
}

type PodcastHistoryProps = {
  history: HistoryItem[]
  onPlayEpisode: (episodeId: number) => void
}

export function PodcastHistory({ history, onPlayEpisode }: PodcastHistoryProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = history.filter((episode) => episode.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History className="w-5 h-5" />
            History
          </h2>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {showHistory && (
          <Input
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        )}

        <ScrollArea className="h-[40vh] md:max-h-[calc(100dvh-40rem)] pr-4">
          <div className="space-y-3">
            {filteredHistory.map((episode) => (
              <div key={episode.id} className="group p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium group-hover:text-primary">{episode.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{episode.lastPlayed}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlayEpisode(episode.id)}
                  >
                    <PlayCircle className="w-5 h-5" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{episode.duration}</span>
                  <span>Played {episode.playCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

