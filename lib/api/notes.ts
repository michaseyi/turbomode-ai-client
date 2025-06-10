import {
	Action,
	ApiDataResponse,
	DetailedNote,
	Note,
	NoteQuery,
	PaginatedApiDataResponse,
	UpdateNoteProps,
} from "@/types/api"
import { request, wrapper } from "./api-utils"

export async function fetchNotes(page: number, limit: number = 10, query?: NoteQuery) {
	const response = await wrapper(() =>
		request.get<PaginatedApiDataResponse<Note[]>>("/notes", {
			params: {
				...query,
				page,
				limit,
			},
		})
	)
	return response.data
}

export async function searchNotes(searchTerm: string, page: number, limit: number = 10) {
	const response = await wrapper(() =>
		request.get<PaginatedApiDataResponse<Note[]>>("/notes/search", {
			params: {
				text: searchTerm,
				page,
				limit,
			},
		})
	)
	return response.data
}

export async function fetchNote(noteId: string) {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<DetailedNote>>(`/notes/${noteId}`, {})
	)
	return response.data
}

export async function deleteNote(noteId: string) {
	const response = await wrapper(() =>
		request.delete<ApiDataResponse<undefined>>(`/notes/${noteId}`)
	)
	return response.data
}

export async function createNote() {
	const response = await wrapper(() => request.post<ApiDataResponse<Note>>(`/notes`))
	return response.data
}

export async function updateNote(noteId: string, update: UpdateNoteProps) {
	const response = await wrapper(() =>
		request.patch<ApiDataResponse<undefined>>(`/notes/${noteId}`, update)
	)
	return response.data
}
