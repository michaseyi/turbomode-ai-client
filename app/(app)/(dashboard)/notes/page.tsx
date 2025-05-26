"use client"

export interface Note {
	id: string
	title: string
	content: string
	createdAt: string
	updatedAt: string
}

import { useState, useEffect } from "react"
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NotesListPageProps {
	notes: Note[]
	onCreateNote: () => void
	onDeleteNote: (noteId: string) => void
}

export default function NotesPage() {
	const [notes, setNotes] = useState<Note[]>([])

	useEffect(() => {
		setNotes([
			{
				id: "1",
				title: "Meeting Notes - Q1 Planning",
				content:
					"Discussed project timeline and deliverables for Q1. Key points: 1) Launch new feature by March 2) Hire 2 new developers 3) Implement user feedback system 4) Review analytics dashboard...",
				createdAt: "2024-01-15T10:30:00Z",
				updatedAt: "2024-01-15T14:20:00Z",
			},
			{
				id: "2",
				title: "App Ideas & Features",
				content:
					"New features to implement: dark mode, search functionality, export to PDF, collaborative editing, mobile app version, offline sync, advanced filtering...",
				createdAt: "2024-01-14T09:15:00Z",
				updatedAt: "2024-01-14T16:45:00Z",
			},
			{
				id: "3",
				title: "Recipe: Homemade Pasta",
				content:
					"Ingredients: 2 cups flour, 3 eggs, 1 tsp salt, 2 tbsp olive oil. Instructions: Make a well with flour, crack eggs in center, mix gradually, knead for 10 minutes...",
				createdAt: "2024-01-13T18:20:00Z",
				updatedAt: "2024-01-13T19:15:00Z",
			},
			{
				id: "4",
				title: "Book Notes: The Design of Everyday Things",
				content:
					"Chapter 1: Psychology of everyday actions. Key concepts: affordances, signifiers, mapping, feedback. Don Norman emphasizes user-centered design principles...",
				createdAt: "2024-01-12T20:45:00Z",
				updatedAt: "2024-01-12T21:30:00Z",
			},
			{
				id: "5",
				title: "Travel Itinerary - Japan 2024",
				content:
					"Day 1: Tokyo - Shibuya, Harajuku. Day 2: Asakusa Temple, Tokyo Skytree. Day 3: Day trip to Nikko. Day 4: Kyoto - Kinkaku-ji, Fushimi Inari...",
				createdAt: "2024-01-11T15:30:00Z",
				updatedAt: "2024-01-11T16:45:00Z",
			},
			{
				id: "6",
				title: "Workout Plan",
				content:
					"Monday: Upper body - Bench press 3x8, Pull-ups 3x10, Shoulder press 3x12. Tuesday: Lower body - Squats 3x8, Deadlifts 3x6, Lunges 3x12...",
				createdAt: "2024-01-10T07:00:00Z",
				updatedAt: "2024-01-10T07:30:00Z",
			},
			{
				id: "7",
				title: "Quick Thoughts",
				content:
					"Random ideas and thoughts throughout the day. Coffee shop on 5th street has amazing pastries. Need to call mom this weekend. Remember to water plants...",
				createdAt: "2024-01-09T14:22:00Z",
				updatedAt: "2024-01-09T16:10:00Z",
			},
			{
				id: "8",
				title: "Learning Goals 2024",
				content:
					"Technical: Learn Three.js, improve TypeScript skills, master React Server Components. Personal: Read 24 books, learn photography, practice guitar daily...",
				createdAt: "2024-01-08T11:15:00Z",
				updatedAt: "2024-01-08T12:00:00Z",
			},
		])
	}, [])

	const handleCreateNote = () => {}

	const handleDeleteNote = (noteId: string) => {}

	return (
		<NotesListPage
			notes={notes}
			onCreateNote={handleCreateNote}
			onDeleteNote={(noteId) => setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId))}
		/>
	)
}

export function NotesListPage({ notes, onCreateNote, onDeleteNote }: NotesListPageProps) {
	const [searchTerm, setSearchTerm] = useState("")

	const deleteNote = (noteId: string, e: React.MouseEvent) => {
		e.stopPropagation()
		onDeleteNote(noteId)
	}

	const filteredNotes = notes.filter(
		(note) =>
			note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			note.content.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
	}

	const router = useRouter()

	return (
		<div className="space-y-8">
			<div className="bg-card">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-foreground">My Notes</h1>
					<Button onClick={onCreateNote} variant="outline">
						<PlusIcon className="w-4 h-4" />
					</Button>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
					<input
						type="text"
						placeholder="Search notes..."
						className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
			</div>

			<div>
				{filteredNotes.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-muted-foreground text-lg mb-2">
							{searchTerm ? "No notes found" : "No notes yet"}
						</div>
						<div className="text-muted-foreground text-sm mb-6">
							{searchTerm
								? "Try adjusting your search terms"
								: "Create your first note to get started"}
						</div>
						{!searchTerm && (
							<button
								onClick={onCreateNote}
								className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
							>
								Create Note
							</button>
						)}
					</div>
				) : (
					<div className="grid gap-4">
						{filteredNotes.map((note) => (
							<div
								onClick={() => {
									router.push(`/notes/${note.id}`)
								}}
								key={note.id}
								className="shadow-sm bg-card border border-border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer group"
							>
								<div className="flex items-start justify-between mb-3">
									<h3 className="text-lg font-semibold text-foreground group-hover:text-accent-foreground">
										{note.title}
									</h3>
									<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<button className="text-muted-foreground hover:text-foreground p-1 rounded">
											<EditIcon className="w-4 h-4" />
										</button>
										<button
											onClick={(e) => deleteNote(note.id, e)}
											className="text-muted-foreground hover:text-destructive p-1 rounded"
										>
											<TrashIcon className="w-4 h-4" />
										</button>
									</div>
								</div>

								<p className="text-muted-foreground text-sm mb-4 line-clamp-2">{note.content}</p>

								<div className="flex items-center text-xs text-muted-foreground">
									<CalendarIcon className="w-3 h-3 mr-1" />
									Updated {formatDate(note.updatedAt)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
