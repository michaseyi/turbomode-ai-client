export type MessageType = {
	id: string
	content: string
	sender: "user" | "assistant"
	timestamp: Date
	status?: "sending" | "sent" | "error"
	attachments?: { name: string; size: string; type: string }[]
}
