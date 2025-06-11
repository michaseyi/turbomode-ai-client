"use client"

import { useState, useEffect, useRef } from "react"
import {
	PlusIcon,
	EditIcon,
	TrashIcon,
	CalendarIcon,
	Search,
	Loader2,
	Mail,
	Notebook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { toast } from "sonner"

export default function NotesPage() {
	const [searchInput, setSearchInput] = useState("")
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
	const debounceTimeoutRef = useRef<NodeJS.Timeout>(null)

	useEffect(() => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current)
		}

		debounceTimeoutRef.current = setTimeout(() => {
			setDebouncedSearchTerm(searchInput)
		}, 500)

		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current)
			}
		}
	}, [searchInput])

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isError } =
		useInfiniteQuery({
			queryKey: ["notes", debouncedSearchTerm],
			queryFn: async ({ pageParam }) => {
				if (debouncedSearchTerm) {
					return await api.notes.searchNotes(debouncedSearchTerm, pageParam, 4)
				}
				return await api.notes.fetchNotes(pageParam, 25)
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
			},
		})

	const notes = data?.pages.flatMap((page) => page.data) ?? []

	const queryClient = useQueryClient()

	const createNoteMutation = useMutation({
		mutationKey: ["create-note"],
		mutationFn: async () => {
			return await api.notes.createNote()
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: (data) => {
			const { data: createdNote } = data
			queryClient.invalidateQueries({ queryKey: ["notes"] })
			toast("Note created")
			router.push(`/notes/${createdNote.id}`)
		},
	})

	const deleteNoteMutation = useMutation({
		mutationKey: ["delete-note"],
		mutationFn: async (noteId: string) => {
			return await api.notes.deleteNote(noteId)
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] })
			toast("Note deleted")
		},
	})

	const handleCreateNote = () => {
		createNoteMutation.mutate()
	}

	const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
		e.stopPropagation()
		deleteNoteMutation.mutate(noteId)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
	}

	const router = useRouter()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!bottomRef.current || !hasNextPage) return

		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchNextPage()
				}
			},
			{
				threshold: 1.0,
			}
		)

		observerRef.current.observe(bottomRef.current)

		return () => {
			if (observerRef.current) observerRef.current.disconnect()
		}
	}, [bottomRef.current, hasNextPage, fetchNextPage])

	const isSearching = searchInput !== debouncedSearchTerm && searchInput.length > 0

	return (
		<div className="space-y-4 md:space-y-8 pb-6">
			<div className="bg-card">
				<div className="flex items-center justify-between mb-4 md:mb-6">
					<div className="flex items-center space-x-4">
						<Notebook />
						<h1 className="text-2xl font-bold text-foreground">My Notes</h1>
					</div>
					<Button
						disabled={createNoteMutation.isPending}
						onClick={handleCreateNote}
						variant="outline"
					>
						{createNoteMutation.isPending ? (
							<Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
						) : (
							<PlusIcon className="w-4 h-4" />
						)}
					</Button>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
					{isSearching && (
						<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
					)}
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search notes..."
						className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
			</div>

			<div>
				{isLoading ? (
					<LoadingState />
				) : isError ? (
					<ErrorState onRetry={() => refetch()} />
				) : notes.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-muted-foreground text-lg mb-2">
							{debouncedSearchTerm ? "No notes found" : "No notes yet"}
						</div>
						<div className="text-muted-foreground text-sm mb-6">
							{debouncedSearchTerm
								? "Try adjusting your search terms"
								: "Create your first note to get started"}
						</div>
						{!debouncedSearchTerm && (
							<Button
								onClick={handleCreateNote}
								disabled={createNoteMutation.isPending}
								className="px-6 py-3 rounded-lg text-base hover:bg-primary/90 transition-colors"
							>
								Create Note
							</Button>
						)}
					</div>
				) : (
					<div className="grid gap-2 md:gap-4">
						{notes.map((note) => {
							const isLastItem = notes.at(-1)?.id === note.id

							return (
								<div
									ref={isLastItem ? bottomRef : null}
									onClick={() => {
										router.push(`/notes/${note.id}`)
									}}
									key={note.id}
									className="bg-card border border-border rounded-lg p-3 md:p-6 hover:bg-accent transition-colors cursor-pointer group"
								>
									<div className="flex items-center md:items-start justify-between md:mb-3">
										<h3 className="md:text-lg font-semibold text-foreground group-hover:text-accent-foreground">
											{note.title}
										</h3>
										<div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												className="text-muted-foreground hover:text-foreground !p-1 rounded cursor-pointer"
											>
												<EditIcon className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												disabled={deleteNoteMutation.isPending}
												onClick={(e) => handleDeleteNote(note.id, e)}
												className="cursor-pointer text-muted-foreground hover:text-destructive !p-1 rounded"
											>
												{deleteNoteMutation.isPending ? (
													<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
												) : (
													<TrashIcon className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>

									{note.snippet && (
										<p className="text-muted-foreground text-sm mb-1 md:mb-4 line-clamp-1">
											{note.snippet}
										</p>
									)}

									<div className="flex items-center text-xs text-muted-foreground">
										<CalendarIcon className="w-3 h-3 mr-1" />
										Updated {formatDate(note.updatedAt)}
									</div>
								</div>
							)
						})}

						{isFetchingNextPage && <LoadingState />}
					</div>
				)}
			</div>
		</div>
	)
}
