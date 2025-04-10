"use client"
import { RefObject } from "react"
import { Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageType } from "@/types/chat"
import Message from "./message"

type MessageListProps = {
	messages: MessageType[]
	isTyping: boolean
	messagesEndRef: RefObject<HTMLDivElement>
}

export default function MessageList({ messages, isTyping, messagesEndRef }: MessageListProps) {
	return (
		<ScrollArea className="flex-1 px-4 py-6">
			<div className="mx-auto max-w-4xl">
				{messages.map((message) => (
					<Message key={message.id} message={message} />
				))}

				{isTyping && (
					<div className="mb-6 flex justify-start">
						<div className="flex max-w-[80%] gap-3">
							<Avatar className="mt-1 h-8 w-8 bg-primary/10">
								<AvatarFallback>
									<Bot className="h-4 w-4" />
								</AvatarFallback>
							</Avatar>

							<div>
								<div className="rounded-lg bg-muted px-4 py-3">
									<div className="flex items-center gap-1">
										<div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]"></div>
										<div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]"></div>
										<div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>
		</ScrollArea>
	)
}
