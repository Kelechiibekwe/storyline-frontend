"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Search,
  X,
  Clock,
  PlayCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import SaveButton from "./SaveButton";
import { LoadAndErrorButton } from "./load-button";

type HistoryItem = {
  id: number;
  title: string;
  lastPlayed: string;
  duration: string;
  progress: number;
  imageUrl?: string;
  audioUrl?: string;
  createdAt?: string;
};

type PodcastHistoryProps = {
  history: HistoryItem[];
  onPlayEpisode: (episodeId: number) => void;
  onAddToQueue?: (episode: any) => void;
};

export function PodcastHistory({
  history: initialHistory,
  onPlayEpisode,
  onAddToQueue,
}: PodcastHistoryProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [loading, setLoading] = useState(false);

  // Fetch recent episodes from API
  useEffect(() => {
    const fetchRecentEpisodes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/episodes/recent");
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching recent episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEpisodes();
  }, []);

  const filteredHistory = history.filter((episode) =>
    episode.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToQueue = (episode: HistoryItem) => {
    if (onAddToQueue) {
      onAddToQueue({
        id: episode.id,
        title: episode.title,
        audioUrl:
          episode.audioUrl ||
          "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        imageUrl: episode.imageUrl || "/placeholder.svg",
        duration:
          Number.parseInt(episode.duration.split(":")[0]) * 60 +
          Number.parseInt(episode.duration.split(":")[1]),
        createdAt: episode.createdAt || new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-2 py-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-1 px-3">
          <div className="flex items-center justify-between ">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
              {/* <History className="w-5 h-5 text-primary" /> */}
              Your Stories
              {/* <span className="text-sm font-normal text-gray-500">
              ({history.length})
            </span> */}
            </h1>
            {/* <LoadAndErrorButton /> */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex items-center">
              <img
                src="/placeholder.svg"
                className="w-3 h-3 rounded object-cover"
              />
            </div>
            <p className="flex items-center text-xs text-muted-foreground">
              18h 50m
            </p>
          </div>
        </div>
        <div className="px-2">
          <LoadAndErrorButton />
        </div>

        <div className="mx-4 my-3">
          <div className="border-t border-border" />
        </div>

        {showSearch && (
          <Input
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        )}

        <ScrollArea className="h-[60vh] lg:h-[75vh]">
          <div className="pb-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading episodes...
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No episodes found</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            ) : (
              <>
                {filteredHistory.map((episode, index) => (
                  <div
                    key={episode.id}
                    className="group px-2 py-4 sm:p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="relative">
                          <img
                            src={episode.imageUrl || "/placeholder.svg"}
                            alt={episode.title}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 shadow-sm"
                          />
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-semibold text-sm group-hover:text-primary truncate pr-2 text-gray-900">
                            {episode.title}
                          </p>
                          {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{episode.lastPlayed}</span>
                          </div> */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">
                              {episode.duration}
                            </span>
                            {/* <div className="flex items-center gap-2">
                              <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-300"
                                  style={{ width: `${episode.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {episode.progress}%
                              </span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToQueue(episode);
                          }}
                          title="Add to Up Next"
                        >
                          <Plus className="w-4 h-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white"
                          onClick={() => onPlayEpisode(episode.id)}
                        >
                          <PlayCircle className="w-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
