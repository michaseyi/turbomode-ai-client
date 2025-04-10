// File: pages/ChatPage.tsx
"use client"
import { useState, useRef, useEffect } from "react"
import ChatHeader from "@/components/chat/chat-header"
import MessageList from "@/components/chat/message-list"
import MessageInput from "@/components/chat/message-input"
import { MessageType } from "@/types/chat"

export default function ChatPage() {
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
	const [conversationTitle, setConversationTitle] = useState("")
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

		// Update message status after a short delay
		setTimeout(() => {
			setMessages((prev) =>
				prev.map((msg) => (msg.id === newUserMessage.id ? { ...msg, status: "sent" } : msg))
			)

			// Simulate assistant response after a delay
			setTimeout(() => {
				setIsTyping(false)

				let responseContent = ""

				// If no conversation title yet, this is the first message, so set it as conversation title
				if (!conversationTitle) {
					setConversationTitle(message)
					responseContent = `I've created a new conversation titled "${message}". How can I help you with this topic?`
				} else {
					// Otherwise, respond contextually
					if (message.toLowerCase().includes("steps") || message.toLowerCase().includes("plan")) {
						responseContent =
							"Here's a suggested plan:\n\n1. Research requirements and gather information\n2. Create initial draft or prototype\n3. Review and gather feedback\n4. Make revisions based on feedback\n5. Finalize and deliver the completed work\n\nWould you like me to elaborate on any of these steps?"
					} else {
						responseContent =
							"I understand. How else can I help you with this? Would you like me to provide resources, break it down into smaller steps, or suggest any tools that might be helpful?"
					}
				}

				const assistantResponse: MessageType = {
					id: `msg-${Date.now()}-assistant`,
					content: responseContent,
					sender: "assistant",
					timestamp: new Date(),
				}

				setMessages((prev) => [...prev, assistantResponse])
			}, 1500)
		}, 500)
	}

	return (
		<div className="flex flex-col overflow-hidden  h-full">
			{/* <ChatHeader
				title={conversationTitle || "New Conversation"}
				status={conversationTitle ? "active" : undefined}
			/> */}
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
