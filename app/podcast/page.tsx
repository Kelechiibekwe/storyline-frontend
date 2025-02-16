"use client"

import Image from "next/image";

import MusicPlayer from "@/components/music-player";
import SaveButton from "@/components/SaveButton";
import { useState, useEffect } from "react"
import type { PlaylistItem } from "@/types/music"
import { Loader2 } from "lucide-react"


export default function Home() {
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([])
    const [loading, setLoading] = useState(true)

    const userId = 1;
  
    useEffect(() => {
      const fetchPlaylist = async () => {
        const response = await fetch(`http://127.0.0.1:5000/v1/podcasts/${userId}`)
        const data = await response.json()
        setPlaylist(data)
        setLoading(false)
      }
  
      fetchPlaylist()
    }, [])
  

    return (
      <div>
        {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            ) : (
        <div className="flex flex-col items-center gap-6">
        <MusicPlayer playlist={playlist} />
        <SaveButton/>
        </div>
        )}
      </div>
    )
}
