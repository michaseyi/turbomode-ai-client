import { create } from "zustand"

interface AgentContextState {
	contexts: Array<{
		id: string
		name: string
		type: string
		metadata: Record<string, any>
	}>

	prompt: string

	addContext: (context: {
		id: string
		name: string
		type: string
		metadata: Record<string, any>
	}) => void

	removeContext: (id: string) => void

	setPrompt: (prompt: string) => void

	clear: () => void
}

export const useAgentContextStore = create<AgentContextState>((set) => ({
	contexts: [],

	prompt: "",

	setPrompt: (prompt) => set({ prompt }),

	addContext: (context) =>
		set((state) => ({
			contexts: [...state.contexts, context],
		})),

	removeContext: (id) =>
		set((state) => ({
			contexts: state.contexts.filter((context) => context.id !== id),
		})),

	clear: () => set({ contexts: [], prompt: "" }),
}))
