"use client"

import React, { createContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAgentContextStore } from "@/stores/agent-context"

export type ActionChatT = {
	initiate: (message: string) => Promise<void>
	reset: () => void
	prompt: string | null
}

export const ActionChatContext = createContext<ActionChatT>({} as ActionChatT)

type ActionChatProviderProp = {
	children: React.ReactNode
}

export function ActionChatProvider({ children }: ActionChatProviderProp) {
	const router = useRouter()

	const queryClient = useQueryClient()

	const m = useMutation({
		mutationKey: ["create-new-action"],
		mutationFn: async () => {
			return (await api.actions.createAction()).data
		},
	})

	const [prompt, setPrompt] = useState<string | null>(null)

	async function initiate(message: string): Promise<void> {
		const action = await m.mutateAsync()
		setPrompt(message)
		router.push(`/actions/${action.id}`)
		queryClient.invalidateQueries({ queryKey: ["actions-list"] })
	}

	const clear = useAgentContextStore((state) => state.clear)

	async function reset() {
		setPrompt(null)
		clear()
	}

	return (
		<ActionChatContext.Provider value={{ initiate, reset, prompt }}>
			{children}
		</ActionChatContext.Provider>
	)
}
