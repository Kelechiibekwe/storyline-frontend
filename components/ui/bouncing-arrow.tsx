import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

interface BouncingArrowProps {
  direction: "up" | "down"
  className?: string
}

export function BouncingArrow({ direction, className }: BouncingArrowProps) {
  return (
    <div
      className={cn(
        "absolute left-1/2 transform -translate-x-1/2 z-10 animate-bounce",
        direction === "up" ? "top-2" : "bottom-2",
        className,
      )}
    >
      {direction === "up" ? (
        <ChevronUp className="w-6 h-6 text-primary" />
      ) : (
        <ChevronDown className="w-6 h-6 text-primary" />
      )}
    </div>
  )
}

