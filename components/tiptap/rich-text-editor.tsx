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

import { Entry } from "@/types/entry"
import { NotificationType } from "@/types/notification"
import { v4 as uuidv4 } from 'uuid'

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://127.0.0.1:5000'

// API function to fetch a prompt for a given user
const fetchPrompt = async (userId: number): Promise<{ prompt: string; prompt_id: number }> => {
  const response = await fetch(`${FLASK_API_URL}/v1/prompts/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch prompt")
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

export function RichTextEditorDemo({
  className,
  userId = 1, // Dummy userId of 1 by default
  initialContent = '',
  entryId = null,
}: {
  className?: string
  userId?: number
  initialContent?: string
  entryId?: number | null
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
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [currentEntryId, setCurrentEntryId] = useState<number | null>(entryId)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState('')
  const [isNewEntry, setIsNewEntry] = useState(!entryId)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()


//   const [isAudioLoading, setIsAudioLoading] = useState(false);
// const [isPlaying, setIsPlaying] = useState(false);
// const audioRef = useRef<HTMLAudioElement | null>(null);
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

      setSaveStatus('Unsaved changes...')
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (editor.getText().trim().length > 0) {
          autoSaveContent(editor.getHTML())
        }
      }, 1000)
    },
  })

  // useEffect(() => {
  //   if (!entryId && !currentEntryId) {
  //     const newId = uuidv4()
  //     setCurrentEntryId(newId)
  //     setIsNewEntry(true)
  //     console.log('Generated new entry ID:', newId)
  //   }
  // }, [entryId, currentEntryId])

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
      const response = await fetch(`${FLASK_API_URL}/v1/writer-block-prompt`, {
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


  const loadPrompt = useCallback(async () => {
    if (editor) {
      try {
        const { prompt, prompt_id } = await fetchPrompt(userId)
        setPromptId(prompt_id)
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
  }, [editor, toast, userId])

  useEffect(() => {
    if (editor) {
      loadPrompt()
    }
  }, [editor, loadPrompt])

  const autoSaveContent = useCallback(
    async (content: string) => {
      console.log("AutoSave in progress...")
      if (!content.trim()) return

      setIsAutoSaving(true)
      setSaveStatus('Saving...')
      
      try {
        const url = isNewEntry 
          ? `${FLASK_API_URL}/v1/entries`
          : `${FLASK_API_URL}/v1/entries/${currentEntryId}`
        
        const method = isNewEntry ? 'POST' : 'PUT'

        const payload = isNewEntry
        ? {
            user_id: userId,
            prompt_id: promptId || null,
            entry_text: content,
          }
        : {
            user_id: userId,
            prompt_id: promptId || null,
            content: content,
          };
        
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        console.log("URL request completed")

        if (!response.ok) {
          throw new Error(`Failed to ${isNewEntry ? 'create' : 'update'} entry`)
        }

        const data = await response.json()
        
        if (isNewEntry) {
          setCurrentEntryId(data.entry_id);
          setIsNewEntry(false)
          // Update URL without page reload for better UX
          // if (typeof window !== 'undefined' && window.history && window.history.pushState) {
          //   window.history.pushState({}, '', `/journal/${currentEntryId}`)
          // }
        }

        console.log("Entries: ", entries)
        
        // Update entries list with the saved entry
        if (data) {
          setEntries(prevEntries => {
            const entryExists = prevEntries.some(entry => entry.id === data.entry_id)
            if (entryExists) {
              return prevEntries.map(entry => 
                entry.id === data.entry_id ? normalizeEntry(data) : entry
              )
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
        setSaveStatus('Failed to save')
        toast({
          title: "Auto-save failed",
          description: "Your changes couldn't be saved automatically. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAutoSaving(false)
      }
    },
    [currentEntryId, isNewEntry, promptId, toast, userId],
  )

  function normalizeEntry(entry: any) {
    return {
      id: entry.id ?? entry.entry_id,
      entryText: entry.entryText ?? entry.entry_text,
      createdAt: entry.createdAt ?? entry.created_at,
      promptId: entry.promptId ?? entry.prompt_id,
      theme: entry.theme,
      userId: entry.userId ?? entry.user_id,
    };
  }
  

  useEffect(() => {
    if (!editor) return

    let typingTimer: NodeJS.Timeout
    const doneTypingInterval = 2000

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

  const handleDeleteEntryFromParent = async (entryId: number) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== entryId));

    if (currentEntryId === entryId && editor) {
      const { prompt, prompt_id } = await fetchPrompt(userId)
      editor?.commands.setContent(`<p>${prompt}</p><p></p>`)
      setCurrentEntryId(null);              
      setIsNewEntry(true);                  // treat next save as "new"
      setSaveStatus('');                    // reset any “Last saved...” label
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${FLASK_API_URL}/v1/entries/${userId}`);
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

  const handleEntryClick = (entry: Entry) => {
    if (editor) {
      editor.commands.setContent(entry.entryText)
      setCurrentEntryId(entry.id)
      setIsNewEntry(false)
      setSaveStatus(`Editing entry #${entry.id}`)
    }
  }

  const handleCreateNewJournal = async () => {
    // if (editor && editor.getText().trim() !== "") {
    //   // Save current content if it's not empty
    //   autoSaveContent(editor.getHTML())
    // }

    // Clear the editor and fetch a new prompt
    editor?.commands.clearContent()
    try {
      const { prompt, prompt_id } = await fetchPrompt(userId)
      setPromptId(prompt_id)
      editor?.commands.setContent(`<p>${prompt}</p><p></p>`)
      setCurrentEntryId(null);              
      setIsNewEntry(true); 
      setSaveStatus(''); 
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load new prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!editor) return null

  const togglePlayPause = async () => {
    if (!audioRef.current) return;
  
    try {
      if (isPlaying) {
        // Pausing the audio retains its currentTime.
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Resumes playback from the last paused position.
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
      setIsPlaying(false);
    }
  };

  const generateAndPlayAudio = async () => {
    try {
      setIsAudioLoading(true);
      const entryText = editor?.getText() || "";
      const response = await fetch(`${FLASK_API_URL}//v1/audios`, {
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
  
      // If an audio instance already exists, update its source; otherwise, create one.
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      } else {
        audioRef.current = new Audio(audioUrl);
        // When the audio finishes, update isPlaying so the button reverts to play.
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
  
      // Play the audio and update state.
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
    // <div className={cn("flex flex-col md:flex-row w-full h-full", className)}>
    <div className="flex flex-col md:flex-row w-full justify-center items-start gap-10 px-4">
      {/* <div className="flex-grow max-w-3xl relative overflow-hidden border bg-card shadow-lg rounded-xl"> */}
      <div className="w-full md:w-[950px] max-h-[calc(100dvh-5.75rem)] sm:h-[calc(100dvh-12rem)] relative overflow-hidden border bg-card shadow-lg rounded-xl">
        <EditorToolbar editor={editor} />
        <div ref={editorRef} className="overflow-y-auto h-[calc(100%-50px)] relative">
          {" "}
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
        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur">
          <div className="mx-4 my-3">
            <div className="border-t border-border" /> {/* Separated line with margins */}
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCreateNewJournal}
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gray-900 hover:bg-gray-950 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Journal
              </Button>
              {isAutoSaving && <span className="text-sm text-muted-foreground">{saveStatus}</span>}
            </div>
            <div className="flex items-center gap-2">
            <Button
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-12 h-12 bg-gray-900 hover:bg-gray-950"
                size="icon"
                onClick={() => {
                  if (!audioRef.current) {
                    generateAndPlayAudio();
                  } else {
                    togglePlayPause();
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
        <FloatingToolbar editor={editor} />
        <TipTapFloatingMenu editor={editor} />
      </div>
      <div className="hidden lg:block w-full md:w-[320px] h-[calc(100dvh-12rem)] flex-grow mt-4 md:mt-0 shadow-lg rounded-xl">
      {/* <div className="w-full md:w-80 mt-4 md:mt-0 md:ml-4 shadow-lg flex-grow rounded-xl"> */}
        <EntryHistory entries={entries} onEntryClick={handleEntryClick} onDeleteEntry={handleDeleteEntryFromParent} currentEntryId={currentEntryId} />
      </div>
    </div>
  )
}

