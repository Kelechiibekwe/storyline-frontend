"use client"

import { ImageIcon } from "lucide-react"
import React, { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useToolbar } from "./toolbar-provider"

const SimpleImageToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar()
    const [open, setOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [altText, setAltText] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run()
        setImageUrl("")
        setAltText("")
        setOpen(false)
      }
    }

    return (
      <TooltipProvider>
        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", className)}
                  ref={ref}
                  {...props}
                >
                  {children ?? <ImageIcon className="h-4 w-4" />}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>Insert Image</span>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt-text">Alt Text (optional)</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Description of the image"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!imageUrl}>
                  Insert Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    )
  },
)

SimpleImageToolbar.displayName = "SimpleImageToolbar"

export { SimpleImageToolbar }
