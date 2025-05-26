import { api } from "@/lib/api"
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

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
		refetchInterval: false,
	})

	const queryClient = useQueryClient()

	const [messages, setMessages] = useState<ChatMessage[]>([])

	const [artifactMessage, setArtifactMessage] = useState<AgentArtifactMesssageType | null>(null)

	const [isActive, setIsActive] = useState(false)

	async function invoke(message: string) {
		setIsActive(true)
		setMessages((prev) => [
			...prev,
			{ content: message, role: "user", id: crypto.randomUUID() },
			{
				content: ``,
				role: "assistant",
				id: crypto.randomUUID(),
				placement: "chat",
				isStarting: true,
			},
		])

		const source = new EventSource(
			`http://localhost:3000/api/v1/actions/${actionId}/stream?token=${encodeURIComponent(
				localStorage.getItem("accessToken")!
			)}&prompt=${encodeURIComponent(message)}`
		)

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

	// useEffect(() => {
	// 	const source = new EventSource(
	// 		`http://localhost:3000/api/v1/actions/${actionId}/stream?token=${encodeURIComponent(
	// 			localStorage.getItem("accessToken")!
	// 		)}`
	// 	)

	// 	source.addEventListener("open", () => {
	// 		console.log("nice")
	// 	})

	// 	source.addEventListener("message", (e) => {
	// 		const message = e.data // message chunk
	// 	})
	// 	return () => {
	// 		source.close()
	// 	}
	// }, [])

	// useEffect(() => {
	// 	const id = setTimeout(() => {
	// 		setArtifactMessage({
	// 			content: "dd",
	// 			role: "assistant",
	// 		})
	// 	}, 2000)

	// 	return () => {
	// 		clearTimeout(id)
	// 	}
	// }, [])
	return { messages: [...history, ...messages], invoke, stop, isActive, artifactMessage }
}
