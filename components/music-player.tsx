"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import type { PlaylistItem } from "@/types/music"

interface MusicPlayerProps {
  playlist: PlaylistItem[]
  onClose?: () => void
}

export default function MusicPlayer({ playlist, onClose = () => {} }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false) // Track playing state for async operations

  const currentSong = playlist[currentSongIndex]

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isScrubbing) {
      setCurrentTime(audioRef.current.currentTime)
      setProgress((audioRef.current.currentTime / currentSong.duration) * 100)
    }
  }, [currentSong.duration, isScrubbing])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    isPlayingRef.current = false
    setProgress(0)
    setCurrentTime(0)
  }, [])

  useEffect(() => {
    const audio = new Audio(currentSong.audioUrl)
    audioRef.current = audio

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    // Reset playing state when loading new song
    setIsPlaying(false)
    isPlayingRef.current = false

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
      audio.src = ""
    }
  }, [currentSong, handleTimeUpdate, handleEnded])

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlayingRef.current) {
        audioRef.current.pause()
        isPlayingRef.current = false
        setIsPlaying(false)
      } else {
        // Wait for the play promise to resolve
        isPlayingRef.current = true
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      // If play() fails, reset the playing state
      console.error("Error playing audio:", error)
      isPlayingRef.current = false
      setIsPlaying(false)
    }
  }

  const handleProgressChange = (value: number) => {
    if (audioRef.current && currentSong.duration) {
      const newTime = (value / 100) * currentSong.duration
      audioRef.current.currentTime = newTime
      setProgress(value)
      setCurrentTime(newTime)
    }
  }

  const handleScrubStart = () => {
    setIsScrubbing(true)
    if (audioRef.current && isPlayingRef.current) {
      audioRef.current.pause()
    }
  }

  const handleScrubEnd = async () => {
    setIsScrubbing(false)
    if (audioRef.current && isPlayingRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error("Error resuming playback:", error)
        isPlayingRef.current = false
        setIsPlaying(false)
      }
    }
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? playlist.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === playlist.length - 1 ? 0 : prevIndex + 1))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Your Stories</CardTitle>
        {/* <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button> */}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold leading-none">{currentSong.title}</h3>
          <p className="text-xs text-muted-foreground">{currentSong.createdAt}</p>
        </div>
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={(value) => handleProgressChange(value[0])}
            onValueCommit={handleScrubEnd}
            max={100}
            step={0.1}
            className="w-full"
            onPointerDown={handleScrubStart}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(currentSong.duration - currentTime)}</span>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={handlePrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full transition-transform duration-200 hover:scale-110"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={handleNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

