"use client"
import { useState, useEffect } from "react"
import { ArrowLeftIcon, SaveIcon, TrashIcon } from "lucide-react"
import { Note } from "../page"

import "@blocknote/core/fonts/inter.css"
import { BlockNoteView, lightDefaultTheme, Theme } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"

import "./styles.css"

export default function NoteItemPage() {
	const editor = useCreateBlockNote({
		initialContent: [
			{
				type: "heading",
				content: "Welcome to this demo!",
			},
			{
				type: "paragraph",
				content: "Open up a menu or toolbar to see more of the red theme",
			},
			{
				type: "paragraph",
				content: "Toggle light/dark mode in the page footer and see the theme change too",
			},
			{
				type: "paragraph",
			},
		],
	})
	return (
		<div className="h-full note-editor">
			<BlockNoteView editor={editor} data-theming-css-variables-demo />
		</div>
	)
}

interface NoteEditPageProps {
	note?: Note
	onBack: () => void
	onSave: (note: Note) => void
	onDelete?: (noteId: string) => void
}

export function NoteEditPage({ note, onBack, onSave, onDelete }: NoteEditPageProps) {
	const [title, setTitle] = useState(note?.title || "")
	const [content, setContent] = useState(note?.content || "")
	const [saving, setSaving] = useState(false)
	const [hasChanges, setHasChanges] = useState(false)

	useEffect(() => {
		const hasModifications = title !== (note?.title || "") || content !== (note?.content || "")
		setHasChanges(hasModifications)
	}, [title, content, note])

	const handleSave = () => {
		if (!title.trim()) {
			alert("Please enter a title for your note")
			return
		}

		setSaving(true)

		// Mock save with setTimeout to simulate API call
		setTimeout(() => {
			const noteData = {
				id: note?.id || crypto.randomUUID(),
				title: title.trim(),
				content: content.trim(),
				createdAt: note?.createdAt || new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			onSave(noteData)
			setHasChanges(false)
			setSaving(false)
		}, 800) // Simulate network delay
	}

	const handleDelete = () => {
		if (!note || !onDelete) return

		const confirmed = confirm("Are you sure you want to delete this note?")
		if (!confirmed) return

		// Mock delete - just call the callback
		onDelete(note.id)
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header */}
			<div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
						>
							<ArrowLeftIcon className="w-5 h-5" />
						</button>
						<h1 className="text-xl font-semibold text-foreground">
							{note ? "Edit Note" : "New Note"}
						</h1>
					</div>

					<div className="flex items-center gap-2">
						{note && onDelete && (
							<button
								onClick={handleDelete}
								className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-accent transition-colors"
							>
								<TrashIcon className="w-5 h-5" />
							</button>
						)}
						<button
							onClick={handleSave}
							disabled={saving || !hasChanges}
							className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<SaveIcon className="w-4 h-4" />
							{saving ? "Saving..." : "Save"}
						</button>
					</div>
				</div>
			</div>

			{/* Editor */}
			<div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
				<div className="space-y-6">
					{/* Title Input */}
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Note title..."
						className="w-full text-2xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none"
					/>

					{/* Content Textarea */}
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Start writing your note..."
						className="w-full min-h-[calc(100vh-300px)] bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
					/>
				</div>
			</div>

			{/* Save indicator */}
			{hasChanges && (
				<div className="fixed bottom-6 right-6 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm">
					Unsaved changes
				</div>
			)}
		</div>
	)
}
