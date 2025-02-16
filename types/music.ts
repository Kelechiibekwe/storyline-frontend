export interface Song {
  id: number
  userId: number
  title: string
  audioUrl: string
  createdAt: string
}

export interface PlaylistItem extends Song {
  duration: number
}

