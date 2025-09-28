"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor";
import { Entry } from "@/types/entry";
import { EntryHistory } from "@/components/tiptap/entry-history";
import { BarLoader } from "react-spinners";
import { useMediaQuery } from "@/hooks/use-media-querry";
import EntrylistMobile from "@/components/entrylist-mobile";
import BarLoaderExample from "@/components/BarLoader";
// import StackedNotifications from "@/components/stacked-notification"

const FLASK_API_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000";

export default function Home() {
  const { toast } = useToast();
  const { getToken, userId } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<number | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Track “is this code running in the browser yet?”
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchEntries() {
      try {
        setIsLoading(true);
        const token = await getToken();

        const res = await fetch(`${FLASK_API_URL}/v1/entries`, {
          credentials: "include",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to load entries");
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : data.entries);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load entries. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, [mounted, toast]);

  const handleSavedOrUpdated = useCallback((savedEntry: Entry) => {
    setEntries((prev) => {
      const exists = prev.find((e) => e.id === savedEntry.id);
      if (exists) {
        // update in place
        return prev.map((e) => (e.id === savedEntry.id ? savedEntry : e));
      } else {
        // prepend new
        return [savedEntry, ...prev];
      }
    });
    setCurrentEntryId(savedEntry.id);
    setIsNewEntry(false);
  }, []);

  const handleEntryClick = useCallback((entry: Entry) => {
    console.log(`current entry.id  is: ${entry.id}`);
    setCurrentEntryId(entry.id);
    setIsNewEntry(false);
  }, []);

  // 6. Handler: deleting an entry from history
  const handleDeleteEntry = useCallback(
    async (entryId: number) => {
      try {
        // Fire off the DELETE request to the backend
        const res = await fetch(`${FLASK_API_URL}/v1/entries/${entryId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete entry");
        // Remove it from local state
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        // If we just deleted the currently open entry, clear the editor state:
        if (currentEntryId === entryId) {
          setCurrentEntryId(null);
          setIsNewEntry(true);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to delete entry 2.",
          variant: "destructive",
        });
      }
    },
    [currentEntryId, toast]
  );

  if (!mounted || isLoading) {
    // On the *very first server render*, just render an empty placeholder
    // so that the HTML matches on the client before hydration.
    return (
      <div className="relative">
        <BarLoaderExample />
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <div className="p-6 text-gray-500">
        <EntrylistMobile
          key={entries.map((e) => e.id).join(",")}
          entries={entries}
          onEntryClick={handleEntryClick}
          onDeleteEntry={handleDeleteEntry}
          currentEntryId={currentEntryId}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-center gap-4 px-6">
      <div className=" px-4 flex justify-center items-center">
        <RichTextEditorDemo
          className=""
          // tell the editor which entry to load (null = new prompt)
          entryId={currentEntryId}
          // new callback: when the editor finishes saving
          onEntrySaved={handleSavedOrUpdated}
          // if the user clears editor to “new”
          onCreateNew={() => {
            setCurrentEntryId(null);
            setIsNewEntry(true);
          }}
        />
      </div>
      <div
        className="
            hidden lg:block h-[calc(100dvh-12rem)] shadow-lg rounded-xl"
      >
        {/* hidden lg:block w-full md:w-[320px] h-[calc(100dvh-12rem)] flex-grow mt-4 md:mt-0 shadow-lg rounded-xl */}
        <EntryHistory
          key={entries.map((e) => e.id).join(",")}
          entries={entries}
          onEntryClick={handleEntryClick}
          onDeleteEntry={handleDeleteEntry}
          currentEntryId={currentEntryId}
        />
      </div>
    </div>
  );
}
