import { api } from "@/lib/api"
import { useAgentContextStore } from "@/stores/agent-context"
import { UIMessage } from "@/types/api"
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { use, useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"

export type ChatMessage = UserMessageType | AgentMessageType

export type UserMessageType = {
	role: "user"
	content: string
	id: string
}

export type AgentMessageType = {
	role: "assistant"
	content: string
	placement: "chat"
	id: string
	isStarting: boolean
	status?: string
}

export type AgentArtifactMesssageType = {
	role: "assistant"
	content: string
	placement: "artifact"
	id: string
	isStarting: boolean
}

type MessageChunk = {
	id: string
	source: "assistant"
	content: string
}

function join(chunks: MessageChunk[]): MessageChunk {
	const result: MessageChunk = {
		id: chunks[0].id,
		source: "assistant",
		content: "",
	}

	for (const chunk of chunks) {
		result.content += chunk.content
	}

	return result
}

export function useMessages(actionId: string) {
	const { data: history = [] } = useQuery({
		queryKey: ["action-history", actionId],
		queryFn: async () => {
			return (await api.actions.listActionChatHistory(actionId)).data
		},
		retry: false,
		// enabled: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	})

	const queryClient = useQueryClient()

	const [messages, setMessages] = useState<UIMessage[]>([])

	const [artifactMessage, setArtifactMessage] = useState<AgentArtifactMesssageType | null>(null)

	const [isActive, setIsActive] = useState(false)

	const [contexts, clearContext] = useAgentContextStore(
		useShallow((state) => [state.contexts, state.clear])
	)

	function invoke(message: string) {
		setIsActive(true)

		setMessages((prev) => [
			...prev,
			{ content: message, role: "user", id: crypto.randomUUID(), metadata: { context: contexts } },
			{
				content: ``,
				role: "assistant",
				id: crypto.randomUUID(),
				placement: "chat",
				isStarting: true,
			},
		])

		const encodedContexts = encodeURIComponent(
			JSON.stringify(contexts.map((c) => ({ ...c, ...c.metadata })))
		)

		const source = new EventSource(
			`http://localhost:3000/api/v1/actions/${actionId}/stream?token=${encodeURIComponent(
				localStorage.getItem("accessToken")!
			)}&prompt=${encodeURIComponent(message)}&context=${encodedContexts}`
		)

		clearContext()

		source.addEventListener("message", (e) => {
			const message = JSON.parse(e.data)

			const chunk = message.chunk as string

			if (message.done) {
				source.close()
				setIsActive(false)
				return
			}

			if (message.status) {
				setMessages((prev) => [...prev.slice(0, -1), { ...prev.at(-1)!, status: message.chunk }])
				return
			}

			if (message.title) {
				queryClient.invalidateQueries({ queryKey: ["actions-list"] })
				return
			}

			setMessages((prev) => [
				...prev.slice(0, -1),
				{ ...join([prev.at(-1), { content: chunk }]), isStarting: false },
			])
		})

		source.addEventListener("error", () => {
			source.close()
		})
	}

	function stop() {}

	return { messages: [...history, ...messages], invoke, stop, isActive, artifactMessage }
}
