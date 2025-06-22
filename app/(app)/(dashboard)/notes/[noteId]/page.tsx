"use client"

import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import "./styles.css"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { UpdateNoteProps } from "@/types/api"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Cloud, CloudOff, Loader2, Store, WifiOff } from "lucide-react"
import { useAgentContextStore } from "@/stores/agent-context"
import { useShallow } from "zustand/react/shallow"

type SaveStatus = "saved" | "saving" | "pending" | "error" | "offline"

export default function NoteItemPage() {
	const { noteId } = useParams<{ noteId: string }>()

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["notes", noteId],
		queryFn: async () => {
			return await api.notes.fetchNote(noteId)
		},
	})
	const router = useRouter()

	const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
	const [lastSaved, setLastSaved] = useState<Date>()
	const [title, setTitle] = useState("")
	const [isInitialized, setIsInitialized] = useState(false)

	const autoSaveTimeoutRef = useRef<NodeJS.Timeout>(null)
	const pendingChangesRef = useRef(false)
	const isOnlineRef = useRef(navigator.onLine)

	const editor = useCreateBlockNote()

	const updateNoteMutation = useMutation({
		mutationKey: ["update-note", noteId],
		mutationFn: async (update: UpdateNoteProps) => {
			return await api.notes.updateNote(noteId, update)
		},
		onMutate: () => {
			setSaveStatus("saving")
		},

		onError: (err) => {
			setSaveStatus("error")
			toast.error("Failed to save note", {
				description: err.message,
				action: {
					label: "Retry",
					onClick: () => performAutoSave(),
				},
			})
		},
		onSuccess: () => {
			setSaveStatus("saved")
			setLastSaved(new Date())
			pendingChangesRef.current = false
		},
	})

	const performAutoSave = useCallback(() => {
		if (!isInitialized || !pendingChangesRef.current || !isOnlineRef.current) {
			return
		}

		updateNoteMutation.mutate({
			title,
			content: editor.document,
		})
	}, [title, editor.document, isInitialized, updateNoteMutation])

	const scheduleAutoSave = useCallback(() => {
		if (!isInitialized) return

		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current)
		}

		setSaveStatus("pending")
		pendingChangesRef.current = true

		autoSaveTimeoutRef.current = setTimeout(() => {
			performAutoSave()
		}, 500)
	}, [isInitialized, performAutoSave])

	useEffect(() => {
		if (data && !isInitialized) {
			const note = data.data
			setTitle(note.title)
			const defaultDocument = editor.document[0]
			editor.insertBlocks(note.content, defaultDocument, "before")
			editor.removeBlocks([defaultDocument])

			setIsInitialized(true)
			setLastSaved(new Date(note.updatedAt || note.createdAt))
			console.log(note.content)
		}
	}, [data?.data.id])

	useEffect(() => {
		if (!isInitialized) return

		const cleanup = editor.onChange(() => {
			scheduleAutoSave()
		})

		return cleanup
	}, [editor, isInitialized, scheduleAutoSave])

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTitle(e.target.value)
		scheduleAutoSave()
	}

	function handleUpdate() {
		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current)
		}
		updateNoteMutation.mutate({
			title,
			content: editor.document,
		})
	}

	const handleGoBack = () => {
		router.back()
	}

	// online/offline detection
	useEffect(() => {
		const handleOnline = () => {
			isOnlineRef.current = true
			if (pendingChangesRef.current) {
				setSaveStatus("pending")
				performAutoSave()
			} else {
				setSaveStatus("saved")
			}
		}

		const handleOffline = () => {
			isOnlineRef.current = false
			setSaveStatus("offline")
		}

		window.addEventListener("online", handleOnline)
		window.addEventListener("offline", handleOffline)

		return () => {
			window.removeEventListener("online", handleOnline)
			window.removeEventListener("offline", handleOffline)
		}
	}, [performAutoSave])

	useEffect(() => {
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (pendingChangesRef.current) {
				e.preventDefault()
				return "You have unsaved changes. Are you sure you want to leave?"
			}
		}

		window.addEventListener("beforeunload", handleBeforeUnload)
		return () => window.removeEventListener("beforeunload", handleBeforeUnload)
	}, [])

	const SaveStatusIndicator = () => {
		const getStatusConfig = () => {
			switch (saveStatus) {
				case "saved":
					return {
						icon: CheckCircle2,
						text: "Saved",
						className: "text-green-600",
					}
				case "saving":
					return {
						icon: Loader2,
						text: "Saving...",
						className: "text-blue-600",
						animate: true,
					}
				case "pending":
					return {
						icon: Cloud,
						text: "Unsaved",
						className: "text-amber-600",
					}
				case "error":
					return {
						icon: CloudOff,
						text: "Error",
						className: "text-red-600",
					}
				case "offline":
					return {
						icon: WifiOff,
						text: "Offline",
						className: "text-gray-600",
					}
			}
		}

		const config = getStatusConfig()
		const Icon = config.icon

		return (
			<div className="flex items-center gap-2 text-sm">
				<Icon className={`w-4 h-4 ${config.className} ${config.animate ? "animate-spin" : ""}`} />
				<span className={config.className}>{config.text}</span>
			</div>
		)
	}

	const [contexts, addContext] = useAgentContextStore(
		useShallow((state) => [state.contexts, state.addContext])
	)

	function handleAddContext() {
		if (!data) return

		if (contexts.find((c) => c.metadata.noteId === data.data.id)) {
			return
		}

		const note = data.data

		addContext({
			id: note.id,
			name: note.title,
			type: "note",
			metadata: {
				noteId: note.id,
			},
		})

		toast.success("Note added to context")
	}

	return isLoading ? (
		<LoadingState />
	) : isError ? (
		<ErrorState
			onRetry={() => {
				refetch()
			}}
		/>
	) : (
		<div className="h-full note-editor bg-backgroun text-foreground">
			<div className="mb-6 flex gap-x-2">
				<div className="flex items-center space-x-4">
					<button
						onClick={handleGoBack}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
				</div>
				<div className="flex-1">
					<input
						type="text"
						className="w-full bg-card pl-3 pr-2 py-1 rounded-md text-xl md:text-3xl font-semibold text-primary focus:outline-none transition"
						value={title}
						onChange={handleTitleChange}
						placeholder="Title..."
					/>
				</div>
				<div className="flex items-center justify-end ml-auto pr-2 min-w-24 gap-2">
					<SaveStatusIndicator />
					<button
						onClick={handleAddContext}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title="Add to context"
					>
						<Store className="w-5 h-5" />
					</button>
				</div>
			</div>
			<div className="pb-6">
				<div className="border border-border rounded-lg pb-6 pt-3">
					<BlockNoteView editor={editor} data-theming-css-variables-demo />
				</div>
			</div>
		</div>
	)
}
