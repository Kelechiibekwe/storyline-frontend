"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor";
import { Entry } from "@/types/entry";
import { EntryHistory } from "@/components/tiptap/entry-history";
import { BarLoader } from "react-spinners";
import { useMediaQuery } from "@/hooks/use-media-querry";
import EntrylistMobile from "@/components/entrylist-mobile";
// import StackedNotifications from "@/components/stacked-notification"

const FLASK_API_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000";

export default function Home() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
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

    // Replace the current history entry (which might be the callback) with the homepage
    window.history.replaceState(null, "", "/");
    // Push the journal page onto the history stack
    window.history.pushState(null, "", "/journal");

    console.log("history is manipulated");

    async function fetchEntries() {
      try {
        const res = await fetch(`${FLASK_API_URL}/v1/entries`, {
          credentials: "include",
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

  if (!mounted) {
    // On the *very first server render*, just render an empty placeholder
    // so that the HTML matches on the client before hydration.
    return (
      <div className="h-[500px] flex items-center justify-center">
        <BarLoader />
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <div className="p-6 text-gray-500">
        <EntrylistMobile />
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
