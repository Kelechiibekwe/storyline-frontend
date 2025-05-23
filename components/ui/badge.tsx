import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center justify-center transition-colors", {
  variants: {
    variant: {
      default: "rounded",
      rounded: "rounded-lg",
      pill: "rounded-full",
    },
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base",
    },
    status: {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      active: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
      error: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    status: "default",
  },
})

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  bgColor?: string
  textColor?: string
}

export function Badge({ className, variant, size, status, bgColor, textColor, ...props }: BadgeProps) {
  const customStyles = {
    backgroundColor: bgColor,
    color: textColor,
  }

  return (
    <span
      className={cn(badgeVariants({ variant, size, status }), className)}
      style={bgColor || textColor ? customStyles : undefined}
      {...props}
    />
  )
}

