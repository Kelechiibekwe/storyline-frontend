"use client"

import { useRef, useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BouncingArrow } from "@/components/ui/bouncing-arrow"

interface Entry {
  id: number,
  userId: number
  promptId: number,
  entryText: string,
  theme: string,
  createdAt: string
}

interface EntryHistoryProps {
  entries: Entry[]
  onEntryClick: (entry: Entry) => void
}

export function EntryHistory({ entries, onEntryClick }: EntryHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showTopArrow, setShowTopArrow] = useState(false)
  const [showBottomArrow, setShowBottomArrow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        const firstCard = scrollRef.current.firstElementChild as HTMLElement
        const lastCard = scrollRef.current.lastElementChild as HTMLElement

        const isFirstCardPartiallyVisible = firstCard && scrollTop < firstCard.offsetTop + firstCard.offsetHeight
        const isLastCardPartiallyVisible = lastCard && scrollTop + clientHeight > lastCard.offsetTop

        setShowTopArrow(isFirstCardPartiallyVisible && scrollTop > 0)
        setShowBottomArrow(isLastCardPartiallyVisible && scrollHeight - scrollTop - clientHeight > 0)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll)
      handleScroll() // Initial check
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <Card className="w-full md:w-80 h-full relative overflow-hidden">
      <CardHeader>
        <CardTitle>Entry History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[calc(100vh-10rem)]">
          {showTopArrow && (
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          )}
          {showBottomArrow && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          )}
          <ScrollArea className="h-full" ref={scrollRef}>
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="mb-4 mx-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onEntryClick(entry)}
              >
                <CardHeader>
                  <CardTitle className="text-sm">{new Date(entry.createdAt).toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{entry.entryText}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          {showTopArrow && <BouncingArrow direction="up" />}
          {showBottomArrow && <BouncingArrow direction="down" />}
        </div>
      </CardContent>
    </Card>
  )
}

