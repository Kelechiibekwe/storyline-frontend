export interface Song {
  id: number;
  userId: number;
  title: string;
  audioUrl: string;
  createdAt: string;
}

// export interface PlaylistItem extends Song {
//   duration: number
// }

export type PlaylistItem = {
  id: number;
  title: string;
  audioUrl: string;
  imageUrl: string;
  duration: number;
  createdAt: string;
  description?: string;
};

export type HistoryItem = {
  id: number;
  title: string;
  lastPlayed: string;
  duration: string;
  playCount: number;
  imageUrl?: string;
};
