"use client"
import { Bot, Loader2, Paperclip, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageType } from "@/types/chat"

type MessageProps = {
	message: MessageType
}

export default function Message({ message }: MessageProps) {
	const formatTimestamp = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	}

	return (
		<div
			className={`mb-6 flex ${message.sender === "assistant" ? "justify-start" : "justify-end"}`}
		>
			<div
				className={`flex max-w-[80%] gap-3 ${
					message.sender === "assistant" ? "flex-row" : "flex-row-reverse"
				}`}
			>
				<Avatar
					className={`mt-1 h-8 w-8 ${
						message.sender === "assistant" ? "bg-primary/10" : "bg-secondary"
					}`}
				>
					{message.sender === "assistant" ? (
						<>
							<AvatarImage src="/path-to-assistant-avatar.png" alt="AI" />
							<AvatarFallback>
								<Bot className="h-4 w-4" />
							</AvatarFallback>
						</>
					) : (
						<>
							<AvatarImage src="/path-to-user-avatar.png" alt="User" />
							<AvatarFallback>
								<User className="h-4 w-4" />
							</AvatarFallback>
						</>
					)}
				</Avatar>

				<div>
					<div
						className={`rounded-lg px-4 py-3 ${
							message.sender === "assistant"
								? "bg-muted text-foreground"
								: "bg-primary text-primary-foreground"
						}`}
					>
						<div className="whitespace-pre-line">{message.content}</div>

						{message.attachments && message.attachments.length > 0 && (
							<div className="mt-2 space-y-2">
								{message.attachments.map((file, index) => (
									<div
										key={index}
										className="flex items-center gap-2 rounded-md bg-background/50 p-2 text-xs"
									>
										<Paperclip className="h-3.5 w-3.5" />
										<div className="flex-1 truncate">{file.name}</div>
										<span className="text-muted-foreground">{file.size}</span>
									</div>
								))}
							</div>
						)}
					</div>

					<div
						className={`mt-1 flex items-center gap-1 text-xs text-muted-foreground ${
							message.sender === "assistant" ? "justify-start" : "justify-end"
						}`}
					>
						{message.status === "sending" && <Loader2 className="h-3 w-3 animate-spin" />}
						{message.status === "error" && <span className="text-destructive">Failed to send</span>}
						{formatTimestamp(message.timestamp)}
					</div>
				</div>
			</div>
		</div>
	)
}
