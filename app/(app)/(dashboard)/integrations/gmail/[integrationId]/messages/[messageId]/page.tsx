"use client"

import React, { useState, useEffect } from "react"
import {
	ArrowLeft,
	Reply,
	ReplyAll,
	Forward,
	Star,
	Archive,
	Trash2,
	MoreVertical,
	Paperclip,
	Download,
	Eye,
	Calendar,
	Clock,
	User,
	ChevronDown,
	ChevronUp,
	Printer,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useParams, useRouter } from "next/navigation"
import { LoadingState } from "@/components/loading-state"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { ErrorState } from "@/components/error-state"
import { IsolatedHtml } from "@/components/isolated-html"

// TypeScript interfaces
interface EmailAttachment {
	id: string
	filename: string
	size: number
	mimeType: string
	downloadUrl?: string
}

interface EmailParticipant {
	name: string
	email: string
}

interface EmailDetail {
	id: string
	threadId: string
	from: EmailParticipant
	to: EmailParticipant[]
	cc?: EmailParticipant[]
	bcc?: EmailParticipant[]
	replyTo?: EmailParticipant
	subject: string
	body: {
		html?: string
		text: string
	}
	date: string
	isRead: boolean
	isStarred: boolean
	labels: string[]
	attachments: EmailAttachment[]
	messageId: string
	inReplyTo?: string
	references?: string[]
}

interface EmailThread {
	id: string
	subject: string
	messages: EmailDetail[]
	participants: EmailParticipant[]
	totalMessages: number
}

export default function EmailDetailPage() {
	const { messageId, integrationId } = useParams<{
		messageId: string
		integrationId: string
	}>()

	const {
		data: email,
		isError,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["gmail-message", integrationId, messageId],
		queryFn: async () => {
			return (await api.integrations.fetchGmailMessage(integrationId, messageId)).data
		},
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
		// enabled: false,
	})

	const [replyMode, setReplyMode] = useState<"none" | "reply" | "replyAll" | "forward">("none")

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes"
		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
	}

	const getInitials = (name: string): string => {
		return name[0]?.toUpperCase() || ""
	}

	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	const handleReply = (mode: "reply" | "replyAll" | "forward") => {
		setReplyMode(mode)
	}

	const handleDownloadAttachment = (attachment: EmailAttachment) => {}

	const handlePrint = () => {
		window.print()
	}

	return (
		<div className="pb-4">
			{isLoading ? (
				<LoadingState />
			) : isError ? (
				<ErrorState
					onRetry={() => {
						refetch()
					}}
				/>
			) : !email ? (
				<div className="text-center">
					<p className="text-muted-foreground">Email not found</p>
				</div>
			) : (
				<div>
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center space-x-4">
							<button
								onClick={handleGoBack}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
						</div>

						<div className="flex items-center space-x-2">
							<button
								onClick={() => handleReply("reply")}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Reply"
							>
								<Reply className="w-5 h-5" />
							</button>
							<button
								onClick={() => handleReply("replyAll")}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Reply All"
							>
								<ReplyAll className="w-5 h-5" />
							</button>
							<button
								onClick={() => handleReply("forward")}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Forward"
							>
								<Forward className="w-5 h-5" />
							</button>
							<div className="w-px h-6 bg-border"></div>
							<button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Archive">
								<Archive className="w-5 h-5" />
							</button>
							<button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
								<Trash2 className="w-5 h-5" />
							</button>
							<button
								onClick={handlePrint}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Print"
							>
								<Printer className="w-5 h-5" />
							</button>
							<button
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="More actions"
							>
								<MoreVertical className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Email Content */}
					<div className="bg-card border border-border rounded-lg overflow-hidden">
						{/* Email Header */}
						<div className="p-3 md:p-6 border-b border-border">
							<div className="flex flex-col md:flex-row gap-2 items-start justify-between mb-4">
								<div className="flex items-start space-x-2 md:space-x-4">
									<div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-lg font-medium text-primary">
											{getInitials(email.from!)}
										</span>
									</div>
									<div className="flex-1">
										<h2 className="text-lg md:text-xl font-semibold mb-2">{email.subject}</h2>
										<div className="space-y-1 text-sm text-muted-foreground">
											<div className="flex items-center space-x-2">
												<User className="w-4 h-4" />
												<span>
													<span className="text-muted-foreground">{email.from}</span>
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Clock className="w-4 h-4" />
												<span>{formatDate(email.internalDate)}</span>
											</div>
										</div>
									</div>
								</div>

								{/* Labels */}
								{email.labelIds.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{email.labelIds.map((label) => (
											<span
												key={label}
												className="px-2 py-1 text-xs bg-chart-1 text-white rounded-full"
											>
												{label.toLowerCase()}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Recipients */}
							<div className="space-y-2 text-sm">
								<div className="flex items-start space-x-2">
									<span className="text-muted-foreground font-medium min-w-[60px]">To:</span>
									<div className="flex flex-wrap gap-2">
										{email.to.map((recipient, index) => (
											<span key={index} className="text-foreground">
												{recipient}
												{index < email.to.length - 1 && ","}
											</span>
										))}
									</div>
								</div>

								{email.cc && email.cc.length > 0 && (
									<div className="flex items-start space-x-2">
										<span className="text-muted-foreground font-medium min-w-[60px]">Cc:</span>
										<div className="flex flex-wrap gap-2">
											{email.cc.map((recipient, index) => (
												<span key={index} className="text-foreground">
													{recipient}
													{index < email.cc!.length - 1 && ","}
												</span>
											))}
										</div>
									</div>
								)}

								{email.bcc && email.bcc.length > 0 && (
									<div className="flex items-start space-x-2">
										<span className="text-muted-foreground font-medium min-w-[60px]">Bcc:</span>
										<div className="flex flex-wrap gap-2">
											{email.bcc.map((recipient, index) => (
												<span key={index} className="text-foreground">
													{recipient}
													{index < email.bcc!.length - 1 && ","}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Attachments */}
						{/* {email.attachments.length > 0 && (
							<div className="p-6 border-b border-border">
								<div className="flex items-center space-x-2 mb-4">
									<Paperclip className="w-5 h-5 text-muted-foreground" />
									<span className="font-medium">
										{email.attachments.length} Attachment{email.attachments.length !== 1 ? "s" : ""}
									</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{email.attachments.map((attachment) => (
										<div
											key={attachment.id}
											className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
										>
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
													<Paperclip className="w-5 h-5 text-primary" />
												</div>
												<div>
													<div className="font-medium text-sm">{attachment.filename}</div>
													<div className="text-xs text-muted-foreground">
														{formatFileSize(attachment.size)}
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<button
													onClick={() => handleDownloadAttachment(attachment)}
													className="p-2 hover:bg-muted rounded-lg transition-colors"
													title="Download"
												>
													<Download className="w-4 h-4" />
												</button>
												<button
													className="p-2 hover:bg-muted rounded-lg transition-colors"
													title="Preview"
												>
													<Eye className="w-4 h-4" />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)} */}

						<IsolatedHtml className="w-fit mx-auto p-2 md:p-5" htmlContent={email.body!} />
					</div>

					<div className="mt-6 bg-card border border-border rounded-lg p-6">
						<h3 className="font-medium mb-4">Quick Reply</h3>
						<div className="space-y-4">
							<textarea
								className="w-full h-32 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
								placeholder="Type your reply..."
							/>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
										Send
									</button>
									<button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
										Save Draft
									</button>
								</div>
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Paperclip className="w-4 h-4" />
									<span>Attach files</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
