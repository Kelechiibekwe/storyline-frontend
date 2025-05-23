"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

interface BouncingArrowProps {
  direction: "up" | "down"
}

export function BouncingArrow({ direction }: BouncingArrowProps) {
  return (
    <div className={cn("flex justify-center w-full", direction === "up" ? "mt-2" : "mb-2")}>
      <div className="bg-primary/10 rounded-full p-1 animate-bounce">
        {direction === "up" ? (
          <ChevronUp className="h-6 w-6 text-primary" />
        ) : (
          <ChevronDown className="h-6 w-6 text-primary" />
        )}
      </div>
    </div>
  )
}

