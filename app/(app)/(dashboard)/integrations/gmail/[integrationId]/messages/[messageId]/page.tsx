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
	Printer,
	Store,
	Loader2,
	MessageCircleReply,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { LoadingState } from "@/components/loading-state"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { ErrorState } from "@/components/error-state"
import { IsolatedHtml } from "@/components/isolated-html"
import { EmailComposer } from "@/components/gmail-integration/email-composer"
import { useAgentContextStore } from "@/stores/agent-context"
import { useShallow } from "zustand/react/shallow"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

	const handlePrint = () => {
		window.print()
	}

	const [contexts, addContext] = useAgentContextStore(
		useShallow((state) => [state.contexts, state.addContext])
	)

	function handleAddContext() {
		if (!email) return

		if (contexts.find((c) => c.id === messageId)) {
			return
		}

		const context = {
			id: messageId,
			name: email.subject!,
			type: "email",
			metadata: {
				integrationId,
				messageId,
			},
		}

		addContext(context)

		toast.success("Gmail message added to context")
	}

	const [autoReplyMessage, setAutoReplyMessage] = useState<string>("")

	const replyGenerationMutation = useMutation({
		mutationKey: ["gmail-reply-generation", integrationId, messageId],
		mutationFn: async () => {
			return (
				await api.agents.invokeAgent({
					agentId: "email-reply-agent",
					context: [
						{
							type: "email",
							integrationId,
							messageId,
						},
					],
				})
			).data
		},
		onSuccess: (data) => {
			setAutoReplyMessage(data.body)
		},

		onError: () => {
			toast.error("Failed to generate reply")
		},
	})

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
								onClick={handleAddContext}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Add to context"
							>
								<Store className="w-5 h-5" />
							</button>
							<button
								onClick={() => handleReply("reply")}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								title="Reply"
							>
								<Reply className="w-5 h-5" />
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

					<div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
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

						<IsolatedHtml className="w-fit mx-auto p-2 md:p-5" htmlContent={email.body!} />
					</div>

					<div className="mt-6">
						<div className="flex items-center justify-between">
							<h3 className="font-medium mb-4">Quick Reply</h3>

							<Button
								disabled={replyGenerationMutation.isPending}
								onClick={() => replyGenerationMutation.mutate()}
								className="rounded-full"
								variant="ghost"
								size="icon"
								title="Auto generate reply"
							>
								{replyGenerationMutation.isPending ? (
									<Loader2 className="animate-spin" />
								) : (
									<MessageCircleReply />
								)}
							</Button>
						</div>
						<div className="border border-border rounded-lg overflow-hidden shadow-xs h-[200px]">
							<EmailComposer
								initial={autoReplyMessage}
								integrationId={integrationId}
								isReply={true}
								messageId={messageId}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
