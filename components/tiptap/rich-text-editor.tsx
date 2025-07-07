"use client"

import "./tiptap.css"
import { cn } from "@/lib/utils"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import { EditorContent, type Extension, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { EditorToolbar } from "./toolbars/editor-toolbar"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Pause } from "lucide-react"
import { useCallback, useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"
import Image from "@tiptap/extension-image"
import NextLink from "next/link"
import { FiArrowRight } from "react-icons/fi";
import debounce from 'lodash.debounce';

import { WritersBlockPrompt } from "./writers-block-prompt"

import type { Entry } from "@/types/entry"
import type { NotificationType } from "@/types/notification"

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:5000"

// API function to fetch a prompt for a given user
const fetchPrompt = async (): Promise<{ prompt: string; prompt_id: number }> => {
  const response = await fetch(`${FLASK_API_URL}/v1/prompts`,{
      credentials: "include",
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch prompt")
  }
  return response.json()
}

// **CHANGE 1: Simplified extensions array - removed problematic extensions**
const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Heading ${node.attrs.level}`
        case "detailsSummary":
          return "Section title"
        case "codeBlock":
          return ""
        default:
          return "Write, type '/' for commands"
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 underline",
    },
  }),
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  // **CHANGE 2: Using basic Image extension instead of custom ones**
  Image.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg",
    },
  }),
  // **CHANGE 3: Removed SearchAndReplace extension to prevent DOM conflicts**
  Typography,
]

export function RichTextEditorDemo({
  className,
  initialContent = "",
  entryId = null,
  onEntrySaved,
  onCreateNew,
}: {
  className?: string
  initialContent?: string
  entryId?: number | null
  onEntrySaved?: (entry: Entry) => void
  onCreateNew?: () => void
}) {
  const [writerBlockPrompt, setWriterBlockPrompt] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0, height: 0 })
  const editorRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true)
  const [promptId, setPromptId] = useState<number | null>(null)
  const [notification, setNotification] = useState<NotificationType | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  // Removed: currentEntryId state
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState("")

  // Derive isNewEntry from entryId prop
  const isNewEntry = entryId == null
  const [isMounted, setIsMounted] = useState(false)

  const { toast } = useToast()

  // **CHANGE 4: Improved editor initialization with better error handling**
  const editor = useEditor({
    immediatelyRender: false, // Changed to false to prevent premature rendering
    extensions: extensions as Extension[],
    content: "",
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto",
      },
    },
    onUpdate: ({ editor }) => {
      if (!editor || !isMounted) return
      updateCursorPosition(editor)
    },
  })


  const autoSaveContent = useCallback(
    async (content: string) => {
      if (!isMounted) return

      console.log("AutoSave in progress...")
      if (!content.trim()) return

      setIsAutoSaving(true)
      setSaveStatus("Saving...")

      try {
        const url = isNewEntry ? `${FLASK_API_URL}/v1/entries` : `${FLASK_API_URL}/v1/entries/${entryId}`

        const method = isNewEntry ? "POST" : "PUT"

        const payload = isNewEntry
          ? {
              prompt_id: promptId || null,
              entry_text: content,
            }
          : {
              prompt_id: promptId || null,
              content: content,
            }

        const response = await fetch(url, {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        console.log("URL request completed")

        if (!response.ok) {
          throw new Error(`Failed to ${isNewEntry ? "create" : "update"} entry`)
        }

        const data = await response.json()

        // Update entries list with the saved entry
        if (data) {
          setEntries((prevEntries) => {
            const entryExists = prevEntries.some((entry) => entry.id === data.entry_id)
            if (entryExists) {
              return prevEntries.map((entry) => (entry.id === data.entry_id ? normalizeEntry(data) : entry))
            } else {
              return [normalizeEntry(data), ...prevEntries]
            }
          })
        }

        const timestamp = new Date()
        setLastSaved(timestamp)
        setSaveStatus(`Last saved at ${timestamp.toLocaleTimeString()}`)
      } catch (error) {
        console.error("Auto-save failed:", error)
        setSaveStatus("Failed to save")
        toast({
          title: "Auto-save failed",
          description: "Your changes couldn't be saved automatically. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAutoSaving(false)
      }
    },
    [entryId, isNewEntry, promptId, toast, isMounted],
  )

  const debouncedSave = useCallback(
    debounce(async (html: string) => {
      setIsAutoSaving(true)
      setSaveStatus('Saving...')
      try {
        await autoSaveContent(html)
        setSaveStatus(`Last saved at ${new Date().toLocaleTimeString()}`)
      } catch {
        setSaveStatus('Save failed')
      } finally {
        setIsAutoSaving(false)
      }
    }, 1000),
    [autoSaveContent]
  )

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => {
      setSaveStatus('Unsaved changes...')
      debouncedSave(editor.getHTML())
    }
    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
      debouncedSave.cancel()
    }
  }, [editor, debouncedSave])

  // **CHANGE 7: Improved cursor position tracking with error handling**
  const updateCursorPosition = useCallback(
    (editor: any) => {
      if (!editor || !editor.view || !editorRef.current || !isMounted) return

      try {
        const { state } = editor.view
        const { selection } = state
        const { $anchor } = selection
        const pos = editor.view.coordsAtPos($anchor.pos)
        const editorRect = editorRef.current.getBoundingClientRect()

        if (pos) {
          const top = pos.top - editorRect.top + editorRef.current.scrollTop
          const left = pos.left - editorRect.left
          const height = pos.bottom - pos.top

          setCursorPosition({ top, left, height })
        }
      } catch (error) {
        console.warn("Error updating cursor position:", error)
      }
    },
    [isMounted],
  )

  const fetchWriterBlockPrompt = useCallback(async (content: string) => {
    try {
      const response = await fetch(`${FLASK_API_URL}/v1/writer-block-prompt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      setWriterBlockPrompt(data.question)
    } catch (error) {
      console.error("Error fetching writer block prompt:", error)
    }
  }, [])

  const loadPrompt = useCallback(async () => {
    if (editor && isMounted) {
      try {
        const { prompt, prompt_id } = await fetchPrompt()
        setPromptId(prompt_id)
        // **CHANGE 8: Added safety check before setting content**
        if (editor.isDestroyed) return
        editor.commands.setContent(`<p>${prompt}</p><p></p>`)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load prompt. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPrompt(false)
      }
    }
  }, [editor, toast, isMounted])

  useEffect(() => {
    if (entryId != null && editor && isMounted) {
      console.log("entryId: ", entryId);
      (async () => {
        try {
          const res = await fetch(`${FLASK_API_URL}/v1/entries/entryId/${entryId}`,
            {
            credentials: "include",
            }
          );
          if (!res.ok) throw new Error("Failed to load entry");
          const data = await res.json();
          console.log("Entry Text: ", data.entry_text);
          editor.commands.setContent(data.entry_text || data.entryText);
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: "Could not load that entry for editing.",
            variant: "destructive",
          });
        }
      })();
    }
  }, [entryId, editor, isMounted, toast]);

  // **CHANGE 9: Improved mounting and initialization**
  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    if (editor && isMounted) {
      loadPrompt()
    }
  }, [editor, loadPrompt, isMounted])



  function normalizeEntry(entry: any) {
    return {
      id: entry.id ?? entry.entry_id,
      entryText: entry.entryText ?? entry.entry_text,
      createdAt: entry.createdAt ?? entry.created_at,
      promptId: entry.promptId ?? entry.prompt_id,
      theme: entry.theme,
    }
  }

  // **CHANGE 10: Improved typing detection with better cleanup**
  useEffect(() => {
    if (!editor || !isMounted) return

    let typingTimer: NodeJS.Timeout

    const doneTyping = () => {
      if (!isMounted) return
      setIsTyping(false)
      const content = editor.getText()
      if (content.length > 50) {
        fetchWriterBlockPrompt(content)
      }
    }

    const handleUpdate = () => {
      if (!isMounted) return
      clearTimeout(typingTimer)
      setIsTyping(true)
      setWriterBlockPrompt(null)
      typingTimer = setTimeout(doneTyping, 2000)
    }

    editor.on("update", handleUpdate)

    return () => {
      editor.off("update", handleUpdate)
      clearTimeout(typingTimer)
    }
  }, [editor, fetchWriterBlockPrompt, isMounted])

  const handleDeleteEntryFromParent = async (deletedEntryId: number) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== deletedEntryId))
    // Optionally, you could clear the editor if the deleted entry is currently being edited
    if (entryId === deletedEntryId && editor && isMounted) {
      try {
        const { prompt, prompt_id } = await fetchPrompt()
        if (!editor.isDestroyed) {
          editor?.commands.setContent(`<p>${prompt}</p><p></p>`)
        }
        setSaveStatus("")
      } catch (error) {
        console.error("Error loading new prompt:", error)
      }
    }
  }

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(
          `${FLASK_API_URL}/v1/entries`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        const data = await response.json()
        setEntries(data)
      } catch (error) {
        console.error("Failed to fetch entries:", error)
        toast({
          title: "Error",
          description: "Failed to load entries. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (isMounted) {
      fetchEntries()
    }
  }, [toast, isMounted])

  const handleEntryClick = (entry: Entry) => {
    if (editor && isMounted && !editor.isDestroyed) {
      editor.commands.setContent(entry.entryText)
      setSaveStatus(`Editing entry #${entry.id}`)
    }
  }

  const handleCreateNewJournal = async () => {

    if (onCreateNew) {
      onCreateNew();
    }

    if (!isMounted) return

    editor?.commands.clearContent()
    try {
      const { prompt, prompt_id } = await fetchPrompt()
      setPromptId(prompt_id)
      if (editor && !editor.isDestroyed) {
        editor?.commands.setContent(`<p>${prompt}</p><p></p>`)
      }
      setSaveStatus("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load new prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  // **CHANGE 11: Added loading state check**
  if (!isMounted || !editor) {
    return (
      <div className={cn("relative w-full border bg-card rounded-lg", className)}>
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      </div>
    )
  }

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error toggling audio:", error)
      setIsPlaying(false)
    }
  }

  const generateAndPlayAudio = async () => {
    try {
      setIsAudioLoading(true);
      const entryText = editor?.getText() || "";
  
      const response = await fetch(`${FLASK_API_URL}/v2/audios`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_text: entryText }),
      });
  
      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }
  
      // 1) Grab the raw MP3 as a Blob
      const audioBlob = await response.blob();  // audio/mpeg by default
  
      // 2) Create a temporary URL for that Blob
      const url = URL.createObjectURL(audioBlob);
  
      // 3) Wire it up to your <audio> element or Audio object
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      } else {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);  // free the blob URL
        };
      }
  
      // 4) Play!
      await audioRef.current.play();
      setIsPlaying(true);
  
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio.",
        variant: "destructive",
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-screen-md lg:max-w-screen-lg mx-auto max-h-[calc(100dvh-5.75rem)] sm:h-[calc(100dvh-12rem)] relative overflow-hidden border bg-card shadow-lg rounded-xl">
        <EditorToolbar editor={editor} />
        <div ref={editorRef} className="overflow-y-auto overflow-x-auto h-[calc(100%-50px)] relative">
          {isLoadingPrompt ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <EditorContent
              editor={editor}
              className="min-h-[400px] max-w-full box-border cursor-text p-4 sm:p-6 pb-16"
            />
          )}
          {/* **CHANGE 12: Added safety checks for WritersBlockPrompt** */}
          {writerBlockPrompt && !isTyping && isMounted && (
            <WritersBlockPrompt
              prompt={writerBlockPrompt}
              position={cursorPosition}
              onClose={() => setWriterBlockPrompt(null)}
              onApply={(text) => {
                if (editor && !editor.isDestroyed) {
                  editor.commands.insertContent(text)
                  setWriterBlockPrompt(null)
                }
              }}
            />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur">
          <div className="mx-4 my-3">
            <div className="border-t border-border" />
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
            <NextLink
              href="#"
              onClick={handleCreateNewJournal}
              className="group flex h-10 shadow-lg items-center gap-2 rounded-full bg-gray-900 text-white px-4 transition-all duration-300 ease-in-out  hover:bg-neutral-200 hover:px-2 hover:text-black active:bg-neutral-200"
            >
              <span className="rounded-full bg-white p-1 text-sm transition-colors duration-300 group-hover:bg-black">
                <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-white group-active:-rotate-45" />
              </span>
              <span>Create New Journal</span>
            </NextLink>
              {isAutoSaving && <span className="text-sm text-muted-foreground">{saveStatus}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-12 h-12 bg-gray-900 hover:bg-gray-950"
                size="icon"
                onClick={() => {
                  if (!audioRef.current) {
                    generateAndPlayAudio()
                  } else {
                    togglePlayPause()
                  }
                }}
              >
                {isAudioLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* **CHANGE 13: Removed floating components that cause DOM issues** */}
        {/* <FloatingToolbar editor={editor} />
        <TipTapFloatingMenu editor={editor} /> */}
      </div>
    </div>
  )
}
