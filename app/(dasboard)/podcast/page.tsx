"use client";

import MusicPlayer from "@/components/music-player";
import { PodcastHistory } from "@/components/podcast-history";
import { GeneratePodcastButton } from "@/components/generate-podcast-button";
import { useState, useEffect, useRef } from "react";
import type { PlaylistItem } from "@/types/music";
import SaveButton from "@/components/SaveButton";

type HistoryItem = {
  id: number;
  title: string;
  lastPlayed: string;
  duration: string;
  progress: number;
  imageUrl?: string;
};

export default function Home() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const musicPlayerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch podcasts
        const podcastResponse = await fetch("/api/podcasts");
        const podcastData = await podcastResponse.json();
        setPlaylist(podcastData);

        // Fetch recent episodes (now handled in PodcastHistory component)
        setHistory([]); // Will be populated by the component
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayEpisode = async (episodeId: number) => {
    console.log(`Playing episode with id: ${episodeId}`);

    // Update playback state via API
    try {
      await fetch("/api/player/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId, isPlaying: true, currentTime: 0 }),
      });
    } catch (error) {
      console.error("Error updating playback state:", error);
    }
  };

  const handleAddToQueue = async (episode: any) => {
    console.log("Adding to queue:", episode);

    // Call API to add to queue
    try {
      await fetch("/api/player/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId: episode.id }),
      });

      // If music player has an addToQueue method, call it
      if (musicPlayerRef.current && musicPlayerRef.current.addToQueue) {
        musicPlayerRef.current.addToQueue(episode);
      }
    } catch (error) {
      console.error("Error adding to queue:", error);
    }
  };

  const handleGeneratePodcast = () => {
    console.log("Generate podcast clicked");
    // This would typically open a modal or navigate to a generation page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Main content area */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left side - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with Generate Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Your Podcasts
                </h1>
                <p className="text-gray-600">
                  Listen to your favorite episodes
                </p>
              </div>
              <SaveButton />
            </div>

            <PodcastHistory
              history={history}
              onPlayEpisode={handlePlayEpisode}
              onAddToQueue={handleAddToQueue}
            />
          </div>

          {/* Right side - Floating music player (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              {playlist.length > 0 && (
                <MusicPlayer
                  ref={musicPlayerRef}
                  playlist={playlist}
                  onAddToQueue={handleAddToQueue}
                />
              )}

              {/* Generate button for desktop when no music is playing */}
              {playlist.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Podcast Playing
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first AI-generated podcast
                    </p>
                  </div>
                  <SaveButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating music player (mobile) */}
      {playlist.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
          <MusicPlayer playlist={playlist} onAddToQueue={handleAddToQueue} />
        </div>
      )}

      {/* Floating Generate Button (mobile) - only show when no music is playing */}
      {playlist.length === 0 && (
        <div className="lg:hidden fixed bottom-6 right-4 z-50">
          <GeneratePodcastButton
            onClick={handleGeneratePodcast}
            variant="floating"
          />
        </div>
      )}
    </div>
  );
}
