"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PanelRightOpen, X } from 'lucide-react';
import { useEffect, useState, useCallback } from "react"
import Profile01 from "./kokonutui/profile-01";

import { motion } from "framer-motion"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"
import { AnimatePresence } from "framer-motion";
import { EntryHistory } from "@/components/tiptap/entry-history"
import { Entry } from "@/types/entry"
import { useToast } from "@/hooks/use-toast"
import StaggeredDropDown from "./staggered-dropdown";

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.4}}
};

const links = [
  { name: "Journal", hash: "/journal" },
  { name: "Stories", hash: "/podcast" },
]

interface EntryHistoryProps {
  entries: Entry[]
  onEntryClick: (entry: Entry) => void
  onNewEntry?: () => void
  onDeleteEntry?: (entryId: number )  => void
  currentEntryId: number | null
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000"

export default function Header() {

  const [activeSection, setActiveSection] = useState("Journal");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [entries, setEntries] = useState<Entry[]>([])
  const [currentEntryId, setCurrentEntryId] = useState<number | null>(null)
  const { toast } = useToast();
  const [isNewEntry, setIsNewEntry] = useState(true);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  }

  
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch(`${FLASK_API_URL}/v1/entries`,
          {
            method:'GET',
            credentials: "include",
          }
        )
        if (!res.ok) throw new Error("Failed to load entries")
        const data = await res.json()
        setEntries(Array.isArray(data) ? data : data.entries)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to load entries. Please try again later.",
          variant: "destructive",
        })
      }
    }
    fetchEntries()
  }, [toast])
  
  
  const handleSavedOrUpdated = useCallback(
    (savedEntry: Entry) => {
      setEntries((prev) => {
        const exists = prev.find((e) => e.id === savedEntry.id)
        if (exists) {
          // update in place
          return prev.map((e) => (e.id === savedEntry.id ? savedEntry : e))
        } else {
          // prepend new
          return [savedEntry, ...prev]
        }
      })
      setCurrentEntryId(savedEntry.id)
      setIsNewEntry(false)
    },
    []
  )
  
  const handleEntryClick = useCallback((entry: Entry) => {
    setCurrentEntryId(entry.id)
    setIsNewEntry(false)
  }, [])
  
  // 6. Handler: deleting an entry from history
  const handleDeleteEntry = useCallback(
    async (entryId: number) => {
      try {
        // Fire off the DELETE request to the backend
        const res = await fetch(`${FLASK_API_URL}/v1/entries/${entryId}`, {
          method: "DELETE",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to delete entry")
        // Remove it from local state
        setEntries((prev) => prev.filter((e) => e.id !== entryId))
        // If we just deleted the currently open entry, clear the editor state:
        if (currentEntryId === entryId) {
          setCurrentEntryId(null)
          setIsNewEntry(true)
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to delete entry.",
          variant: "destructive",
        })
      }
    },
    [currentEntryId, toast]
  )

  return (
    <header className="z-[999] relative">
          <motion.div
            className="fixed top-0 left-1/2 h-[3.25rem] w-full sm:w-[16rem] sm:rounded-full border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6"
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
          ></motion.div>
          <div className="fixed top-[0.15rem] w-full flex items-center h-12 px-4 sm:px-6 sm:top-[1.7rem] sm:h-[initial]">
            <div>
              <div 
                onClick={() => setProfileMenuOpen((pv) => !pv)}
                className="flex items-center cursor-pointer">
                <Avatar className="w-[30px] h-[30px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <StaggeredDropDown open={profileMenuOpen} setOpen={setProfileMenuOpen}/>
              </div>
            </div>
            <nav className="mx-auto left-1/2 flex py-2 sm:py-0">
              <ul className="flex w-[14rem] items-center justify-center gap-x-3 text-[0.9rem] font-medium text-gray-500">
                {links.map((link) => (
                  <motion.li
                    className="h-3/4 flex items-center justify-center relative"
                    key={link.hash}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Link
                      className={clsx("flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition",{"text-gray-950":activeSection === link.name,})}
                      href={link.hash}
                      onClick={() => setActiveSection(link.name)}
                    >
                      {link.name}
                      { link.name === activeSection && (
                      <motion.span 
                        className="bg-gray-200 rounded-full absolute inset-0 -z-10"
                        layoutId="activeSection"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                        ></motion.span>)
                      }
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          {/* Right: Icon or spacer */}
          <div className="w-[30px] h-[30px] lg:block hidden">
          </div>
        {activeSection === "Journal" && 
          <div onClick={handleNav} className="flex items-center lg:hidden cursor-pointer"> 
            <PanelRightOpen size={30}/>
          </div>}
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="fixed right-0 top-0 w-full lg:hidden h-full bg-white bg-opacity-80 backdrop-blur-[0.5rem] p-10 z-50"
            >
              <div className="flex w-full items-center justify-end ">
                <div onClick={handleNav} className="cursor-pointer">
                  <X />
                </div>
              </div>
                <div className="w-full flex items-center justify-center h-[calc(100dvh-8rem)] flex-grow mt-4 shadow-lg rounded-xl">
                <EntryHistory entries={entries} onEntryClick={handleEntryClick} onDeleteEntry={handleDeleteEntry} currentEntryId={currentEntryId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  )
}

