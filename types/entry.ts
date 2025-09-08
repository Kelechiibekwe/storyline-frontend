export interface Entry {
  id: number;
  promptId: number;
  entryText: string;
  theme: string;
  createdAt: string;
  location?: string;
  weather?: string;
  title?: string;
}
