"use client"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { useRef } from "react"
import { Brain, X } from "lucide-react"
import {
	AgentArtifactMesssageType,
	AgentMessageType,
	ChatMessage,
	useMessages,
	UserMessageType,
} from "@/hooks/use-messages"
import { useParams } from "next/navigation"
import { useAuthUser } from "@/hooks/use-auth-user"
import { ChatInput } from "@/components/chat/chat-input"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useActionChat } from "@/hooks/use-action-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CodeBlock } from "@/components/code-block"
import { AgentContext } from "@/components/chat/agent-context"
import { UIMessage } from "@/types/api"

function AgentMessage({ message }: { message: UIMessage }) {
	return (
		<div className={`flex justify-start mb-3`}>
			{message.isStarting ? (
				<div className="p-3 animate-pulse flex items-center text-muted-foreground gap-x-2 leading-0">
					<div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
					{message.status && message.status}
				</div>
			) : (
				<div className={`prose rounded-lg bg-card`}>
					<ReactMarkdown components={{ code: CodeBlock }} remarkPlugins={[remarkGfm]}>
						{message.content}
					</ReactMarkdown>
					<p className={` mt-1 text-muted-foreground/70 text-right`}></p>
				</div>
			)}
		</div>
	)
}

function UserMessage({ message }: { message: UIMessage }) {
	const user = useAuthUser()

	const context: [] = (message as any).metadata?.context || []

	return (
		<div className="flex justify-start mb-3">
			<div className={`p-3 rounded-xl shadow bg-message text-sidebar-foreground min-w-0`}>
				<div className="flex gap-x-2">
					<Avatar className="h-6.5 w-6.5">
						<AvatarFallback className="bg-foreground font-bold text-background text-sm">
							{user.firstName.at(0)}
							{user.lastName.at(0)}
						</AvatarFallback>
					</Avatar>
					<pre className="flex-auto text-wrap">{message.content}</pre>
				</div>
				{context.length > 0 && (
					<div className="flex mt-3 overflow-x-auto scrollbar-hidden min-w-0 gap-2">
						{context.map((ctx: any, id) => (
							<AgentContext key={id} name="name" type={ctx.type} metadata={ctx} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

const ChatMessageItem: React.FC<{ message: UIMessage }> = ({ message }) => {
	const isUser = message.role === "user"

	if (isUser) {
		return <UserMessage message={message} />
	} else {
		return <AgentMessage message={message} />
	}
}

export default function ActionChatPage() {
	const user = useAuthUser()

	const { reset, prompt } = useActionChat()

	const chatMessagesEndRef = useRef<HTMLDivElement>(null)

	const { actionId } = useParams<{ actionId: string }>()

	const { messages, invoke, artifactMessage, isActive } = useMessages(actionId)

	useEffect(() => {
		if (prompt) {
			invoke(prompt)
			reset()
		}
	}, [])

	useEffect(() => {
		chatMessagesEndRef.current?.scrollIntoView()
	}, [messages, chatMessagesEndRef.current])

	useEffect(() => {
		console.log(messages)
	}, [messages])

	return (
		<div className="h-full flex relative">
			<Layout className="!pt-0">
				<div className="bg-card flex flex-col h-full text-foreground">
					<div className="overflow-y-auto pt-4 scrollbar-hidden flex-auto">
						{messages.map((msg) => (
							<ChatMessageItem key={msg.id} message={msg} />
						))}

						<div className="mt-20" ref={chatMessagesEndRef} />
					</div>

					<div className="-mt-10">
						<ChatInput disabled={isActive} onSubmit={invoke} />
					</div>
				</div>
			</Layout>
			{artifactMessage && <ArtifactBlock message={artifactMessage} />}
		</div>
	)
}

function ArtifactBlock({ message }: { message: AgentArtifactMesssageType }) {
	const [isVisible, setIsVisible] = useState(false)

	// CSS classes for animation
	const containerClasses = cn(
		"absolute lg:relative h-full p-2 transition-all duration-300 ease-in-out",
		isVisible ? "w-full opacity-100" : "w-0 opacity-0"
	)

	useEffect(() => {
		setIsVisible(true)
	})

	return (
		<div className={containerClasses}>
			<div className="h-full rounded-xl shadow-md border overflow-hidden">
				{/* Header */}
				<div className="flex gap-x-4 items-center p-4 border-b">
					<Brain className="w-4.5 h-4.5" />
					<span className="flex-1">Report summary</span>
					<Button variant="ghost" onClick={() => setIsVisible(false)}>
						<X />
					</Button>
				</div>
				{/* Content */}
				<div className="prose p-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 60px)" }}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
				</div>
			</div>
		</div>
	)
}
