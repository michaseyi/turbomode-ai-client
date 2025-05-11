"use client"
import { useState, useRef, useEffect } from "react"
import MessageList from "@/components/chat/message-list"
import MessageInput from "@/components/chat/message-input"
import { MessageType } from "@/types/chat"

export default function NewActionPage() {
	const [messages, setMessages] = useState<MessageType[]>([
		{
			id: "welcome-message",
			content:
				"Hi, I'm Turbomode AI. I can help you create and manage tasks. What would you like to work on today?",
			sender: "assistant",
			timestamp: new Date(),
		},
	])
	const [inputValue, setInputValue] = useState("")
	const [isTyping, setIsTyping] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	// Handle sending a message
	const handleSendMessage = (
		message: string,
		attachments?: { name: string; size: string; type: string }[]
	) => {
		if (!message.trim() && (!attachments || attachments.length === 0)) return

		// Add user message
		const newUserMessage: MessageType = {
			id: `msg-${Date.now()}-user`,
			content: message,
			sender: "user",
			timestamp: new Date(),
			status: "sending",
			attachments,
		}

		setMessages((prev) => [...prev, newUserMessage])
		setInputValue("")
		setIsTyping(true)
	}

	return (
		<div className="flex flex-col overflow-hidden h-full">
			<div className="overflow-auto flex-1">
				<MessageList
					messages={messages}
					isTyping={isTyping}
					messagesEndRef={messagesEndRef as any}
				/>
			</div>

			<MessageInput value={inputValue} onChange={setInputValue} onSendMessage={handleSendMessage} />
		</div>
	)
}
