"use client"

import type React from "react"

import Image from "@tiptap/extension-image"
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Trash, Edit } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      caption: {
        default: "",
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(TiptapImage)
  },
})

function TiptapImage(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props
  const [editingCaption, setEditingCaption] = useState(false)
  const [caption, setCaption] = useState(node.attrs.caption || "")

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
  }

  const handleCaptionBlur = () => {
    updateAttributes({ caption })
    setEditingCaption(false)
  }

  const handleCaptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCaptionBlur()
    }
  }

  return (
    <NodeViewWrapper
      className={cn(
        "relative my-4 rounded-md border-2 border-transparent transition-all",
        selected ? "border-blue-300" : "",
      )}
    >
      <div className="group relative">
        <img
          src={node.attrs.src || "/placeholder.svg?height=300&width=400"}
          alt={node.attrs.alt}
          title={node.attrs.title}
          className="w-full rounded-lg"
          style={{ maxWidth: node.attrs.width }}
        />

        {editingCaption ? (
          <Input
            value={caption}
            onChange={handleCaptionChange}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            className="mt-2 text-center text-sm"
            placeholder="Add a caption..."
            autoFocus
          />
        ) : (
          <div
            className="mt-2 cursor-text text-center text-sm text-muted-foreground"
            onClick={() => editor?.isEditable && setEditingCaption(true)}
          >
            {caption || "Click to add a caption..."}
          </div>
        )}

        {editor?.isEditable && (
          <div className="absolute right-2 top-2 flex gap-1 rounded-md bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingCaption(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={deleteNode}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
