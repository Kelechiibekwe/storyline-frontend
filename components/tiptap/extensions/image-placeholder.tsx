"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isValidUrl } from "@/lib/tiptap-utils"
import {
  type CommandProps,
  Node,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
} from "@tiptap/react"
import { ImageIcon, Link, Upload, X } from "lucide-react"
import { type FormEvent, useState } from "react"
import { useImageUpload } from "@/hooks/use-image-upload"
import { cn } from "@/lib/utils"

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      insertImagePlaceholder: () => ReturnType
    }
  }
}

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: "image-placeholder",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: "block",

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent)
  },

  addCommands() {
    return {
      insertImagePlaceholder: () => (props: CommandProps) => {
        return props.commands.insertContent({
          type: "image-placeholder",
        })
      },
    }
  },
})

function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [url, setUrl] = useState("")
  const [altText, setAltText] = useState("")
  const [urlError, setUrlError] = useState(false)

  const { previewUrl, fileInputRef, handleFileChange, handleRemove, uploading, error } = useImageUpload({
    onUpload: (imageUrl) => {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: altText || fileInputRef.current?.files?.[0]?.name,
        })
        .run()
      handleRemove()
      setIsExpanded(false)
    },
  })

  const handleInsertEmbed = (e: FormEvent) => {
    e.preventDefault()
    const valid = isValidUrl(url)
    if (!valid) {
      setUrlError(true)
      return
    }
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: altText }).run()
      setIsExpanded(false)
      setUrl("")
      setAltText("")
    }
  }

  return (
    <NodeViewWrapper className="w-full my-4">
      <div className="relative">
        {!isExpanded ? (
          <div
            onClick={() => setIsExpanded(true)}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 transition-all hover:bg-accent",
              error && "border-destructive bg-destructive/5",
            )}
          >
            <div className="rounded-full bg-background p-4 shadow-sm transition-colors group-hover:bg-accent">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload or add image URL</p>
              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Image</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Link className="mr-2 h-4 w-4" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="my-4 rounded-lg border-2 border-dashed p-8 text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="mx-auto max-h-[200px] rounded-lg object-cover"
                      />
                      <div className="space-y-2">
                        <Input
                          value={altText}
                          onChange={(e) => setAltText(e.target.value)}
                          placeholder="Alt text (optional)"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={handleRemove} disabled={uploading}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center gap-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                        </div>
                      </label>
                    </>
                  )}
                  {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                </div>
              </TabsContent>

              <TabsContent value="url">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        if (urlError) setUrlError(false)
                      }}
                      placeholder="Enter image URL..."
                    />
                    {urlError && <p className="text-xs text-destructive">Please enter a valid URL</p>}
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Alt text (optional)"
                    />
                  </div>
                  <Button onClick={handleInsertEmbed} className="w-full" disabled={!url}>
                    Add Image
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
