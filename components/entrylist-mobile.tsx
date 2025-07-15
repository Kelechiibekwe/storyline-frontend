"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Plus,
  Search,
  MoreHorizontal,
  Cloud,
  Sun,
  CloudRain,
  Pin,
} from "lucide-react";

/**
 * Props you can pass into the component
 */
interface EntrylistMobileProps {
  // e.g. title?: string
}

interface JournalEntry {
  id: string;
  title: string;
  preview: string;
  date: string;
  time: string;
  location?: string;
  weather?: string;
  isPinned?: boolean;
}

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    title: "New Year Reflections",
    preview:
      "As 2024 comes to an end, I find myself reflecting on all the growth and changes...",
    date: "January 1, 2025",
    time: "9:30 AM",
    location: "Home, San Francisco",
    weather: "Sunny",
    isPinned: true,
  },
  {
    id: "2",
    title: "Morning Coffee Thoughts",
    preview:
      "There's something magical about the first cup of coffee in the morning. The steam rising...",
    date: "December 28, 2024",
    time: "7:15 AM",
    location: "Local Café, Downtown",
    weather: "Cloudy",
  },
  {
    id: "3",
    title: "Weekend Adventures",
    preview:
      "Spent the day hiking with friends. The view from the summit was absolutely breathtaking...",
    date: "December 26, 2024",
    time: "6:45 PM",
    location: "Mountain Trail, CA",
    weather: "Clear",
  },
  {
    id: "4",
    title: "Holiday Memories",
    preview:
      "Christmas dinner with family was wonderful. Mom made her famous apple pie and we all...",
    date: "December 25, 2024",
    time: "8:20 PM",
    location: "Family Home",
    weather: "Cold",
  },
  {
    id: "5",
    title: "Work Milestone",
    preview:
      "Finally completed the project I've been working on for months. Feeling accomplished...",
    date: "December 22, 2024",
    time: "5:30 PM",
    location: "Office",
    weather: "Rainy",
  },
];

const getWeatherIcon = (weather: string) => {
  switch (weather?.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun className="w-3 h-3" />;
    case "cloudy":
      return <Cloud className="w-3 h-3" />;
    case "rainy":
      return <CloudRain className="w-3 h-3" />;
    default:
      return <Cloud className="w-3 h-3" />;
  }
};

const groupEntriesByMonth = (entries: JournalEntry[]) => {
  const grouped: { [key: string]: JournalEntry[] } = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(entry);
  });

  return grouped;
};

const EntrylistMobile: React.FC<EntrylistMobileProps> = (
  {
    /* destructure props here */
  }
) => {
  const pinnedEntries = mockEntries.filter((entry) => entry.isPinned);
  const regularEntries = mockEntries.filter((entry) => !entry.isPinned);
  const groupedEntries = groupEntriesByMonth(regularEntries);

  return (
    <div>
      <ScrollArea className="flex-1">
        {Object.entries(groupedEntries).map(([monthYear, entries]) => (
          <div key={monthYear}>
            <h2 className="font-semibold text-gray-900 mb-3">{monthYear}</h2>
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card
                  key={entry.id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {entry.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {entry.preview}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                      {entry.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-24">
                            {entry.location}
                          </span>
                        </div>
                      )}
                      {entry.weather && (
                        <div className="flex items-center gap-1">
                          {getWeatherIcon(entry.weather)}
                          <span>{entry.weather}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default EntrylistMobile;
