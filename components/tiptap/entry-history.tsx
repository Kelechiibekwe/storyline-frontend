"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BouncingArrow } from "@/components/ui/bouncing-arrow"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Entry } from "@/types/entry"

// import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface EntryHistoryProps {
  entries: Entry[]
  onEntryClick: (entry: Entry) => void
  onNewEntry?: () => void
  onDeleteEntry?: (entryId: number )  => void
  currentEntryId: number | null
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://127.0.0.1:5000'

export function EntryHistory({ entries, onEntryClick, onNewEntry, onDeleteEntry, currentEntryId }: EntryHistoryProps) {
  // At the beginning of the EntryHistory function, add a null check for entries
  const containerRef = useRef<HTMLDivElement>(null)
  const [showTopArrow, setShowTopArrow] = useState(false)
  const [showBottomArrow, setShowBottomArrow] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeThemes, setActiveThemes] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")

  // Add null check and default to empty array if entries is undefined
  const safeEntries = entries || []

  // Extract unique themes from entries with null check
  const uniqueThemes = Array.from(new Set(safeEntries.filter((entry) => entry?.theme).map((entry) => entry.theme)))

  // Replace the filteredEntries calculation with this safer version
  const filteredEntries = safeEntries
    .filter((entry) => entry !== undefined)
    .filter((entry) => {
      // Search filter
      const matchesSearch = searchQuery === "" || entry.entryText?.toLowerCase().includes(searchQuery.toLowerCase())

      // Theme filter
      const matchesTheme = activeThemes.length === 0 || (entry.theme && activeThemes.includes(entry.theme))

      // Date filter
      let matchesDate = true
      if (dateFilter !== "all" && entry.createdAt) {
        const entryDate = new Date(entry.createdAt)
        const today = new Date()

        if (dateFilter === "today") {
          matchesDate = entryDate.toDateString() === today.toDateString()
        } else if (dateFilter === "week") {
          const weekAgo = new Date()
          weekAgo.setDate(today.getDate() - 7)
          matchesDate = entryDate >= weekAgo
        } else if (dateFilter === "month") {
          const monthAgo = new Date()
          monthAgo.setMonth(today.getMonth() - 1)
          matchesDate = entryDate >= monthAgo
        }
      }

      return matchesSearch && matchesTheme && matchesDate
    })

  const handleScroll = useCallback((element: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element
    const firstCard = element.firstElementChild as HTMLElement
    const lastCard = element.lastElementChild as HTMLElement

    // const isFirstCardPartiallyVisible = firstCard && scrollTop < firstCard.offsetTop + firstCard.offsetHeight
    // const isLastCardPartiallyVisible = lastCard && scrollTop + clientHeight > lastCard.offsetTop

    setShowTopArrow(scrollTop > 20)
    setShowBottomArrow(scrollHeight - scrollTop - clientHeight > 20)
  }, [])

  useEffect(() => {
    const scrollContainer = containerRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement

    if (scrollContainer) {
      const onScroll = () => handleScroll(scrollContainer)
      scrollContainer.addEventListener("scroll", onScroll)

      // Initial check
      handleScroll(scrollContainer)

      return () => scrollContainer.removeEventListener("scroll", onScroll)
    }
  }, [handleScroll])

  // const handleDeleteEntry = async (entry: Entry) => {
  //   // Optional: Ask the user for confirmation before deletion.
  //   if (!window.confirm("Are you sure you want to delete this entry?")) {
  //     return
  //   }
  //   try {
  //     // Construct the API endpoint with entry's userId and id.
  //     const response = await fetch(
  //       `${FLASK_API_URL}/v1/entries/${entry.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     )

  //     console.log("Delete response message: ", response.status, response.statusText)
  //     if (!response.ok) {
  //       throw new Error("Failed to delete entry 1")
  //     }
      // Update the UI: If you use a parent callback to refresh the entries,
      // call it here. Otherwise, you can update local state if you had one.
      // if (onDeleteEntry) {
      //   onDeleteEntry(entry.id)
      // }
  //   } catch (error) {
  //     console.error("Error deleting entry:", error)
  //   }
  // }

  const toggleTheme = (theme: string) => {
    setActiveThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]))
  }

  const getExcerpt = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className="w-full md:w-80 flex-grow h-full relative overflow-hidden">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Journals</CardTitle>
          <Button variant="outline" size="icon" onClick={onNewEntry} className="h-8 w-8">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New entry</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search journals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="font-semibold">Filter by Date</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={dateFilter === "all"} onCheckedChange={() => setDateFilter("all")}>
                All time
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={dateFilter === "today"} onCheckedChange={() => setDateFilter("today")}>
                Today
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={dateFilter === "week"} onCheckedChange={() => setDateFilter("week")}>
                Past week
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={dateFilter === "month"} onCheckedChange={() => setDateFilter("month")}>
                Past month
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="font-semibold">Filter by Theme</DropdownMenuItem>
              {uniqueThemes.map((theme) => (
                <DropdownMenuCheckboxItem
                  key={theme}
                  checked={activeThemes.includes(theme)}
                  onCheckedChange={() => toggleTheme(theme)}
                >
                  {theme}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {activeThemes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activeThemes.map((theme) => (
              <Badge key={theme} variant="default" className="cursor-pointer" onClick={() => toggleTheme(theme)}>
                {theme} ×
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[calc(100dvh-20rem)]" ref={containerRef}>
          <ScrollArea className="h-full">
            <div className="px-4 space-y-4 pb-4">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    onClick={() => onEntryClick(entry)}
                    className={cn(
                      "cursor-pointer group hover:bg-accent transition-colors",
                      entry.id === currentEntryId && "bg-accent/20"
                    )}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xs text-muted-foreground">{entry.createdAt}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive"
                                onClick={(e) => {
                                  // Stop event propagation to avoid triggering the onClick on the card.
                                  e.stopPropagation();
                                  onDeleteEntry(entry.id);
                                }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: entry.entryText }} />
                      {/* <Badge variant="outline" className="mt-2">
                        {entry.theme}
                      </Badge> */}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No entries found</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveThemes([])
                      setDateFilter("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          {showBottomArrow && filteredEntries.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="relative z-20">
              <BouncingArrow direction="down" />
            </div>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

