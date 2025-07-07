"use client"

import MusicPlayer from "@/components/music-player";  
import {PodcastHistory} from "@/components/podcast-history";
import { useState, useEffect } from "react"
import type { PlaylistItem } from "@/types/music"


export default function Home() {
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([])
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const fetchPlaylist = async () => {
        const response = await fetch(`http://127.0.0.1:5000/v1/podcasts`,{
          credentials: "include",
        })
        const data = await response.json()
        setPlaylist(data)
        setLoading(false)
      }
  
      fetchPlaylist()
    }, [])

    const history = [
      {
        id: 4,
        title: "Morning Meditation",
        lastPlayed: "2 hours ago",
        duration: "10:30",
        playCount: 3,
      },
      {
        id: 5,
        title: "Productivity Tips",
        lastPlayed: "Yesterday",
        duration: "12:15",
        playCount: 1,
      },
      {
        id: 6,
        title: "Sleep Stories",
        lastPlayed: "2 days ago",
        duration: "20:00",
        playCount: 5,
      },
      {
        id: 7,
        title: "Breathing Exercises",
        lastPlayed: "3 days ago",
        duration: "8:20",
        playCount: 2,
      },
    ]

    const handlePlayEpisode = (episodeId: number) => {
      console.log(`Playing episode with id: ${episodeId}`)
    }
  

    return (
      // <div>
      //   {loading ? (
      //       <div className="flex items-center justify-center h-full">
      //       </div>
      //       ) : (
      //   <div className="mx-auto flex flex-col items-center gap-6 max-w-xl">
      //     <MusicPlayer playlist={playlist} />
      //     <PodcastHistory history={history} onPlayEpisode={handlePlayEpisode} />
      //   </div>
      //   )}
      // </div>
      <div>
      <div className="mx-auto flex flex-col items-center justify-center gap-6 w-full px-4">
        <div className="">
           <MusicPlayer playlist={playlist} />
           </div>
           <PodcastHistory history={history} onPlayEpisode={handlePlayEpisode} />
         </div></div>
    )
}
