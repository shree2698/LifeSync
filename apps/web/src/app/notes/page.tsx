"use client"

import * as React from "react"
import { Clipboard, FolderClosed, Plus, Trash2, Pin, Tag, Search, CornerDownRight, FileText, CheckSquare, Square } from "lucide-react"
import { useNoteStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Note } from "@lifesync/types"
import { cn } from "@/lib/utils"

export default function NotesPage() {
  const {
    notes,
    folders,
    activeFolderId,
    isLoading,
    fetchNotes,
    fetchFolders,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    setActiveFolderId,
  } = useNoteStore()

  // Selection states
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [newFolderName, setNewFolderName] = React.useState("")
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false)

  // Editor states (local copies for debounced auto-save)
  const [editTitle, setEditTitle] = React.useState("")
  const [editContent, setEditContent] = React.useState("")
  const [isPinned, setIsPinned] = React.useState(false)

  React.useEffect(() => {
    fetchNotes()
    fetchFolders()
  }, [fetchNotes, fetchFolders])

  // Select note and populate editor fields
  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content || "")
    setIsPinned(note.pinned)
  }

  // Trigger auto-save on local change (simple debounced trigger on Blur or manual Save)
  const handleSaveNote = async () => {
    if (!selectedNoteId) return
    await updateNote(selectedNoteId, {
      title: editTitle,
      content: editContent,
      pinned: isPinned,
    })
  }

  // Create new note
  const handleCreateNote = async () => {
    const success = await createNote({
      title: "Untitled Note",
      content: "",
      pinned: false,
      folderId: activeFolderId,
    })
    if (success) {
      // Find the newly created note and select it
      const updatedNotes = useNoteStore.getState().notes
      if (updatedNotes.length > 0) {
        handleSelectNote(updatedNotes[updatedNotes.length - 1])
      }
    }
  }

  const handleAddFolder = async () => {
    if (!newFolderName) return
    const success = await createFolder(newFolderName)
    if (success) {
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  // Filter notes based on folder and search query
  const filteredNotes = React.useMemo(() => {
    let result = [...notes]
    if (activeFolderId) {
      result = result.filter((n) => n.folderId === activeFolderId)
    }
    if (search) {
      const query = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          (n.content && n.content.toLowerCase().includes(query))
      )
    }
    // Sort: pinned notes first
    result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    return result
  }, [notes, activeFolderId, search])

  // Simple Markdown to HTML preview helper (handles headers and checklists)
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-muted-foreground italic text-xs">No content. Start typing markdown...</p>
    
    const lines = text.split("\n")
    return lines.map((line, idx) => {
      // 1. Headers
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-sm font-bold text-foreground mt-4 mb-2">{line.substring(3)}</h3>
      }
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-xs font-bold text-foreground mt-3 mb-1">{line.substring(4)}</h4>
      }

      // 2. Checklists
      const isChecked = line.startsWith("- [x]") || line.startsWith("- [X]")
      const isUnchecked = line.startsWith("- [ ]")
      if (isChecked || isUnchecked) {
        return (
          <div key={idx} className="flex items-center space-x-2 my-1 text-xs cursor-pointer select-none" onClick={() => toggleChecklistItem(idx, line)}>
            {isChecked ? (
              <CheckSquare className="h-4 w-4 text-indigo-500 shrink-0" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={cn("font-medium", isChecked && "line-through text-muted-foreground")}>
              {line.substring(6)}
            </span>
          </div>
        )
      }

      // 3. Regular lines
      return <p key={idx} className="text-xs leading-relaxed my-0.5 min-h-[16px] text-foreground/80">{line}</p>
    })
  }

  // Toggle checklist item status in the markdown string
  const toggleChecklistItem = async (lineIdx: number, lineContent: string) => {
    if (!selectedNoteId) return
    const lines = editContent.split("\n")
    
    if (lineContent.startsWith("- [ ]")) {
      lines[lineIdx] = "- [x] " + lineContent.substring(6)
    } else {
      lines[lineIdx] = "- [ ] " + lineContent.substring(6)
    }

    const updatedText = lines.join("\n")
    setEditContent(updatedText)
    await updateNote(selectedNoteId, { content: updatedText })
  }

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 dark:border-border/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Markdown Notes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Draft markdown pages, nesting folder segments, and parsing checklists.
            </p>
          </div>
          <Button onClick={handleCreateNote} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 h-10 shadow-md">
            <Plus className="h-4.5 w-4.5" /> Add Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Notes Sidebar (Folders & Notes Listing) */}
          <div className="md:col-span-1 space-y-4 select-none">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl bg-muted/40 pl-9 pr-4 text-xs transition border border-transparent focus:border-border outline-none text-foreground dark:bg-muted/10"
              />
            </div>

            {/* Folders List */}
            <Card>
              <CardContent className="p-3 space-y-1">
                <div className="flex justify-between items-center text-2xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  <span>Folders</span>
                  <button onClick={() => setIsCreatingFolder(!isCreatingFolder)} className="text-indigo-500 hover:underline">
                    {isCreatingFolder ? "Cancel" : "Add"}
                  </button>
                </div>

                {isCreatingFolder && (
                  <div className="flex gap-2 p-2">
                    <Input
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="h-7 text-xs"
                    />
                    <Button onClick={handleAddFolder} size="sm" variant="secondary" className="h-7 text-xs">
                      Save
                    </Button>
                  </div>
                )}

                <button
                  onClick={() => setActiveFolderId(null)}
                  className={cn(
                    "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all",
                    !activeFolderId
                      ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <FolderClosed className="h-4 w-4" />
                  <span>All Notebooks</span>
                </button>

                {folders.map((fld) => (
                  <button
                    key={fld.id}
                    onClick={() => setActiveFolderId(fld.id)}
                    className={cn(
                      "w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all",
                      activeFolderId === fld.id
                        ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <FolderClosed className="h-4 w-4" />
                    <span>{fld.name}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Notes List */}
            <div className="space-y-2">
              {filteredNotes.map((note) => {
                const isSelected = selectedNoteId === note.id
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={cn(
                      "p-3 rounded-xl border transition cursor-pointer flex flex-col justify-center",
                      isSelected
                        ? "border-indigo-500/30 bg-indigo-500/5 text-foreground ring-1 ring-indigo-500/10"
                        : "border-border/60 bg-card/60 hover:bg-muted/30 dark:border-border/10"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold truncate block leading-tight">{note.title || "Untitled"}</span>
                      {note.pinned && <Pin className="h-3 w-3 text-indigo-500 fill-indigo-500 shrink-0 mt-0.5" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate block mt-1">
                      {note.content || "Empty note body..."}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Editor & Preview Area (Right side) */}
          <div className="md:col-span-3">
            {selectedNoteId ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Markdown Input Panel */}
                <Card className="flex flex-col">
                  <div className="p-4 border-b border-border/40 flex justify-between items-center dark:border-border/10">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note Title"
                      onBlur={handleSaveNote}
                      className="border-none font-bold text-sm bg-transparent px-0 shadow-none focus-visible:ring-0 w-[70%]"
                    />
                    <div className="flex space-x-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setIsPinned(!isPinned)
                          updateNote(selectedNoteId, { pinned: !isPinned })
                        }}
                        className={cn("p-1.5 rounded-lg border transition", isPinned ? "text-indigo-500 border-indigo-500/20 bg-indigo-500/5" : "text-muted-foreground border-border/40")}
                        title="Pin note"
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteNote(selectedNoteId)
                          setSelectedNoteId(null)
                        }}
                        className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <textarea
                      placeholder="Write your markdown here... (supports checklists and headers)"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onBlur={handleSaveNote}
                      className="w-full flex-1 min-h-[300px] outline-none text-xs font-mono leading-relaxed bg-transparent border-none text-foreground resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Markdown Output Preview Panel */}
                <Card className="flex flex-col border-indigo-500/5 bg-indigo-500/[0.01]">
                  <div className="p-4 border-b border-border/40 dark:border-border/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Markdown Preview
                  </div>
                  <CardContent className="p-5 flex-1 overflow-y-auto max-h-[400px]">
                    <h2 className="text-base font-extrabold text-foreground mb-3">{editTitle || "Untitled Note"}</h2>
                    <div className="space-y-1.5">{renderMarkdown(editContent)}</div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-semibold">No note selected</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">Select a note from the left list or create a new note to start writing markdown checklists.</p>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
