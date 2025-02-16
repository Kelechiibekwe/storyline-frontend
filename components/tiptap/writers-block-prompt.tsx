"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface WritersBlockPromptProps {
  prompt: string
  position: { top: number; left: number; height: number }
  onClose: () => void
  onApply: (text: string) => void
}

export function WritersBlockPrompt({ prompt, position, onClose, onApply }: WritersBlockPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const promptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (promptRef.current && !promptRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={promptRef}
      className="absolute z-50"
      style={{
        top: `${Math.max(0, position.top + position.height)}px`,
        left: `${Math.max(0, position.left)}px`,
      }}
    >
      {isExpanded ? (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg p-2 max-w-md">
          <p className="mb-2 text-sm font-medium">{prompt}</p>
          <div className="flex justify-end mt-2 space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => onApply(prompt)}>
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="inline-block text-gray-500 bg-gray-100 px-1 py-0.5 text-sm rounded cursor-pointer hover:bg-gray-200"
          onClick={() => setIsExpanded(true)}
        >
          {prompt.substring(0, 30)}...
        </div>
      )}
    </div>
  )
}

