"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Heart,
  MoreHorizontal,
  Trash2,
  GripVertical,
} from "lucide-react";
import type { PlaylistItem } from "@/types/music";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MusicPlayerProps {
  playlist: PlaylistItem[];
  onClose?: () => void;
  onAddToQueue?: (episodeId: number) => void;
}

const MusicPlayer = forwardRef<HTMLDivElement, MusicPlayerProps>(
  function MusicPlayer(
    { playlist, onClose = () => {}, onAddToQueue }: MusicPlayerProps,
    ref
  ) {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isPlayingRef = useRef(false);
    const [queue, setQueue] = useState<PlaylistItem[]>(playlist);

    const currentSong = queue[currentSongIndex];

    const handleTimeUpdate = useCallback(() => {
      if (audioRef.current && !isScrubbing) {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(current);
        if (!isNaN(dur) && dur > 0) {
          setProgress((current / dur) * 100);
        }
      }
    }, [isScrubbing]);

    const handleEnded = useCallback(() => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setProgress(0);
      setCurrentTime(0);
    }, []);

    useEffect(() => {
      if (queue.length === 0) return;
      const currentSong = queue[currentSongIndex];
      if (!currentSong) return;

      const audio = new Audio(currentSong.audioUrl);
      audioRef.current = audio;
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      setIsPlaying(false);
      isPlayingRef.current = false;

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audio.src = "";
      };
    }, [queue[currentSongIndex], handleTimeUpdate, handleEnded]);

    if (playlist.length === 0) {
      return null;
    }

    const togglePlayPause = async () => {
      if (!audioRef.current) return;

      try {
        if (isPlayingRef.current) {
          audioRef.current.pause();
          isPlayingRef.current = false;
          setIsPlaying(false);
        } else {
          isPlayingRef.current = true;
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    };

    const handleProgressChange = (value: number) => {
      if (audioRef.current && currentSong.duration) {
        const newTime = (value / 100) * currentSong.duration;
        audioRef.current.currentTime = newTime;
        setProgress(value);
        setCurrentTime(newTime);
      }
    };

    const handleScrubStart = () => {
      setIsScrubbing(true);
      if (audioRef.current && isPlayingRef.current) {
        audioRef.current.pause();
      }
    };

    const handleScrubEnd = async () => {
      setIsScrubbing(false);
      if (audioRef.current && isPlayingRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error resuming playback:", error);
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      }
    };

    const handlePrevious = () => {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === 0 ? queue.length - 1 : prevIndex - 1
      );
    };

    const handleNext = () => {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === queue.length - 1 ? 0 : prevIndex + 1
      );
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const removeFromQueue = (indexToRemove: number) => {
      const actualIndex = currentSongIndex + 1 + indexToRemove;
      const newQueue = queue.filter((_, index) => index !== actualIndex);
      setQueue(newQueue);

      // If we removed a song before current, adjust current index
      if (actualIndex <= currentSongIndex) {
        setCurrentSongIndex((prev) => Math.max(0, prev - 1));
      }
    };

    const clearQueue = () => {
      const newQueue = queue.slice(0, currentSongIndex + 1); // Keep only current song
      setQueue(newQueue);
    };

    const jumpToSong = (indexInQueue: number) => {
      const actualIndex = currentSongIndex + 1 + indexInQueue;
      setCurrentSongIndex(actualIndex);
    };

    const addToQueue = (episode: PlaylistItem) => {
      // Add after current song
      const newQueue = [...queue];
      newQueue.splice(currentSongIndex + 1, 0, episode);
      setQueue(newQueue);

      if (onAddToQueue) {
        onAddToQueue(episode.id);
      }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      setDragOverIndex(index);
    };

    const handleDragLeave = () => {
      setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const upNextItems = queue.slice(currentSongIndex + 1);
      const draggedItem = upNextItems[draggedIndex];

      // Remove dragged item
      const newUpNext = upNextItems.filter(
        (_, index) => index !== draggedIndex
      );

      // Insert at new position
      newUpNext.splice(dropIndex, 0, draggedItem);

      // Reconstruct full queue
      const newQueue = [...queue.slice(0, currentSongIndex + 1), ...newUpNext];

      setQueue(newQueue);
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    const upNextItems = queue.slice(currentSongIndex + 1);

    return (
      <Card
        ref={ref}
        className="w-full bg-white border border-gray-300 shadow-xl shadow-black/20 ring-1 ring-gray-200"
      >
        <CardContent className="p-0">
          {/* Mobile Compact View */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={currentSong.imageUrl || "/placeholder.svg"}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-gray-900">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentSong.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Progress bar for compact view */}
            <div className="px-4 pb-2">
              <Slider
                value={[progress]}
                onValueChange={(value) => handleProgressChange(value[0])}
                onValueCommit={handleScrubEnd}
                max={100}
                step={0.1}
                className="w-full h-1"
                onPointerDown={handleScrubStart}
              />
            </div>

            {/* Expanded view for mobile - Up Next Queue */}
            {isExpanded && (
              <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Up Next
                  </h3>
                  <div className="flex items-center space-x-2">
                    {upNextItems.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={clearQueue}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setIsExpanded(false)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {upNextItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No more episodes in queue</p>
                      </div>
                    ) : (
                      upNextItems.map((song, index) => (
                        <div
                          key={`${song.id}-${index}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`group flex items-center space-x-3 p-3 rounded-lg transition-all cursor-move ${
                            dragOverIndex === index
                              ? "bg-blue-50 border-2 border-blue-200"
                              : "hover:bg-gray-50 border-2 border-transparent"
                          } ${draggedIndex === index ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            <img
                              src={song.imageUrl || "/placeholder.svg"}
                              alt={song.title}
                              className="w-12 h-12 rounded-lg object-cover shadow-sm"
                            />
                          </div>
                          <div
                            className="flex-1 min-w-0"
                            onClick={() => jumpToSong(index)}
                          >
                            <p className="text-sm font-medium truncate text-gray-900">
                              {song.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {song.createdAt}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => jumpToSong(index)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromQueue(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-48 h-48">
                <img
                  src={currentSong.imageUrl || "/placeholder.svg"}
                  alt={currentSong.title}
                  className="w-full h-full rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Now Playing
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentSong.title}
                </h3>
                <p className="text-sm text-gray-500">{currentSong.createdAt}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Slider
                value={[progress]}
                onValueChange={(value) => handleProgressChange(value[0])}
                onValueCommit={handleScrubEnd}
                max={100}
                step={0.1}
                className="w-full"
                onPointerDown={handleScrubStart}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentSong.duration - currentTime)}</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePrevious}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform hover:scale-105"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handleNext}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex justify-center space-x-4 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Queue preview */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Up Next</p>
                {upNextItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                    onClick={clearQueue}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {upNextItems.slice(0, 4).map((song, index) => (
                  <div
                    key={`${song.id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`group flex items-center space-x-2 p-2 rounded-lg transition-all cursor-move ${
                      dragOverIndex === index
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    } ${draggedIndex === index ? "opacity-50" : ""}`}
                  >
                    <GripVertical className="h-3 w-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <img
                      src={song.imageUrl || "/placeholder.svg"}
                      alt={song.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => jumpToSong(index)}
                    >
                      <p className="text-sm font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {song.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => jumpToSong(index)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromQueue(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default MusicPlayer;
