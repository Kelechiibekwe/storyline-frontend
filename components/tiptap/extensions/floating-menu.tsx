"use client"

import type React from "react"

import {
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Code2,
  ChevronRight,
  Quote,
  ImageIcon,
  Minus,
} from "lucide-react"
import { FloatingMenu } from "@tiptap/react"
import { useCallback, useState } from "react"
import type { Editor } from "@tiptap/core"
import { Button } from "@/components/ui/button"

interface CommandItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  command: (editor: Editor) => void
}

const commands: CommandItem[] = [
  {
    title: "Text",
    icon: ChevronRight,
    command: (editor) => editor.chain().focus().clearNodes().run(),
  },
  {
    title: "Heading 1",
    icon: Heading1,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    icon: Heading2,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    icon: Heading3,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    icon: List,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Code Block",
    icon: Code2,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Quote",
    icon: Quote,
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Image",
    icon: ImageIcon,
    command: (editor) => editor.chain().focus().insertImagePlaceholder().run(),
  },
  {
    title: "Divider",
    icon: Minus,
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
]

export function TipTapFloatingMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)

  const executeCommand = useCallback(
    (commandFn: (editor: Editor) => void) => {
      if (!editor) return

      try {
        const { from } = editor.state.selection

        // Delete the slash command
        editor
          .chain()
          .focus()
          .deleteRange({
            from: from - 1,
            to: from,
          })
          .run()

        // Execute the command
        commandFn(editor)
        setIsOpen(false)
      } catch (error) {
        console.error("Error executing command:", error)
      }
    },
    [editor],
  )

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        if (!editor) return false

        const { $from } = state.selection
        const currentLineText = $from.parent.textBetween(0, $from.parentOffset, "\n", " ")

        const shouldShow = currentLineText === "/" && $from.parent.type.name !== "codeBlock"

        if (shouldShow !== isOpen) {
          setIsOpen(shouldShow)
        }

        return shouldShow
      }}
      tippyOptions={{
        placement: "bottom-start",
        interactive: true,
        appendTo: "parent",
        onHide: () => setIsOpen(false),
      }}
    >
      <div className="z-50 w-72 overflow-hidden rounded-lg border bg-popover shadow-lg p-2">
        <div className="grid grid-cols-2 gap-1">
          {commands.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="justify-start gap-2 h-auto p-2"
              onClick={() => executeCommand(item.command)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="text-sm">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </FloatingMenu>
  )
}
