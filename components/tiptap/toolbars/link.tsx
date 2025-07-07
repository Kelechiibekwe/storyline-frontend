"use client"

import React, { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToolbar } from "./toolbar-provider"
import { getUrlFromString } from "@/lib/tiptap-utils"

const LinkToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  const { editor } = useToolbar()
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = getUrlFromString(link)
    if (url && editor?.can().chain().setLink({ href: url }).run()) {
      editor?.chain().focus().setLink({ href: url }).run()
      setLink("")
      setOpen(false)
    }
  }

  const handleRemoveLink = () => {
    if (editor?.can().chain().unsetLink().run()) {
      editor?.chain().focus().unsetLink().run()
      setOpen(false)
    }
  }

  React.useEffect(() => {
    if (open) {
      const linkAttrs = editor?.getAttributes("link")
      setLink(linkAttrs?.href || "")
    }
  }, [editor, open])

  const canSetLink = editor?.can().chain().setLink({ href: "" }).run()
  const hasLink = editor?.isActive("link")

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-max px-3 font-normal", hasLink && "bg-accent", className)}
                disabled={!canSetLink}
                ref={ref}
                {...props}
              >
                <span className="mr-2 text-base">↗</span>
                <span className="underline decoration-gray-7 underline-offset-4">Link</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span>Add Link</span>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{hasLink ? "Edit Link" : "Add Link"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              {hasLink && (
                <Button type="button" variant="destructive" onClick={handleRemoveLink}>
                  Remove Link
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!link}>
                {hasLink ? "Update" : "Add"} Link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
})

LinkToolbar.displayName = "LinkToolbar"

export { LinkToolbar }
