"use client"

import { AlignCenter, AlignLeft, AlignRight, ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-querry"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToolbar } from "./toolbar-provider"

export const AlignmentTooolbar = () => {
  const { editor } = useToolbar()
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run()
  }

  const isDisabled = !editor

  const currentTextAlign = () => {
    if (editor?.isActive({ textAlign: "left" })) {
      return "left"
    }
    if (editor?.isActive({ textAlign: "center" })) {
      return "center"
    }
    if (editor?.isActive({ textAlign: "right" })) {
      return "right"
    }
    return "left"
  }

  const alignmentOptions = [
    {
      name: "Left",
      value: "left",
      icon: <AlignLeft className="h-4 w-4" />,
    },
    {
      name: "Center",
      value: "center",
      icon: <AlignCenter className="h-4 w-4" />,
    },
    {
      name: "Right",
      value: "right",
      icon: <AlignRight className="h-4 w-4" />,
    },
  ]

  const currentAlignment = alignmentOptions.find((option) => option.value === currentTextAlign()) || alignmentOptions[0]

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger disabled={isDisabled} asChild>
              <Button variant="ghost" size="sm" className="h-8 w-max font-normal">
                <span className="mr-2">{currentAlignment.icon}</span>
                {currentAlignment.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Text Alignment</TooltipContent>
        </Tooltip>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {alignmentOptions.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => handleAlign(option.value)}>
                <span className="mr-2">{option.icon}</span>
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
