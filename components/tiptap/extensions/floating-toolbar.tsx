"use client"

import { BubbleMenu, type Editor } from "@tiptap/react"
import { BoldToolbar } from "../toolbars/bold"
import { ItalicToolbar } from "../toolbars/italic"
import { UnderlineToolbar } from "../toolbars/underline"
import { LinkToolbar } from "../toolbars/link"
import { ToolbarProvider } from "../toolbars/toolbar-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-querry"
import { Separator } from "@/components/ui/separator"

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  if (!editor) return null

  if (isMobile) {
    return (
      <TooltipProvider>
        <BubbleMenu
          tippyOptions={{
            duration: 100,
            placement: "top",
            appendTo: "parent",
          }}
          shouldShow={({ state, editor }) => {
            const { selection } = state
            const { empty } = selection

            // Only show when there's a text selection
            return !empty && editor.isEditable
          }}
          editor={editor}
          className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md"
        >
          <ToolbarProvider editor={editor}>
            <BoldToolbar />
            <ItalicToolbar />
            <UnderlineToolbar />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <LinkToolbar />
          </ToolbarProvider>
        </BubbleMenu>
      </TooltipProvider>
    )
  }

  return null
}
