"use client"

import "./tiptap.css"
import { cn } from "@/lib/utils"
import { ImageExtension } from "@/components/tiptap/extensions/image"
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder"
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace"
import { AnimatePresence } from "framer-motion"
import { Notification } from "@/components/stacked-notification"
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
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu"
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar"
import { EditorToolbar } from "./toolbars/editor-toolbar"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { SendIcon, Loader2, Play, Pause } from "lucide-react"
import { useCallback, useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"

import { WritersBlockPrompt } from "./writers-block-prompt"
import { EntryHistory } from "./entry-history"

// API function to fetch a prompt for a given user
const fetchPrompt = async (userId: number): Promise<{ prompt: string; prompt_id: number }> => {
  const response = await fetch(`http://127.0.0.1:5000/v1/prompts/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch prompt")
  }
  return response.json()
}

// API function to submit a journal entry
const submitEntry = async (
  userId: number,
  entryText: string,
  promptId: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch("http://127.0.0.1:5000/v1/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      entry_text: entryText,
      prompt_id: promptId,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to submit content. Please try again.")
  }
  return response.json()
}

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
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
]

type NotificationType = {
  id: number
  text: string
}

interface Entry {
  id: number,
  userId: number
  promptId: number,
  entryText: string,
  theme: string,
  createdAt: string
}

export function RichTextEditorDemo({
  className,
  userId = 1, // Dummy userId of 1 by default
}: {
  className?: string
  userId?: number
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
  const isPlayingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  //const [characterCount, setCharacterCount] = useState(0) // Removed character counter state

  const { toast } = useToast()

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: "",
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setIsTyping(true)
      updateCursorPosition(editor)
      //setCharacterCount(editor.storage.characterCount.characters()) // Removed character count update
    },
  })

  const updateCursorPosition = useCallback((editor: any) => {
    if (!editor || !editor.view || !editorRef.current) return

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
  }, [])

  const fetchWriterBlockPrompt = useCallback(async (content: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/v1/writer-block-prompt`, {
        method: "POST",
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

  useEffect(() => {
    const loadPrompt = async () => {
      if (editor) {
        try {
          const { prompt, prompt_id } = await fetchPrompt(userId)
          setPromptId(prompt_id)
          editor.commands.setContent(`<p><strong>Prompt:</strong> ${prompt}</p><p></p>`)
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
    }

    if (editor) {
      loadPrompt()
    }
  }, [editor, toast, userId])

  useEffect(() => {
    if (!editor) return

    let typingTimer: NodeJS.Timeout
    const doneTypingInterval = 2000 // 2 seconds

    const doneTyping = () => {
      setIsTyping(false)
      const content = editor.getText()
      if (content.length > 50) {
        fetchWriterBlockPrompt(content)
      }
    }

    const handleUpdate = () => {
      clearTimeout(typingTimer)
      setIsTyping(true)
      setWriterBlockPrompt(null)
      typingTimer = setTimeout(doneTyping, doneTypingInterval)
    }

    editor.on("update", handleUpdate)

    return () => {
      editor.off("update", handleUpdate)
      clearTimeout(typingTimer)
    }
  }, [editor, fetchWriterBlockPrompt])

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/v1/entries/${userId}`);
        const data = await response.json();
        // If your API returns a plain list, use:
        setEntries(data);
        // If it returns an object with an "entries" property, you’d do:
        // setEntries(data.entries);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
        toast({
          title: "Error",
          description: "Failed to load entries. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    fetchEntries();
  }, [toast, userId]);

  const handleEnter = async () => {
    if (editor && promptId !== null) {
      const content = editor.getHTML()
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        })
        const data = await response.json()

        toast({
          title: "Success",
          description: "Entry saved successfully!",
        })
        showNotification("Entry saved!")

        // Add the new entry to the history
        setEntries((prevEntries) => [data.entry, ...prevEntries])

        // Clear the editor content
        editor.commands.clearContent()

        // Fetch a new prompt
        const { prompt, prompt_id } = await fetchPrompt(userId)
        setPromptId(prompt_id)
        editor.commands.setContent(`<p><strong>Prompt:</strong> ${prompt}</p><p></p>`)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Editor not ready or prompt not loaded.",
        variant: "destructive",
      })
    }
  }

  const handleEntryClick = (entry: Entry) => {
    if (editor) {
      editor.commands.setContent(entry.entryText)
      // We're not resetting the promptId here, so the current prompt remains active
    }
  }

  const handleCreateNewJournal = async () => {
    if (editor && editor.getText().trim() !== "") {
      // Save current content if it's not empty
      await handleEnter()
    }

    // Clear the editor and fetch a new prompt
    editor?.commands.clearContent()
    try {
      const { prompt, prompt_id } = await fetchPrompt(userId)
      setPromptId(prompt_id)
      editor?.commands.setContent(`<p><strong>Prompt:</strong> ${prompt}</p><p></p>`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load new prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!editor) return null

  const showNotification = (message: string) => {
    setNotification({ id: Date.now(), text: message })
  }


  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlayingRef.current) {
        audioRef.current.pause()
        isPlayingRef.current = false
        setIsPlaying(false)
      } else {
        // Wait for the play promise to resolve
        isPlayingRef.current = true
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      // If play() fails, reset the playing state
      console.error("Error playing audio:", error)
      isPlayingRef.current = false
      setIsPlaying(false)
    }
  }

const generateAndPlayAudio = async () => {
  try {
    const entryText = editor?.getText() || "";
    
    const response = await fetch("http://127.0.0.1:5000/v1/audios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry_text: entryText }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }
    
    const data = await response.json();
    const audioUrl = data.audio;
    
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error("Error generating audio:", error);
    toast({
      title: "Error",
      description: "Failed to generate audio.",
      variant: "destructive",
    });
  }
};

  return (
    // <div className={cn("flex flex-col md:flex-row w-full h-full", className)}>
    <div className="flex flex-col md:flex-row w-full h-screen justify-center items-start gap-20 px-4 overflow-hidden">
      {/* <div className="flex-grow max-w-3xl relative overflow-hidden border bg-card shadow-lg rounded-xl"> */}
      <div className="flex-grow w-full md:w-[750px] h-[600px] relative overflow-hidden border bg-card shadow-lg rounded-xl">
        <EditorToolbar editor={editor} />
        <div ref={editorRef} className="overflow-y-auto h-[calc(100%-50px)] relative">
          {" "}
          {/* Adjusted height */}
          {isLoadingPrompt ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <EditorContent editor={editor} className="min-h-[400px] w-full cursor-text p-4 sm:p-6 pb-16" />
          )}
          {writerBlockPrompt && !isTyping && (
            <WritersBlockPrompt
              prompt={writerBlockPrompt}
              position={cursorPosition}
              onClose={() => setWriterBlockPrompt(null)}
              onApply={(text) => {
                editor.commands.insertContent(text)
                setWriterBlockPrompt(null)
              }}
            />
          )}
        </div>
        <AnimatePresence>
          {notification && (
            <Notification
              key={notification.id}
              id={notification.id}
              text={notification.text}
              removeNotif={() => setNotification(null)}
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur">
          <div className="mx-4 my-3">
            <div className="border-t border-border" /> {/* Separated line with margins */}
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <Button
              onClick={handleCreateNewJournal}
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 bg-black hover:bg-black/90 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Journal
            </Button>
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-12 h-12 bg-black hover:bg-black/90"
                size="icon"
                onClick={generateAndPlayAudio}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-6 w-6 text-white" />}
              </Button>
              <Button
                onClick={handleEnter}
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-12 h-12 bg-black hover:bg-black/90"
                size="icon"
                disabled={isSubmitting || isLoadingPrompt}
              >
                {isSubmitting ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <SendIcon className="h-6 w-6 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <FloatingToolbar editor={editor} />
        <TipTapFloatingMenu editor={editor} />
      </div>
      <div className="w-full md:w-[320px] h-[600px] mt-4 md:mt-0 shadow-lg rounded-xl overflow-y-auto">
      {/* <div className="w-full md:w-80 mt-4 md:mt-0 md:ml-4 shadow-lg flex-grow rounded-xl"> */}
        <EntryHistory entries={entries} onEntryClick={handleEntryClick} />
      </div>
    </div>
  )
}

