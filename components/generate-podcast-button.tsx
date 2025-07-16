"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Mic } from "lucide-react";

interface GeneratePodcastButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary" | "floating";
}

export function GeneratePodcastButton({
  onClick,
  variant = "primary",
}: GeneratePodcastButtonProps) {
  if (variant === "floating") {
    return (
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Generate Podcast</span>
      </Button>
    );
  }

  if (variant === "secondary") {
    return (
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Podcast
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <Mic className="h-5 w-5 mr-2" />
      Generate Podcast
      <Sparkles className="h-4 w-4 ml-2" />
    </Button>
  );
}
